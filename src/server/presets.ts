/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Case } from '../types';

export const presetCases: Case[] = [
  {
    id: "gala-heist-101",
    title: "The Midnight Gala Heist",
    difficulty: "medium",
    victim: "Lord Reginald Sterling (Art Collector)",
    location: "Sterling Manor, Grand Library",
    weather: "Torrential Rain & Heavy Thunderstorms",
    timeOfCrime: "11:45 PM",
    description: "During Lord Sterling's exclusive art exhibition, the mansion's power flickered for exactly 45 seconds. When the lights returned, the priceless 'Blue Whisper' diamond was gone, and Lord Sterling was found slumped over his mahogany desk, poisoned by a fast-acting toxin. Rain lashed against the windows, and the study's french door was left slightly ajar.",
    solved: false,
    guessedSuspectId: null,
    suspects: [
      {
        id: "sus-diana",
        name: "Lady Diana Sterling",
        role: "The Estranged Spouse",
        avatarUrl: "🕵️‍♀️",
        motive: "Lord Sterling was planning to sign a new will tomorrow morning, cutting her out of the estate in favor of his new museum. Her luxurious lifestyle was about to evaporate.",
        motiveScore: 85,
        opportunity: "She was supposedly in her bedroom sleeping, but she was seen near the west corridor close to 11:30 PM with a wet raincoat.",
        opportunityScore: 55,
        witnessStatement: "She swears she was in her bed reading. However, she mentions hearing Julian Vance running down the corridor around 11:40 PM.",
        witnessReliability: 70,
        alibi: "Claimed to be reading in the guest room, but her book was found face-down on the grand parlor table downstairs.",
        alibiStrength: 45,
        fingerprintMatch: false,
        guilty: false
      },
      {
        id: "sus-julian",
        name: "Julian Vance",
        role: "The Museum Curator",
        avatarUrl: "🧑‍🎨",
        motive: "Vance had accrued massive gambling debts with offshore syndicates. He brokered the diamond's security and knew the exact timing of the generator check.",
        motiveScore: 90,
        opportunity: "Assigned to manage the exhibits, he was seen checking the electrical breaker room at 11:30 PM. His velvet blazer sleeve has a tiny tear.",
        opportunityScore: 95,
        witnessStatement: "Claims he was in the electrical closet resetting the breaker when the outage hit. Accuses Lady Diana of having access to the poison vault.",
        witnessReliability: 50,
        alibi: "Resetting the mansion breakers. However, the logs show the generator was triggered manually, not by a power grid failure.",
        alibiStrength: 30,
        fingerprintMatch: true,
        guilty: true
      },
      {
        id: "sus-arthor",
        name: "Arthur Croft",
        role: "The Trusted Butler",
        avatarUrl: "👨‍💼",
        motive: "Croft was recently blackmailed by Sterling over a past forgery conviction. Solved the forgery but Croft lived under Sterling's thumb for ten years.",
        motiveScore: 65,
        opportunity: "Served the poisoned Earl Grey tea to Sterling's desk at 11:30 PM. He has keys to all rooms including the French doors.",
        opportunityScore: 70,
        witnessStatement: "He claims he was in the butler's pantry polishing silver after 11:30 PM. Says he saw the curator Julian pacing near the study.",
        witnessReliability: 80,
        alibi: "Butler's pantry polishing silver. Silverware was indeed freshly polished, and his hands were stained with silver polish cream.",
        alibiStrength: 85,
        fingerprintMatch: false,
        guilty: false
      }
    ],
    evidence: [
      {
        id: "ev-muddy-footprints",
        title: "Muddy Footprints",
        type: "footprint",
        description: "Size 10 designer boots left wet, clay-rich soil footprints leading from the library's French doors towards the desk. Rainwater had pooled around the door sill.",
        icon: "Footprints",
        importance: "high"
      },
      {
        id: "ev-teacup",
        title: "Cyanide-Laced Teacup",
        type: "forensic",
        description: "The silver-lined teacup contained trace amounts of Almond Toxin (cyanide). Fingerprints on the cup handle belong exclusively to Lord Sterling and Arthur Croft.",
        icon: "CupSoda",
        importance: "high"
      },
      {
        id: "ev-velvet-fiber",
        title: "Torn Velvet Thread",
        type: "forensic",
        description: "A dark-blue velvet fiber caught on the brass latch of the French doors. Julian Vance was wearing a dark-blue velvet blazer tonight.",
        icon: "Scissors",
        importance: "high"
      },
      {
        id: "ev-breaker-log",
        title: "Manual Breaker Log",
        type: "timeline",
        description: "Digital forensic files show the breaker system wasn't hit by lightning, but was deactivated manually using an administrator keycard at 11:44 PM.",
        icon: "Database",
        importance: "medium"
      }
    ],
    timeline: [
      {
        id: "tl-1",
        time: "11:00 PM",
        description: "Exhibition gala guests depart. Lord Sterling retires to his private study to admire the diamond.",
        suspectId: null,
        importance: "neutral"
      },
      {
        id: "tl-2",
        time: "11:30 PM",
        description: "Arthur Croft delivers Lord Sterling's freshly brewed Earl Grey tea to the library desk.",
        suspectId: "sus-arthor",
        importance: "suspicious"
      },
      {
        id: "tl-3",
        time: "11:35 PM",
        description: "Lady Diana Sterling is spotted walking in the west wing garden corridor wearing a damp coat.",
        suspectId: "sus-diana",
        importance: "suspicious"
      },
      {
        id: "tl-4",
        time: "11:44 PM",
        description: "The mansion power is manually severed. Julian Vance's keycard is logged in the basement stairwell.",
        suspectId: "sus-julian",
        importance: "critical"
      },
      {
        id: "tl-5",
        time: "11:45 PM",
        description: "Estimated time of death. A heavy crash is heard from the library. The power restores.",
        suspectId: null,
        importance: "critical"
      }
    ]
  },
  {
    id: "neon-alchemist-202",
    title: "The Neon Alchemist",
    difficulty: "hard",
    victim: "Dr. Kenji Sato (Bio-Tech Engineer)",
    location: "Aegis Labs, Penthouse Suite",
    weather: "Chilly, Thick Smog and Neon Lights",
    timeOfCrime: "02:15 AM",
    description: "Dr. Kenji Sato, lead designer of the 'Lumen' cognitive enhancer, was found lifeless in his high-tech cleanroom. The ventilation filters were flooded with a vaporized neurotoxin. The lab door has biometric facial scanner logs that were partially scrambled. An eerie neon blue mist lingered in the fume hood.",
    solved: false,
    guessedSuspectId: null,
    suspects: [
      {
        id: "sus-harrison",
        name: "Dr. Elena Harrison",
        role: "Rival Researcher",
        avatarUrl: "👩‍🔬",
        motive: "Dr. Sato stole her research data on neuro-linkers to claim sole patent authorship. If the product launched, she would lose her career's credit and royalty share.",
        motiveScore: 95,
        opportunity: "She has full security authorization to the vaporizers and cleanroom air systems. Seen on CCTV near the cooling ducts at 1:45 AM.",
        opportunityScore: 80,
        witnessStatement: "Claims she was runs validation simulations in Lab B. But database timestamps show she wasn't logged into any system during the crime.",
        witnessReliability: 65,
        alibi: "Simulating validation protocols in private Lab B. However, the simulation servers logged no user activity from her account.",
        alibiStrength: 35,
        fingerprintMatch: false,
        guilty: true
      },
      {
        id: "sus-vance",
        name: "Marcus Vance",
        role: "Corporate Investor Liaison",
        avatarUrl: "🕴️",
        motive: "Dr. Sato was about to blow the whistle on the drug's lethal side effects, which would crash Aegis stock. Vance needed Sato quiet to finalize a billion-dollar buyout.",
        motiveScore: 80,
        opportunity: "Visited Sato's penthouse at 2:00 AM to argue. Was logged passing the elevator lobby. But Vance claims he left before 2:10 AM.",
        opportunityScore: 75,
        witnessStatement: "Admits they argued, but claims Sato was alive when he left. Accuses the security guard of taking bribes.",
        witnessReliability: 60,
        alibi: "Left the building and boarded a taxi at 2:10 AM. Digital taxi logs confirm his pickup time, verified by GPS location tracking.",
        alibiStrength: 90,
        fingerprintMatch: true,
        guilty: false
      },
      {
        id: "sus-cole",
        name: "Officer Silas Cole",
        role: "Head of Facility Security",
        avatarUrl: "👮‍♂️",
        motive: "Cole was deep in debt and was blackmailed into letting an infiltrator inside. Or perhaps he pocketed a bribe from a shadow competitor.",
        motiveScore: 50,
        opportunity: "Disabled the hallway biometric scanner for 'routine maintenance' from 2:00 AM to 2:30 AM. He controlled all cleanroom safety overrides.",
        opportunityScore: 90,
        witnessStatement: "Claims he was doing his rounds on the perimeter. Says he saw Elena Harrison carrying an airtight aluminum canister near Lab A.",
        witnessReliability: 45,
        alibi: "Perimeter foot patrol. Guard shack camera caught his shadow pacing, but the digital timestamp on the video file had been edited.",
        alibiStrength: 50,
        fingerprintMatch: false,
        guilty: false
      }
    ],
    evidence: [
      {
        id: "ev-vapor-canister",
        title: "Airtight Canister",
        type: "forensic",
        description: "An empty aluminum container recovered from the chemical waste disposal bin. Traces of aerosolized neurotoxin match Dr. Harrison's custom lab compound.",
        icon: "ShieldAlert",
        importance: "high"
      },
      {
        id: "ev-scanner-log",
        title: "Scrambled Scanner Log",
        type: "location",
        description: "The facial biometric terminal logs show that administrative access was granted using Dr. Elena Harrison's backup visual bypass at 2:12 AM.",
        icon: "Terminal",
        importance: "high"
      },
      {
        id: "ev-smog-sensor",
        title: "Ventilation Sensor File",
        type: "timeline",
        description: "Air density sensor logs show a sudden spikes in particle toxicity in Cleanroom A starting at exactly 2:14 AM and ending at 2:22 AM.",
        icon: "Wind",
        importance: "medium"
      }
    ],
    timeline: [
      {
        id: "tl-201",
        time: "01:30 AM",
        description: "Dr. Sato enters Cleanroom A to initiate final sample formulation.",
        suspectId: null,
        importance: "neutral"
      },
      {
        id: "tl-202",
        time: "01:45 AM",
        description: "Elena Harrison is observed carrying a sealed cargo canister near Lab A's air filter shaft.",
        suspectId: "sus-harrison",
        importance: "suspicious"
      },
      {
        id: "tl-203",
        time: "02:00 AM",
        description: "Marcus Vance arrives in the suite. Heated voices are recorded by the hallway inter-phone.",
        suspectId: "sus-vance",
        importance: "suspicious"
      },
      {
        id: "tl-204",
        time: "02:10 AM",
        description: "Marcus Vance logs out of security elevator and leaves the premises.",
        suspectId: "sus-vance",
        importance: "neutral"
      },
      {
        id: "tl-205",
        time: "02:12 AM",
        description: "Cleanroom door facial scanner bypass triggered under Elena Harrison's ID code. Biometric terminal goes offline.",
        suspectId: "sus-harrison",
        importance: "critical"
      },
      {
        id: "tl-206",
        time: "02:15 AM",
        description: "Toxin sensor rings in central security. Security Chief Silas Cole silences the alarm for 7 minutes.",
        suspectId: "sus-cole",
        importance: "critical"
      }
    ]
  },
  {
    id: "steam-engine-303",
    title: "The Steam Engine Sabotage",
    difficulty: "easy",
    victim: "Thomas Avery (Chief Rail Conductor)",
    location: "Ironclad Express, Boiler Room",
    weather: "Thick Fog, Shifting Mountains, Cold Mist",
    timeOfCrime: "06:10 PM",
    description: "The legendary Ironclad Express steam train suddenly screeched to a halt in the high mountain pass. The primary coal boiler exploded due to pressure valve sabotage. Chief Conductor Thomas Avery was found locked inside the boiler room, killed by a blow to the head with a heavy pressure wrench. The valve's regulator safety pins were missing.",
    solved: false,
    guessedSuspectId: null,
    suspects: [
      {
        id: "sus-oscar",
        name: "Oscar Wilde (Not the poet)",
        role: "The Assistant Stoker",
        avatarUrl: "🧑‍🏭",
        motive: "Avery discovered Oscar had been smuggling stolen gold bars in the coal cars. Avery was going to hand him over to federal marshals at the next station.",
        motiveScore: 90,
        opportunity: "Assigned directly to shovel coal beside Avery. Handled the heavy steam wrench shortly before the crash.",
        opportunityScore: 95,
        witnessStatement: "Swears he was in the dining car flirting with guests. But three passengers recall him leaving the dining car carrying heavy tools.",
        witnessReliability: 45,
        alibi: "Dining car social hour. However, the dining car attendant did not corroborate seeing him during that crucial 15-minute window.",
        alibiStrength: 25,
        fingerprintMatch: true,
        guilty: true
      },
      {
        id: "sus-clara",
        name: "Clara Webb",
        role: "The Telegraph Operator",
        avatarUrl: "👩‍💼",
        motive: "Her brother was fired by Avery for negligence. She held a deep grudge and wanted to ruin the train's speed record to embarrass Avery.",
        motiveScore: 60,
        opportunity: "Located in the adjacent cabin. Had keys to the boiler entrance corridors but lacked the physical strength for heavy wrench blows.",
        opportunityScore: 50,
        witnessStatement: "Claims she heard a loud argument in the boiler room between Avery and Oscar Wilde around 6:05 PM.",
        witnessReliability: 90,
        alibi: "At her telegraph station sending position alerts. Telegraph records verify that a continuous outbound coordinate transmission occurred from 5:55 PM to 6:15 PM.",
        alibiStrength: 95,
        fingerprintMatch: false,
        guilty: false
      },
      {
        id: "sus-garrick",
        name: "Garrick Stone",
        role: "First-Class passenger / Steel Magnate",
        avatarUrl: "🎩",
        motive: "Stone was bidding for the rail line and a massive accident would tank the stock price, allowing a hostile takeover. He is ruthlessly greedy.",
        motiveScore: 70,
        opportunity: "Left his cabin at 6:00 PM under the guise of looking for fresh air. Spotted near the boiler entrance ladder.",
        opportunityScore: 60,
        witnessStatement: "Says he went to the rear observatory platform, not the boiler room. Claims he saw nothing because of the thick fog.",
        witnessReliability: 60,
        alibi: "Sipping whiskey in Cabin 4. But the lock on Cabin 4 shows he was away between 6:00 PM and 6:15 PM.",
        alibiStrength: 40,
        fingerprintMatch: false,
        guilty: false
      }
    ],
    evidence: [
      {
        id: "ev-wrench",
        title: "Heavy Pressure Wrench",
        type: "forensic",
        description: "A blood-stained 24-inch steel pipe wrench discarded behind a coal stack. Fingerprints matching Oscar Wilde's oil-stained hands cover the rubberized grip.",
        icon: "Wrench",
        importance: "high"
      },
      {
        id: "ev-safety-pins",
        title: "Sheared Safety Pins",
        type: "forensic",
        description: "The boiler regulator's steel pins were manually ground down with industrial shears. Oscar Wilde's workstation contains matching metal filings.",
        icon: "Paperclip",
        importance: "high"
      },
      {
        id: "ev-coal-dust",
        title: "Coal Dust Footprints",
        type: "footprint",
        description: "Traces of boots covered in dense coal dust lead out from the boiler door into the main luggage car. Clara Webb's shoes are pristine.",
        icon: "Footprints",
        importance: "medium"
      }
    ],
    timeline: [
      {
        id: "tl-301",
        time: "05:45 PM",
        description: "The Ironclad Express enters the high alpine tunnel. Avery orders boiler pressure raised.",
        suspectId: null,
        importance: "neutral"
      },
      {
        id: "tl-302",
        time: "05:55 PM",
        description: "Oscar Wilde enters the boiler room with a heavy coal shovel and tools.",
        suspectId: "sus-oscar",
        importance: "neutral"
      },
      {
        id: "tl-303",
        time: "06:00 PM",
        description: "Garrick Stone leaves the lounge car, walking towards the rear platform ladder.",
        suspectId: "sus-garrick",
        importance: "suspicious"
      },
      {
        id: "tl-304",
        time: "06:05 PM",
        description: "Clara Webb intercepts a strange screech of noise from the boiler inter-phone. Conductor Avery is arguing.",
        suspectId: "sus-oscar",
        importance: "critical"
      },
      {
        id: "tl-305",
        time: "06:10 PM",
        description: "Boiler room pressure valve ruptures. Avery is struck and killed. The train screech halts.",
        suspectId: null,
        importance: "critical"
      }
    ]
  }
];
