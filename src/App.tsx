/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Case, Suspect, Evidence, PredictionResult, UserStats } from './types';
import DeskHeader from './components/DeskHeader';
import SuspectCard from './components/SuspectCard';
import EvidenceBoard from './components/EvidenceBoard';
import TimelineView from './components/TimelineView';
import PredictionPanel from './components/PredictionPanel';
import ExplanationEngine from './components/ExplanationEngine';
import CaseArchive from './components/CaseArchive';
import EvidenceScanner from './components/EvidenceScanner';
import InvestigationLog from './components/InvestigationLog';
import LandingPage from './components/LandingPage';
import OpeningCinematic from './components/OpeningCinematic';
import DetectiveProfile from './components/DetectiveProfile';
import AboutArgus from './components/AboutArgus';
import { Play, Clipboard, Compass, Brain, Sparkles, FolderOpen, AlertCircle, HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// Dynamic Bayesian computation for real-time trace graphing
function calculateDynamicBayesian(suspects: Suspect[], evidenceList: Evidence[], selectedIds: string[]): any[] {
  const likelihoods = suspects.map((s) => {
    let motiveScore = s.motiveScore;
    let opportunityScore = s.opportunityScore;
    let alibiStrength = s.alibiStrength;
    let witnessReliability = s.witnessReliability;
    let fingerprintMatch = s.fingerprintMatch;

    selectedIds.forEach((evId) => {
      const ev = evidenceList.find((e) => e.id === evId);
      if (!ev) return;
      
      const isAssociated = ev.description.toLowerCase().includes(s.name.toLowerCase()) || 
                           ev.title.toLowerCase().includes(s.name.toLowerCase());
      
      if (isAssociated) {
        if (ev.type === 'forensic') {
          fingerprintMatch = true;
        } else if (ev.type === 'witness') {
          witnessReliability = Math.max(15, witnessReliability - 25);
        } else if (ev.type === 'location' || ev.type === 'footprint') {
          opportunityScore = Math.min(100, opportunityScore + 25);
        } else if (ev.type === 'timeline') {
          opportunityScore = Math.min(100, opportunityScore + 15);
        } else {
          motiveScore = Math.min(100, motiveScore + 20);
        }
      }
    });

    const p_motive = 0.15 + 0.7 * (motiveScore / 100);
    const p_opportunity = 0.15 + 0.7 * (opportunityScore / 100);
    const p_alibi_fail = 0.15 + 0.7 * ((100 - alibiStrength) / 100);

    let p_witness = 0.5;
    if (opportunityScore > 50) {
      p_witness = 0.2 + 0.6 * (witnessReliability / 100);
    } else {
      p_witness = 0.2 + 0.6 * ((100 - witnessReliability) / 100);
    }

    const fp_factor = fingerprintMatch ? 2.5 : 1.0;
    const likelihood = p_motive * p_opportunity * p_alibi_fail * p_witness * fp_factor;

    return {
      id: s.id,
      name: s.name,
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
    };
  });

  // Normalize to 100%
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

export default function App() {
  // Game states
  const [currentScreen, setCurrentScreen] = useState<'opening' | 'menu' | 'game' | 'profile' | 'about'>('opening');
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [activeCases, setActiveCases] = useState<Case[]>([]);
  const [archive, setArchive] = useState<Case[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalPlayed: 0,
    totalSolved: 0,
    xp: 150,
    rank: 'Junior Sleuth',
  });

  // Selection states
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [highlightedSuspectId, setHighlightedSuspectId] = useState<string | null>(null);

  // AI & ML prediction states
  const [rankings, setRankings] = useState<PredictionResult[]>([]);
  const [cluesSummary, setCluesSummary] = useState<string>('');
  const [reasoningChain, setReasoningChain] = useState<string>('');

  // Investigation logs and dynamic Bayesian trajectory state
  const [caseNotes, setCaseNotes] = useState<Record<string, string[]>>({});
  const [predictionHistory, setPredictionHistory] = useState<Array<{
    label: string;
    [suspectId: string]: any;
  }>>([]);

  const lastStateRef = useRef<string>('');

  const getInitialNotesForCase = (c: Case) => {
    return [
      `CRIME_LOG_01: Active case file created. Victim: ${c.victim}.`,
      `CRIME_LOG_02: Location: ${c.location}. Estimated time of crime is ${c.timeOfCrime}.`,
      `CRIME_LOG_03: Environmental readings show ${c.weather}.`
    ];
  };

  const handleAddNote = (text: string) => {
    if (!activeCase) return;
    setCaseNotes((prev) => {
      const currentNotes = prev[activeCase.id] || getInitialNotesForCase(activeCase);
      return {
        ...prev,
        [activeCase.id]: [...currentNotes, `DEDUCTION_LOG: ${text}`]
      };
    });
  };

  const handleClueScanned = (newClue: Evidence) => {
    if (!activeCase) return;
    const updatedCase = {
      ...activeCase,
      evidence: [...activeCase.evidence, newClue]
    };
    setActiveCase(updatedCase);
    
    // Auto pin the scanned evidence
    setSelectedEvidenceIds((prev) => [...prev, newClue.id]);
    
    // Log the scanned action
    const noteText = `SYSTEM_SCAN: New evidence item [${newClue.title}] discovered and added to corkboard.`;
    handleAddNote(noteText);
  };

  // Sync Bayesian trajectory and note files
  useEffect(() => {
    if (!activeCase) {
      setPredictionHistory([]);
      return;
    }

    // Initialize notes if not present
    if (!caseNotes[activeCase.id]) {
      setCaseNotes((prev) => ({
        ...prev,
        [activeCase.id]: getInitialNotesForCase(activeCase)
      }));
    }

    // Prepare current selection state fingerprint
    const stateFingerprint = `${activeCase.id}-${selectedEvidenceIds.sort().join(',')}`;
    if (lastStateRef.current === stateFingerprint) return;
    lastStateRef.current = stateFingerprint;

    // Calculate probabilities
    const currentProbs = calculateDynamicBayesian(
      activeCase.suspects,
      activeCase.evidence,
      selectedEvidenceIds
    );

    // Label for the step
    let label = 'Base';
    if (selectedEvidenceIds.length > 0) {
      const lastId = selectedEvidenceIds[selectedEvidenceIds.length - 1];
      const ev = activeCase.evidence.find((e) => e.id === lastId);
      label = ev ? `+ ${ev.title}` : `Clues (${selectedEvidenceIds.length})`;
    }

    const newEntry: any = { label };
    currentProbs.forEach((p) => {
      newEntry[p.suspectId] = p.probability;
    });

    setPredictionHistory((prev) => {
      // If we switched cases, clear history and start with Base + current selection step if any
      const isNewCase = prev.length === 0 || prev[0][activeCase.suspects[0]?.id] === undefined;
      
      if (isNewCase) {
        // Base probabilities
        const baseProbs = calculateDynamicBayesian(activeCase.suspects, activeCase.evidence, []);
        const baseEntry: any = { label: 'Base' };
        baseProbs.forEach((p) => {
          baseEntry[p.suspectId] = p.probability;
        });

        if (selectedEvidenceIds.length === 0) {
          return [baseEntry];
        } else {
          return [baseEntry, newEntry];
        }
      }

      // Avoid duplicate consecutive entries
      const lastEntry = prev[prev.length - 1];
      const isDuplicate = lastEntry && activeCase.suspects.every(s => lastEntry[s.id] === newEntry[s.id]);
      if (isDuplicate) return prev;

      return [...prev, newEntry].slice(-8); // Limit history to last 8 steps
    });
  }, [activeCase, selectedEvidenceIds]);

  // UI Loaders & theme
  const [isWarmMode, setIsWarmMode] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [geminiStatus, setGeminiStatus] = useState<{ available: boolean; message: string } | null>(null);

  // Verdict results popup state
  const [verdictResult, setVerdictResult] = useState<{
    correct: boolean;
    guessedSuspect: Suspect;
    actualCulprit: Suspect;
    gainedXp: number;
  } | null>(null);

  // Fetch initial game data
  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      // 1. Get Gemini status
      const statusRes = await fetch('/api/gemini/status');
      const statusData = await statusRes.json();
      setGeminiStatus(statusData);

      // 2. Get Cases
      const casesRes = await fetch('/api/cases');
      const casesData = await casesRes.json();
      setActiveCases(casesData);
      if (casesData.length > 0 && !activeCase) {
        selectCase(casesData[0]);
      }

      // 3. Get User Stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // 4. Get Solved Archive
      const archiveRes = await fetch('/api/archive');
      const archiveData = await archiveRes.json();
      setArchive(archiveData);
    } catch (error) {
      console.error('Failed to load full-stack game coordinates:', error);
    }
  };

  const selectCase = (c: Case) => {
    setActiveCase(c);
    setSelectedEvidenceIds([]);
    setSelectedSuspectId(null);
    setHighlightedSuspectId(null);
    setRankings([]);
    setCluesSummary('');
    setReasoningChain('');
    setVerdictResult(null);
  };

  // Toggle evidence pinned state
  const handleToggleEvidence = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter((item) => item !== id));
    } else {
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
    }
  };

  // Generate a brand-new procedural case
  const handleGenerateProceduralCase = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cases/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: difficultyFilter }),
      });
      const newCase = await response.json();
      
      // Update case list
      setActiveCases((prev) => [newCase, ...prev]);
      // Select the newly generated case
      selectCase(newCase);
    } catch (error) {
      console.error('Failed to generate procedural case:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Bayesian Classification & explanation generator
  const handleAnalyzeClues = async () => {
    if (!activeCase) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/cases/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: activeCase.id }),
      });
      const data = await response.json();
      
      setRankings(data.rankings);
      setCluesSummary(data.cluesSummary);
      setReasoningChain(data.reasoningChain);
    } catch (error) {
      console.error('Deduction engine calculation failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit the formal accusation
  const handleAccuseSuspect = async () => {
    if (!activeCase || !selectedSuspectId) return;

    try {
      const response = await fetch('/api/cases/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: activeCase.id,
          guessedSuspectId: selectedSuspectId,
        }),
      });
      const data = await response.json();

      const guessed = activeCase.suspects.find((s) => s.id === selectedSuspectId)!;
      const culprit = data.actualCulprit;

      setVerdictResult({
        correct: data.correct,
        guessedSuspect: guessed,
        actualCulprit: culprit,
        gainedXp: data.correct ? 100 : 25,
      });

      if (data.correct) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      // Update statistics and move case to archive
      setStats(data.userStats);
      
      // Refresh case selection and solved logs
      const updatedCases = activeCases.filter((c) => c.id !== activeCase.id);
      setActiveCases(updatedCases);
      
      const updatedCaseObj = {
        ...activeCase,
        solved: true,
        guessedSuspectId: selectedSuspectId,
      };
      setArchive((prev) => [updatedCaseObj, ...prev]);
    } catch (error) {
      console.error('Failed to submit formal accusation:', error);
    }
  };

  // Custom styling filters for the warm desk lamp toggle
  const appContainerClass = isWarmMode
    ? 'bg-[#eddcd0] text-stone-900 transition-colors duration-500 min-h-screen flex flex-col justify-between'
    : 'bg-[#0c0c0e] text-[#d1d1d6] transition-colors duration-500 min-h-screen flex flex-col justify-between';

  const secondaryCardBg = isWarmMode
    ? 'bg-[#ebdcd0]/50 border-amber-800/10'
    : 'bg-[#15151a] border-[#2d2d33]';

  if (currentScreen === 'opening') {
    return <OpeningCinematic onComplete={() => setCurrentScreen('menu')} />;
  }

  if (currentScreen === 'menu') {
    return (
      <LandingPage
        stats={stats}
        activeCasesCount={activeCases.length}
        onStartGame={() => setCurrentScreen('game')}
        onViewProfile={() => setCurrentScreen('profile')}
        onViewAbout={() => setCurrentScreen('about')}
        isWarmMode={isWarmMode}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <DetectiveProfile
        stats={stats}
        onBackToMenu={() => setCurrentScreen('menu')}
        archiveCount={archive.length}
      />
    );
  }

  if (currentScreen === 'about') {
    return (
      <AboutArgus
        onBackToMenu={() => setCurrentScreen('menu')}
      />
    );
  }

  return (
    <div className={appContainerClass}>
      {/* Immersive Warm overlay for Desk Lamp mode */}
      {isWarmMode && (
        <div className="fixed inset-0 pointer-events-none z-10 bg-radial from-amber-400/5 via-amber-600/0 to-amber-900/5 mix-blend-color-burn" />
      )}

      {/* Main Header */}
      <DeskHeader 
        stats={stats} 
        isWarmMode={isWarmMode} 
        setIsWarmMode={setIsWarmMode} 
        geminiStatus={geminiStatus}
        onBackToMenu={() => setCurrentScreen('menu')}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6 relative z-20">
        
        {/* TOP: Case Picker & Procedural Story Generator Panel */}
        <section className={`rounded-xl p-3 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${secondaryCardBg}`}>
          <div className="flex flex-wrap items-center gap-3">
            <FolderOpen className="w-4.5 h-4.5 text-red-500" />
            <span className="font-sans font-extrabold text-xs uppercase tracking-wider">Select Dossier:</span>
            
            <div className="flex flex-wrap gap-1.5">
              {activeCases.map((c) => (
                <button
                  key={c.id}
                  id={`case-btn-${c.id}`}
                  onClick={() => selectCase(c)}
                  className={`px-2.5 py-1 rounded-sm border text-[10px] font-mono transition-all cursor-pointer ${
                    activeCase?.id === c.id
                      ? 'bg-red-950/40 text-red-500 border-red-900/40 font-bold'
                      : isWarmMode
                      ? 'bg-[#ebdcd0] hover:bg-[#faf4ea] text-stone-700 border-stone-300'
                      : 'bg-[#0c0c0e] hover:bg-[#1c1c24] text-[#a1a1aa] border-[#2d2d33]'
                  }`}
                >
                  {c.title.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Procedural Case Generator triggers */}
          <div className={`flex flex-wrap items-center gap-2 md:border-l md:pl-4 ${
            isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
          }`}>
            <span className="text-[10px] font-mono text-stone-500 hidden sm:inline uppercase">DIFFICULTY:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className={`text-[10px] font-mono px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer ${
                isWarmMode 
                  ? 'bg-[#f4ebe1] text-stone-800 border-stone-350' 
                  : 'bg-[#0c0c0e] text-[#d1d1d6] border-[#2d2d33]'
              }`}
            >
              <option value="easy">EASY</option>
              <option value="medium">MEDIUM</option>
              <option value="hard">HARD</option>
            </select>

            <button
              id="generate-procedural-case-btn"
              onClick={handleGenerateProceduralCase}
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-500 disabled:bg-stone-800 text-white font-bold px-3 py-1 rounded-sm text-[10px] font-mono flex items-center gap-1.5 transition-all uppercase cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 rounded-full border border-stone-400 border-t-transparent animate-spin" />
                  <span>Drafting Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Procedural Case</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* VERDICT POPUP SECTION */}
        <AnimatePresence>
          {verdictResult && (
            <motion.section
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-xl p-6 border text-center relative overflow-hidden ${
                verdictResult.correct 
                  ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'bg-red-950/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
              }`}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />

              {/* Rubber Stamp Overlay for solved cases */}
              {verdictResult.correct && (
                <motion.div
                  initial={{ scale: 3, opacity: 0, rotate: -35 }}
                  animate={{ scale: 1, opacity: 0.85, rotate: -15 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                  className="absolute right-4 top-4 md:right-12 md:top-8 pointer-events-none select-none border-4 border-red-600 text-red-600 font-sans font-black text-xl md:text-2xl tracking-wider uppercase px-4 py-2 rounded-lg rotate-12 bg-black/10 backdrop-blur-xs"
                  style={{
                    textShadow: '0 0 2px rgba(220, 38, 38, 0.2)',
                    boxShadow: 'inset 0 0 4px rgba(220, 38, 38, 0.2), 0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  CASE CLOSED
                </motion.div>
              )}
              
              <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-3">
                {verdictResult.correct ? (
                  <div className="w-14 h-14 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 animate-bounce shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-red-950 border border-red-500 rounded-full flex items-center justify-center text-red-400 animate-bounce shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <XCircle className="w-9 h-9" />
                  </div>
                )}

                <h2 className={`font-serif font-bold text-2xl tracking-tight ${verdictResult.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {verdictResult.correct ? 'CASE CRACKED! EXCELLENT WORK' : 'ACCUSATION FAILED'}
                </h2>

                <p className="text-sm text-stone-300 leading-relaxed">
                  {verdictResult.correct ? (
                    <>
                      You have successfully identified **{verdictResult.guessedSuspect.name}** as the true culprit behind this tragedy. Your analytical deduction and evidence-string linking aligns perfectly with the forensic classification grid.
                    </>
                  ) : (
                    <>
                      Your accusation of **{verdictResult.guessedSuspect.name}** was incorrect. The actual mastermind was **{verdictResult.actualCulprit.name}** ({verdictResult.actualCulprit.role}), who fully manipulated the opportunity vectors.
                    </>
                  )}
                </p>

                <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                  <div className="bg-stone-950 px-3 py-1.5 border border-stone-800 rounded text-stone-400">
                    Awarded: <strong className={verdictResult.correct ? 'text-emerald-400' : 'text-amber-400'}>+{verdictResult.gainedXp} XP</strong>
                  </div>
                  <button
                    id="next-investigation-btn"
                    onClick={() => {
                      setVerdictResult(null);
                      if (activeCases.length > 0) {
                        selectCase(activeCases[0]);
                      } else {
                        // fallback to preset reloading or similar
                        fetchGameData();
                      }
                    }}
                    className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 px-4 py-1.5 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Next Case</span>
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {activeCase ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: Case Briefing & Suspect Cards (cols: 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Case Briefing Dossier */}
              <section className={`rounded-xl p-4 sm:p-5 border ${isWarmMode ? 'bg-[#ebdcd0]/75 border-amber-800/20' : 'bg-[#15151a] border-[#2d2d33]'} backdrop-blur-md`}>
                <div className={`flex items-center gap-2 pb-3 border-b mb-4 justify-between ${
                  isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-red-500" />
                    <h2 className={`font-sans font-bold text-xs uppercase tracking-wider ${isWarmMode ? 'text-stone-900' : 'text-[#d1d1d6]'}`}>Active Case Briefing</h2>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    activeCase.difficulty === 'hard'
                      ? 'bg-red-950/40 text-red-400 border-red-900/30'
                      : 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                  }`}>
                    {activeCase.difficulty.toUpperCase()} DIFFICULTY
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="font-sans font-extrabold text-base text-red-500 leading-tight uppercase tracking-tight">
                      {activeCase.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono uppercase mt-0.5">
                      VICTIM: {activeCase.victim}
                    </p>
                  </div>

                  <p className={`leading-relaxed text-xs font-mono ${isWarmMode ? 'text-stone-850' : 'text-[#a1a1aa]'}`}>
                    &ldquo;{activeCase.description}&rdquo;
                  </p>

                  <div className={`grid grid-cols-2 gap-3 border p-3 rounded text-[9px] font-mono ${
                    isWarmMode 
                      ? 'bg-[#f4ebe1]/80 border-stone-300' 
                      : 'bg-[#0c0c0e] border-[#2d2d33]'
                  }`}>
                    <div>
                      <span className="text-stone-550 block uppercase">WEATHER</span>
                      <strong className={`font-semibold ${isWarmMode ? 'text-stone-800' : 'text-stone-300'}`}>{activeCase.weather}</strong>
                    </div>
                    <div>
                      <span className="text-stone-550 block uppercase">EST. TIME OF CRIME</span>
                      <strong className={`font-semibold ${isWarmMode ? 'text-stone-800' : 'text-stone-300'}`}>{activeCase.timeOfCrime}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-550 block uppercase">FORENSIC SITE</span>
                      <strong className={`font-semibold ${isWarmMode ? 'text-stone-800' : 'text-stone-300'}`}>{activeCase.location}</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Case Investigation Voice & Text Logs */}
              <InvestigationLog
                caseId={activeCase.id}
                isWarmMode={isWarmMode}
                notes={caseNotes[activeCase.id] || []}
                onAddNote={handleAddNote}
              />

              {/* Suspect File Cards Grid */}
              <section className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-stone-800/10">
                  <h2 className="font-serif font-bold text-sm tracking-tight text-stone-400">
                    Suspect Register Profiles ({activeCase.suspects.length})
                  </h2>
                  <span className="text-[10px] font-mono text-stone-500">Accuse guilty party</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCase.suspects.map((suspect) => (
                    <SuspectCard
                      key={suspect.id}
                      suspect={suspect}
                      onSelect={(id) => {
                        setSelectedSuspectId(id);
                        setHighlightedSuspectId(id);
                      }}
                      isSelected={selectedSuspectId === suspect.id}
                      isWarmMode={isWarmMode}
                      disabled={activeCase.solved}
                    />
                  ))}
                </div>

                {/* Accuse Action bar */}
                {selectedSuspectId && !activeCase.solved && (
                  <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="text-stone-400 font-mono">Guilty party accused:</p>
                      <strong className="text-red-400 text-sm font-semibold">
                        {activeCase.suspects.find((s) => s.id === selectedSuspectId)?.name}
                      </strong>
                    </div>
                    <button
                      id="submit-accusation-btn"
                      onClick={handleAccuseSuspect}
                      className="bg-red-600 hover:bg-red-500 text-stone-100 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all uppercase shadow-md cursor-pointer"
                    >
                      File Accusation
                    </button>
                  </div>
                )}
              </section>

              {/* Timeline Section */}
              <TimelineView
                timeline={activeCase.timeline}
                suspects={activeCase.suspects}
                isWarmMode={isWarmMode}
                highlightedSuspectId={highlightedSuspectId}
                onHighlightSuspect={setHighlightedSuspectId}
              />
            </div>

            {/* RIGHT SIDEBAR: Evidence Corkboard, Bayesian classification rankings, and Explanation Terminal (cols: 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Evidence Board with corkboard design */}
              <EvidenceBoard
                evidenceList={activeCase.evidence}
                isWarmMode={isWarmMode}
                selectedEvidenceIds={selectedEvidenceIds}
                onToggleEvidence={handleToggleEvidence}
              />

              {/* Dynamic Camera/File Evidence Scanner */}
              <EvidenceScanner
                caseId={activeCase.id}
                isWarmMode={isWarmMode}
                onClueScanned={handleClueScanned}
              />

              {/* AI & ML trigger action bar */}
              <section className={`flex flex-col sm:flex-row items-center justify-between p-3.5 border rounded-xl gap-4 ${
                isWarmMode 
                  ? 'bg-[#ebdcd0]/75 border-amber-800/20' 
                  : 'bg-[#15151a] border-[#2d2d33]'
              }`}>
                <div className="flex items-start gap-2.5 max-w-md">
                  <div className={`p-1.5 rounded border mt-0.5 ${
                    isWarmMode
                      ? 'bg-amber-950/10 text-amber-900 border-amber-800/30'
                      : 'bg-red-950/40 text-red-450 border-red-900/30'
                  }`}>
                    <Brain className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isWarmMode ? 'text-stone-900' : 'text-stone-200'}`}>Ensemble Bayesian Solver</h3>
                    <p className="text-[10px] text-stone-500 font-mono leading-relaxed mt-0.5">
                      Input active evidence matrices and pin values. The ML node will classify suspects and return full explainable deduction logs.
                    </p>
                  </div>
                </div>

                <button
                  id="analyze-clues-btn"
                  onClick={handleAnalyzeClues}
                  disabled={isAnalyzing || selectedEvidenceIds.length === 0}
                  className={`w-full sm:w-auto font-bold px-4 py-2 rounded-sm text-[10px] font-mono flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    isAnalyzing
                      ? 'bg-stone-900 text-stone-500 border-stone-800'
                      : selectedEvidenceIds.length === 0
                      ? isWarmMode
                        ? 'bg-stone-200 border-stone-300 text-stone-400'
                        : 'bg-[#0c0c0e] border-[#2d2d33] text-[#6b6b76]'
                      : 'bg-red-600 hover:bg-red-500 border-red-600 text-white uppercase'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3 h-3 rounded-full border border-stone-400 border-t-transparent animate-spin" />
                      <span>Classifying...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-red-300" />
                      <span>Analyze Pinned Clues</span>
                    </>
                  )}
                </button>
              </section>

              {/* Posterior guilt probability charts */}
              <PredictionPanel
                rankings={rankings.length > 0 ? rankings : calculateDynamicBayesian(activeCase.suspects, activeCase.evidence, selectedEvidenceIds).map(r => {
                  const s = activeCase.suspects.find(sp => sp.id === r.suspectId)!;
                  return {
                    suspectId: r.suspectId,
                    suspectName: r.suspectName,
                    probability: r.probability,
                    bayesianCalculation: {
                      motiveFactor: Number((0.15 + 0.7 * (s.motiveScore / 100)).toFixed(2)),
                      opportunityFactor: Number((0.15 + 0.7 * (s.opportunityScore / 100)).toFixed(2)),
                      alibiFactor: Number((0.15 + 0.7 * ((100 - s.alibiStrength) / 100)).toFixed(2)),
                      witnessFactor: 0.5,
                      evidenceWeight: s.fingerprintMatch ? 2.5 : 1
                    },
                    reasoning: ''
                  };
                })}
                suspects={activeCase.suspects}
                isWarmMode={isWarmMode}
                predictionHistory={predictionHistory}
              />

              {/* Explainable AI terminal log files */}
              <ExplanationEngine
                cluesSummary={cluesSummary}
                reasoningChain={reasoningChain}
                isLoading={isAnalyzing}
                isWarmMode={isWarmMode}
              />

              {/* Solved Case historical files */}
              <CaseArchive
                archive={archive}
                isWarmMode={isWarmMode}
                onViewCase={(c) => selectCase(c)}
              />
            </div>

          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-stone-800 rounded-2xl bg-stone-950/20 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-300">No Cases Loaded</h3>
            <p className="text-xs text-stone-500 font-mono mt-1 mb-6 max-w-xs mx-auto">
              Please click the button below to retrieve local active coordinate file databases.
            </p>
            <button
              id="reload-db-btn"
              onClick={fetchGameData}
              className="bg-red-600 hover:bg-red-500 text-stone-100 font-bold px-4 py-2 rounded-lg text-xs font-mono cursor-pointer"
            >
              Connect Terminal Database
            </button>
          </div>
        )}
      </main>

      {/* Bottom Status Bar (High Density Aesthetic) */}
      {!isWarmMode && (
        <footer className="h-6 bg-[#0c0c0e] border-t border-[#2d2d33] px-4 flex items-center justify-between text-[9px] font-mono text-[#6b6b76] shrink-0 w-full z-30">
          <div className="flex gap-4">
            <span>SYSTEM_LOAD: 12%</span>
            <span>MODEL: ENSEMBLE_BOOST_v2.5</span>
            <span>DATASTORE: LOCAL_SQL_CONNECTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>BAYES_CLASSIFIER_NOMINAL</span>
          </div>
        </footer>
      )}
    </div>
  );
}
