/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { presetCases } from './src/server/presets';
import { Case, Suspect, Evidence, TimelineEvent } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// In-memory databases
let activeCases: Case[] = [...presetCases];
let solvedArchive: Case[] = [];
let userStats = {
  totalPlayed: 0,
  totalSolved: 0,
  xp: 150,
  rank: 'Junior Sleuth',
};

// Check if Gemini is available
app.get('/api/gemini/status', (req, res) => {
  res.json({
    available: !!ai,
    message: ai ? 'Gemini AI is connected and active.' : 'Operating in Offline Mode (Template engines active).',
  });
});

// Calculate Bayesian probabilities
export function calculateBayesianProbabilities(suspects: Suspect[]): any[] {
  const likelihoods = suspects.map((s) => {
    // Smoothed values to avoid absolute zeros or ones
    const p_motive = 0.15 + 0.7 * (s.motiveScore / 100);
    const p_opportunity = 0.15 + 0.7 * (s.opportunityScore / 100);
    const p_alibi_fail = 0.15 + 0.7 * ((100 - s.alibiStrength) / 100);

    // Witness factor is modified by whether opportunity matches
    let p_witness = 0.5;
    if (s.opportunityScore > 50) {
      p_witness = 0.2 + 0.6 * (s.witnessReliability / 100);
    } else {
      p_witness = 0.2 + 0.6 * ((100 - s.witnessReliability) / 100);
    }

    const fp_factor = s.fingerprintMatch ? 2.5 : 1.0;
    const likelihood = p_motive * p_opportunity * p_alibi_fail * p_witness * fp_factor;

    return {
      id: s.id,
      name: s.name,
      motiveFactor: Number(p_motive.toFixed(3)),
      opportunityFactor: Number(p_opportunity.toFixed(3)),
      alibiFactor: Number(p_alibi_fail.toFixed(3)),
      witnessFactor: Number(p_witness.toFixed(3)),
      evidenceWeight: fp_factor,
      likelihood,
    };
  });

  const totalLikelihood = likelihoods.reduce((sum, item) => sum + item.likelihood, 0);

  const results = likelihoods.map((item) => {
    const rawProb = totalLikelihood > 0 ? (item.likelihood / totalLikelihood) * 100 : 33.3;
    const probability = Math.round(rawProb * 10) / 10;

    return {
      suspectId: item.id,
      suspectName: item.name,
      probability,
      bayesianCalculation: {
        motiveFactor: item.motiveFactor,
        opportunityFactor: item.opportunityFactor,
        alibiFactor: item.alibiFactor,
        witnessFactor: item.witnessFactor,
        evidenceWeight: item.evidenceWeight,
      },
      reasoning: '',
    };
  });

  // Normalize to guarantee sum is exactly 100%
  const sum = results.reduce((s, r) => s + r.probability, 0);
  if (Math.abs(sum - 100) > 0.01) {
    const diff = 100 - sum;
    let maxIdx = 0;
    for (let i = 1; i < results.length; i++) {
      if (results[i].probability > results[maxIdx].probability) {
        maxIdx = i;
      }
    }
    results[maxIdx].probability = Number((results[maxIdx].probability + diff).toFixed(1));
  }

  return results;
}

// REST: Get all active cases
app.get('/api/cases', (req, res) => {
  res.json(activeCases);
});

// REST: Get statistics
app.get('/api/stats', (req, res) => {
  res.json(userStats);
});

// REST: Get solved archive
app.get('/api/archive', (req, res) => {
  res.json(solvedArchive);
});

// Offline procedural generator datasets
const offlineThemes = [
  {
    titleTemplate: 'The Clocktower Conspiracy',
    victim: 'Arthur Pendelton (Veteran Clockmaker)',
    location: 'Old Town Clocktower, Gears Room',
    weather: 'Chilly Fog and Light Drizzle',
    timeOfCrime: '10:15 PM',
    difficulty: 'medium' as const,
    description: 'The ancient clocktower went completely silent at exactly 10:15 PM. Inside the gear chamber, Arthur Pendelton was discovered crushed by the pendulum mechanism. A heavy iron cog was wedged in the escape wheel, and an oily ledger with missing pages lay on the floor.',
    suspects: [
      {
        id: 'sus-clock-1',
        name: 'Silas Thorne',
        role: 'The Disgruntled Apprentice',
        avatarUrl: '🧑‍🔧',
        motive: 'Thorne was caught copying clock mechanism designs to sell to a steam syndicate. Pendelton was going to ruin his career.',
        motiveScore: 88,
        opportunity: 'He held keys to the lockroom, and clock oil stains matched his jacket cuffs.',
        opportunityScore: 75,
        witnessStatement: 'Swears he was drinking in the local pub, but the barkeep remembers him leaving from 10:00 PM to 10:30 PM.',
        witnessReliability: 65,
        alibi: 'Drinking in the Rusty Cog Tavern.',
        alibiStrength: 40,
        fingerprintMatch: true,
        guilty: true,
      },
      {
        id: 'sus-clock-2',
        name: 'Eleanor Finch',
        role: 'The Clocktower Landlord',
        avatarUrl: '👩‍💼',
        motive: 'Avery refused to vacate the clocktower to make way for a high-rise bank project. His lease was legally unbreakable unless he died.',
        motiveScore: 75,
        opportunity: 'Seen walking near the clocktower lobby at 10:00 PM in elegant high-heeled boots.',
        opportunityScore: 50,
        witnessStatement: 'Saw Silas running down the stairs. Claims she was only walking in the gardens nearby.',
        witnessReliability: 80,
        alibi: 'Hosting a real estate gala. Left the parlor room for roughly 25 minutes to get fresh air.',
        alibiStrength: 60,
        fingerprintMatch: false,
        guilty: false,
      },
      {
        id: 'sus-clock-3',
        name: 'Dr. Thaddeus Sterling',
        role: 'The Rival Inventor',
        avatarUrl: '👨‍🔬',
        motive: 'Sterlings new mechanical clock failed validation. Avery publicly labeled his design a dangerous fire hazard.',
        motiveScore: 65,
        opportunity: 'He knew the gear system layout perfectly. Was logged entering the clock perimeter at 9:50 PM.',
        opportunityScore: 60,
        witnessStatement: 'Claims he saw someone climbing the clock tower scaffolding from his carriage at 10:10 PM.',
        witnessReliability: 50,
        alibi: 'Riding his private carriage home. The carriage driver confirmed the pickup and timeline.',
        alibiStrength: 90,
        fingerprintMatch: false,
        guilty: false,
      },
    ],
    evidence: [
      {
        id: 'ev-gearoil',
        title: 'Oily Glove',
        type: 'forensic' as const,
        description: 'An oil-soaked leather glove matching the apprentice Silas Thornes work bag. It was jammed near the main driving gears.',
        icon: 'Scissors',
        importance: 'high' as const,
      },
      {
        id: 'ev-clockledger',
        title: 'Torn Ledger',
        type: 'forensic' as const,
        description: 'Arthur Pendeltons record journal with pages on mechanical designs torn out. Fingerprints match Silas.',
        icon: 'Database',
        importance: 'high' as const,
      },
    ],
    timeline: [
      { id: 'tl-clock-1', time: '09:50 PM', description: 'Dr. Thaddeus Sterling enters the lower foyer.', suspectId: 'sus-clock-3', importance: 'neutral' as const },
      { id: 'tl-clock-2', time: '10:00 PM', description: 'Eleanor Finch is spotted in the courtyard nearby.', suspectId: 'sus-clock-2', importance: 'suspicious' as const },
      { id: 'tl-clock-3', time: '10:10 PM', description: 'A massive metallic crash echoes inside the boiler shafts.', suspectId: null, importance: 'critical' as const },
      { id: 'tl-clock-4', time: '10:15 PM', description: 'Clock gears grind to a sudden halt. Silas seen fleeing through the fire escape.', suspectId: 'sus-clock-1', importance: 'critical' as const },
    ],
  },
  {
    titleTemplate: 'The Neon Shimmer Murder',
    victim: 'Kira Vance (Holo-Artist)',
    location: 'Sector 4, Prism Gallery Loft',
    weather: 'Acid Rain and Flickering Neon Lights',
    timeOfCrime: '01:30 AM',
    difficulty: 'easy' as const,
    description: 'Celebrated digital artist Kira Vance was found unresponsive in her neon-lit gallery. Her brain-link crown, which streams neural art, had been loaded with a lethal electrical surge. A customized chip was discovered wired into the junction box, bypassing the surge dampers.',
    suspects: [
      {
        id: 'sus-neon-1',
        name: 'Byte-Zero',
        role: 'Renegade Netrunner',
        avatarUrl: '👩‍💻',
        motive: 'Vance stole a neural encryption algorithm that Byte-Zero spent years developing, publishing it as high art.',
        motiveScore: 82,
        opportunity: 'He possessed the military-grade deck required to bypass the main firewall at 1:28 AM.',
        opportunityScore: 90,
        witnessStatement: 'Admits hacking into the grid to inspect the logs, but claims he saw Lexus Stone swapping chips.',
        witnessReliability: 70,
        alibi: 'He was physically on the other side of Sector 4, but his deck connection was trace-routed back to Kiras loft router.',
        alibiStrength: 40,
        fingerprintMatch: false,
        guilty: false,
      },
      {
        id: 'sus-neon-2',
        name: 'Lexus Stone',
        role: 'The Jealous Collaborator',
        avatarUrl: '🥷',
        motive: 'Stone was about to be fired and replaced. Stone knew Kiras custom neural terminal codes and held a master override card.',
        motiveScore: 95,
        opportunity: 'Spotted entering the server room wearing a distinct thermal mask at 1:20 AM. His workbench contained sheared damper wires.',
        opportunityScore: 95,
        witnessStatement: 'Swears he was home playing sims. However, grid logs show his biometric ID card triggered the penthouse elevator at 1:15 AM.',
        witnessReliability: 40,
        alibi: 'Sim room log showing continuous login. But system audits showed the account was being run by a macro script.',
        alibiStrength: 20,
        fingerprintMatch: true,
        guilty: true,
      },
      {
        id: 'sus-neon-3',
        name: 'Dr. Catherine Lyre',
        role: 'The Bio-Hacker Doc',
        avatarUrl: '👩‍🔬',
        motive: 'Catherine supplied Kira with unregulated neural stimulants. If Kiras illicit habit was discovered, Catherine would lose her medical license.',
        motiveScore: 60,
        opportunity: 'She visited the loft earlier to deliver stimulants, leaving at 1:00 AM.',
        opportunityScore: 55,
        witnessStatement: 'Heard Lexus Stone whispering aggressively with Kira in the foyer at 1:00 AM.',
        witnessReliability: 85,
        alibi: 'Was back at her private clinic by 1:15 AM. Clinic entrance scanners confirm her physical presence.',
        alibiStrength: 95,
        fingerprintMatch: false,
        guilty: false,
      },
    ],
    evidence: [
      {
        id: 'ev-neon-chip',
        title: 'Overclocked Bypass Chip',
        type: 'forensic' as const,
        description: 'A glowing cyan microchip retrieved from the main hub. Serial number traces back to Lexus Stones private tech storage cabinet.',
        icon: 'Cpu',
        importance: 'high' as const,
      },
      {
        id: 'ev-neon-card',
        title: 'Keycard Override',
        type: 'location' as const,
        description: 'Elevator log confirming Lexus Stones card accessed the penthouse floor 15 minutes before the neural explosion.',
        icon: 'Lock',
        importance: 'high' as const,
      },
    ],
    timeline: [
      { id: 'tl-neon-1', time: '01:00 AM', description: 'Dr. Catherine Lyre leaves the loft after delivering stimulants.', suspectId: 'sus-neon-3', importance: 'neutral' as const },
      { id: 'tl-neon-2', time: '01:15 AM', description: 'Lexus Stones master keycard triggers the penthouse security door.', suspectId: 'sus-neon-2', importance: 'suspicious' as const },
      { id: 'tl-neon-3', time: '01:28 AM', description: 'A sudden power surge flashes through the gallery circuit breaker.', suspectId: 'sus-neon-1', importance: 'critical' as const },
      { id: 'tl-neon-4', time: '01:30 AM', description: 'Estimated time of death. Neural art stream disconnects with a blast warning.', suspectId: null, importance: 'critical' as const },
    ],
  },
];

// REST: Generate a brand-new, procedural case using Gemini OR our advanced offline procedural generator
app.post('/api/cases/generate', async (req, res) => {
  try {
    const difficulty = req.body.difficulty || 'medium';

    if (ai) {
      // Prompt Gemini to generate a Case conforming exactly to our types.ts schema.
      const prompt = `You are a mystery thriller writer. Generate a highly immersive, cohesive detective game case in JSON format for the "AI Crime Scene Investigator" game.
      The case should be set in a distinct environment (e.g. Victorian Noir, Cyberpunk, Arctic Base, Sunken Submarine, Jazz-era Club).
      The difficulty should be "${difficulty}".

      The output MUST conform strictly to the following JSON schema:
      {
        "title": "A short, thriller-style case title",
        "difficulty": "${difficulty}",
        "victim": "Name and short job title",
        "location": "The specific room/mansion name",
        "weather": "E.g. Torrential Sleet, Whispering Smog, Static Dust Storm",
        "timeOfCrime": "E.g. 03:15 AM",
        "description": "A gripping noir introduction detailing the crime scene, how the victim died, and the primary mystery.",
        "suspects": [
          {
            "id": "sus-1",
            "name": "Name",
            "role": "Role (e.g., The Disgruntled Partner, The Jealous Heir, The Secret Agent)",
            "avatarUrl": "A single suitable emoji representing them",
            "motive": "A deep and convincing narrative motive",
            "motiveScore": 85, // Integer between 30 and 100
            "opportunity": "What they were doing and how they had access",
            "opportunityScore": 70, // Integer between 20 and 100
            "witnessStatement": "Their personal testimony accusing someone else or defending themselves",
            "witnessReliability": 60, // Integer between 20 and 100
            "alibi": "Their claimed alibi",
            "alibiStrength": 45, // Integer between 10 and 100
            "fingerprintMatch": false, // Exactly one suspect in the array must have fingerprintMatch: true
            "guilty": false // Exactly one suspect in the array must be guilty: true. The guilty suspect should generally have high motive score, high opportunity score, low alibi strength, and/or fingerprintMatch: true.
          }
        ],
        "evidence": [
          {
            "id": "ev-1",
            "title": "Title of clue",
            "type": "one of: footprint, weather, location, witness, timeline, forensic",
            "description": "Fascinating and precise description of what was found and how it connects to the suspects.",
            "icon": "One of these valid Lucide icon names: Footprints, Compass, ShieldAlert, Cpu, Wrench, Lock, Database, Paperclip, Scissors, CupSoda, Wind, Terminal",
            "importance": "low or medium or high"
          }
        ],
        "timeline": [
          {
            "id": "tl-1",
            "time": "Timeline event timestamp (e.g., 10:30 PM)",
            "description": "What occurred, placing a suspect or clue at the scene",
            "suspectId": "The corresponding suspect's ID (or null)",
            "importance": "neutral or suspicious or critical"
          }
        ]
      }

      Provide ONLY valid JSON. Ensure there is exactly one guilty suspect and exactly one fingerprintMatch: true. Do not warp JSON in backticks or markdown outside the JSON block.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedCase: Case = JSON.parse(cleanJson);

      // Supply generated IDs to ensure uniqueness
      const caseId = `proc-${Date.now()}`;
      generatedCase.id = caseId;
      generatedCase.solved = false;
      generatedCase.guessedSuspectId = null;

      // Double check constraints
      let guiltyCount = 0;
      let fpCount = 0;
      generatedCase.suspects.forEach((s, idx) => {
        if (!s.id) s.id = `sus-gen-${idx + 1}`;
        if (s.guilty) guiltyCount++;
        if (s.fingerprintMatch) fpCount++;
      });

      // Correct edge cases from model output if needed
      if (guiltyCount !== 1) {
        generatedCase.suspects.forEach((s) => (s.guilty = false));
        generatedCase.suspects[0].guilty = true;
      }
      if (fpCount !== 1) {
        generatedCase.suspects.forEach((s) => (s.fingerprintMatch = false));
        generatedCase.suspects[0].fingerprintMatch = true;
      }

      activeCases.unshift(generatedCase);
      res.json(generatedCase);
    } else {
      // Offline procedural generator: select and customize an offline theme
      const randomTheme = offlineThemes[Math.floor(Math.random() * offlineThemes.length)];
      const caseId = `proc-offline-${Date.now()}`;

      // Add a slight randomization to motive/opportunity scores
      const modifiedSuspects = randomTheme.suspects.map((s) => ({
        ...s,
        motiveScore: Math.min(100, Math.max(30, s.motiveScore + Math.floor(Math.random() * 11) - 5)),
        opportunityScore: Math.min(100, Math.max(30, s.opportunityScore + Math.floor(Math.random() * 11) - 5)),
        witnessReliability: Math.min(100, Math.max(30, s.witnessReliability + Math.floor(Math.random() * 11) - 5)),
        alibiStrength: Math.min(100, Math.max(10, s.alibiStrength + Math.floor(Math.random() * 11) - 5)),
      }));

      const newCase: Case = {
        id: caseId,
        title: `${randomTheme.titleTemplate} #${Math.floor(Math.random() * 900) + 100}`,
        difficulty,
        victim: randomTheme.victim,
        location: randomTheme.location,
        weather: randomTheme.weather,
        timeOfCrime: randomTheme.timeOfCrime,
        description: randomTheme.description,
        suspects: modifiedSuspects,
        evidence: randomTheme.evidence,
        timeline: randomTheme.timeline,
        solved: false,
        guessedSuspectId: null,
      };

      activeCases.unshift(newCase);
      res.json(newCase);
    }
  } catch (error: any) {
    console.error('Procedural case generation failed:', error);
    // In case of parsing or API error, fall back to offline preset to keep game running
    const fallbackTheme = offlineThemes[0];
    const caseId = `proc-err-fallback-${Date.now()}`;
    const newCase: Case = {
      id: caseId,
      title: `${fallbackTheme.titleTemplate} (Emergency Backup)`,
      difficulty: 'medium',
      victim: fallbackTheme.victim,
      location: fallbackTheme.location,
      weather: fallbackTheme.weather,
      timeOfCrime: fallbackTheme.timeOfCrime,
      description: `Investigate the tragic death of ${fallbackTheme.victim}. A connection error occurred during satellite upload, forcing our terminal into secure offline diagnostics mode.`,
      suspects: fallbackTheme.suspects,
      evidence: fallbackTheme.evidence,
      timeline: fallbackTheme.timeline,
      solved: false,
      guessedSuspectId: null,
    };
    activeCases.unshift(newCase);
    res.json(newCase);
  }
});

// REST: Predict suspects, compute Bayesian Posterior probabilities, and generate detailed reasoning chain
app.post('/api/cases/predict', async (req, res) => {
  const { caseId } = req.body;
  const currentCase = activeCases.find((c) => c.id === caseId) || solvedArchive.find((c) => c.id === caseId);

  if (!currentCase) {
    return res.status(404).json({ error: 'Case not found' });
  }

  // Calculate actual mathematical posterior probabilities using our Bayesian classifier
  const rankings = calculateBayesianProbabilities(currentCase.suspects);

  // High probability suspect is the top Bayesian score
  const sortedRankings = [...rankings].sort((a, b) => b.probability - a.probability);
  const mostLikelySuspect = currentCase.suspects.find((s) => s.id === sortedRankings[0].suspectId);

  let reasoningChain = '';
  let cluesSummary = '';

  if (ai) {
    try {
      // Build a hard-boiled noir ML analysis narrative using Gemini
      const suspectScoresText = currentCase.suspects
        .map(
          (s) =>
            `- ${s.name} (${s.role}): Motive Score=${s.motiveScore}%, Opportunity=${s.opportunityScore}%, Alibi Strength=${s.alibiStrength}%, Witness Reliability=${s.witnessReliability}%, Fingerprint Match=${s.fingerprintMatch}`
        )
        .join('\n');

      const prompt = `You are a high-tech detective agency's super-intelligence ML computer, analyzing a crime scene.
      Case: "${currentCase.title}"
      Victim: ${currentCase.victim}
      Location: ${currentCase.location}
      Weather: ${currentCase.weather}
      Time: ${currentCase.timeOfCrime}

      Suspect Variables analyzed by Bayesian network:
      ${suspectScoresText}

      Calculated ML Probabilities:
      ${sortedRankings.map((r) => `- ${r.suspectName}: ${r.probability}% probability`).join('\n')}

      Write a detailed, high-immersion detective investigation breakdown.
      Format it in two clear sections:
      1) "FORENSIC ANALYTICS CLUES SUMMARY": Summarize the evidence items (Muddy footprints, fingerprints, alibis, etc.) and explain what they mean physically.
      2) "BAYESIAN REASONING CHAIN": Write a narrative, hard-boiled, clinical explanation in the style of an explainable AI system. Explain why the highest probability suspect (${mostLikelySuspect?.name}) is predicted as the primary suspect, mentioning specific Bayes terms (Motive Factor, Opportunity Factor, and how Alibi strength/Witness reliability affected the network). Keep the tone tense, investigative, and technical.

      Return the analysis cleanly in markdown text. Do not wrap in extra JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const fullText = response.text || '';

      // Split text into summary and reasoning chain for cleaner UI separation
      const splits = fullText.split(/BAYESIAN REASONING CHAIN/i);
      cluesSummary = splits[0].replace(/FORENSIC ANALYTICS CLUES SUMMARY/i, '').trim();
      reasoningChain = splits[1] ? splits[1].trim() : fullText;
    } catch (error) {
      console.error('Gemini prediction narrative failed:', error);
      // Fallback below
    }
  }

  // Fallback narrative generation if Gemini was unavailable or errored
  if (!reasoningChain) {
    cluesSummary = `### Evidence Variables Registered:
- **Location Constraints**: The weather conditions (${currentCase.weather}) and location footprint analysis were cross-referenced.
- **Biometric Logs**: Fingerprint matches on the primary tool/weapon indicators were confirmed positive for the suspect carrying a fingerprint signature.
- **Witness Testimony Confidence**: Cross-referenced witness statements against known timelines, calculating a combined alignment index.`;

    reasoningChain = `### Posterior Probability Calculations (Bayesian Network):
- **Primary Suspect**: **${mostLikelySuspect?.name}** exhibits a compound probability of **${sortedRankings[0].probability}%** due to a high Motive Score (${mostLikelySuspect?.motiveScore}%) and an extremely weak Alibi Strength (${mostLikelySuspect?.alibiStrength}%).
- **Secondary Suspects**: The remaining suspects are statistically excluded because their alibi logs were fully verified by independent GPS tracking and telegraph registers, dropping their cumulative Bayes factor below threshold tolerances.
- **Classification Output**: The Gradient Boosting ensemble predicts **${mostLikelySuspect?.name}** with ${sortedRankings[0].probability > 60 ? 'HIGH' : 'MODERATE'} confidence.`;
  }

  res.json({
    rankings,
    reasoningChain,
    cluesSummary,
  });
});

// REST: Solve a case, register user guess, award XP/rank
app.post('/api/cases/solve', (req, res) => {
  const { caseId, guessedSuspectId } = req.body;
  const currentCase = activeCases.find((c) => c.id === caseId);

  if (!currentCase) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const selectedSuspect = currentCase.suspects.find((s) => s.id === guessedSuspectId);
  if (!selectedSuspect) {
    return res.status(400).json({ error: 'Suspect not found in this case' });
  }

  const correct = selectedSuspect.guilty;

  // Update case state
  currentCase.solved = true;
  currentCase.guessedSuspectId = guessedSuspectId;
  currentCase.solvedAt = new Date().toISOString();

  // Move from active to archive to keep active queue tidy
  activeCases = activeCases.filter((c) => c.id !== caseId);
  solvedArchive.unshift(currentCase);

  // Update User Statistics
  userStats.totalPlayed += 1;
  if (correct) {
    userStats.totalSolved += 1;
    userStats.xp += 100;
  } else {
    userStats.xp += 25; // consolation prize
  }

  // Dynamically update rank
  if (userStats.totalSolved >= 8) {
    userStats.rank = 'Master Detective (ML Division)';
  } else if (userStats.totalSolved >= 4) {
    userStats.rank = 'Senior forensic Profiler';
  } else if (userStats.totalSolved >= 2) {
    userStats.rank = 'Lead Crime Investigator';
  } else if (userStats.totalSolved >= 1) {
    userStats.rank = 'Detective First Class';
  }

  res.json({
    correct,
    actualCulprit: currentCase.suspects.find((s) => s.guilty),
    userStats,
  });
});

// REST: Extract metadata from a camera image/photo using Gemini and add to evidence board
app.post('/api/evidence/scan', async (req, res) => {
  try {
    const { caseId, image } = req.body;
    const currentCase = activeCases.find((c) => c.id === caseId) || solvedArchive.find((c) => c.id === caseId);

    if (!currentCase) {
      return res.status(404).json({ error: 'Active case not found' });
    }

    if (!image) {
      return res.status(400).json({ error: 'No image data found' });
    }

    // Extract mimeType and base64 string
    let mimeType = 'image/jpeg';
    let base64Data = image;
    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    let generatedClue: any = null;

    if (ai) {
      const suspectsText = currentCase.suspects
        .map((s) => `- ${s.name} (${s.role}): Motive: ${s.motive}`)
        .join('\n');

      const prompt = `You are an expert digital forensics scanner at a high-tech crime scene.
      We have captured a visual snapshot of a physical object found at the scene.
      
      Case details:
      - Title: "${currentCase.title}"
      - Victim: ${currentCase.victim}
      - Location: ${currentCase.location}
      - Weather: ${currentCase.weather}
      
      Suspect Registry:
      ${suspectsText}

      Please analyze the provided image part and invent a highly realistic, interesting crime clue inspired by the image and the case context. Make it directly relate to or highlight some clues about the suspects.
      
      You MUST respond with a single, valid JSON object matching the following TypeScript interface schema:
      {
        "title": "A short, vivid detective-style title of the clue (e.g., Blood-Splattered Watch, Torn Blueprint)",
        "type": "one of: footprint | weather | location | witness | timeline | forensic",
        "description": "A detailed 2-3 sentences description detailing what microscopic, digital, or physical evidence traces were detected on this object and how it correlates to the suspects.",
        "icon": "One of these valid Lucide icon names matching the item: Footprints, Compass, ShieldAlert, Cpu, Wrench, Lock, Database, Paperclip, Scissors, CupSoda, Wind, Terminal",
        "importance": "low or medium or high"
      }

      Provide ONLY valid JSON. Do not wrap the JSON inside markdown backticks or explanations.`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      generatedClue = JSON.parse(cleanJson);
    }

    // Fallback if AI not available or errored
    if (!generatedClue) {
      const fallbacks = [
        {
          title: 'Unidentified Fiber Sample',
          type: 'forensic' as const,
          description: `A synthetic thread was isolated from the scanned item, coated in specialized grease matching the gears room environment.`,
          icon: 'Wrench',
          importance: 'medium' as const,
        },
        {
          title: 'Damaged Electronic Device',
          type: 'forensic' as const,
          description: `A scorched microchip containing corrupted logs. System trace routes implicate terminal overrides near the estimated timeline.`,
          icon: 'Cpu',
          importance: 'high' as const,
        },
        {
          title: 'Atmospheric Dust Residue',
          type: 'weather' as const,
          description: `Localized pollen and humidity patterns extracted from the scanned sample surface align with the active weather grid coordinates.`,
          icon: 'Wind',
          importance: 'low' as const,
        },
      ];
      generatedClue = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Set unique ID
    generatedClue.id = `ev-scan-${Date.now()}`;

    // Append to active case evidence board in-memory
    currentCase.evidence.push(generatedClue);

    res.json({
      success: true,
      clue: generatedClue,
      evidence: currentCase.evidence,
    });
  } catch (err: any) {
    console.error('Evidence scanning endpoint failed:', err);
    res.status(500).json({ error: 'Internal processing failure: ' + err.message });
  }
});

// Setup Vite & static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Crime Scene Investigator running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
