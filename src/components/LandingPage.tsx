/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, ShieldAlert, Fingerprint, Network, Award, 
  HelpCircle, Volume2, VolumeX, BarChart2, Cpu, 
  Database, Users, Activity, Sparkles, Star, ChevronRight,
  BookOpen, Eye, Clock, ListChecks, ArrowDown
} from 'lucide-react';
import { 
  startAmbientRain, 
  stopAmbientRain, 
  playRadioBurst, 
  playScannerSweep, 
  playTypewriterTick, 
  playSuccessBeep 
} from '../lib/audioEngine';

interface LandingPageProps {
  onStartGame: () => void;
  onViewProfile: () => void;
  onViewAbout: () => void;
  stats: { totalPlayed: number; totalSolved: number; xp: number; rank: string };
  isWarmMode: boolean;
  activeCasesCount: number;
}

export default function LandingPage({ onStartGame, onViewProfile, onViewAbout, stats, isWarmMode, activeCasesCount }: LandingPageProps) {
  const [soundOn, setSoundOn] = useState(false);
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [simProcessing, setSimProcessing] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  // Stats counting states
  const [casesSolvedCount, setCasesSolvedCount] = useState(48200);
  const [evidenceCount, setEvidenceCount] = useState(1150000);
  const [accuracyVal, setAccuracyVal] = useState(88.5);
  const [suspectsCount, setSuspectsCount] = useState(395000);

  // Background particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  // Mock Simulations list
  const simulations = [
    {
      caseId: 'CASE #2458',
      location: 'Central Park Main Lawn',
      weather: 'Heavy Thunderstorm',
      witnessReliability: '84%',
      footprints: 'Size 10 Tread',
      timeline: '11:45 PM Overlay',
      suspect: 'Sarah Morgan (Botanist)',
      confidence: '91.2%',
      reasoning: 'Heavy soil matching Central Park turf isolated on her boots + weak alibi window + witness confirmation.'
    },
    {
      caseId: 'CASE #3109',
      location: 'Penthouse Server Room',
      weather: 'Clear Sub-zero Night',
      witnessReliability: '91%',
      footprints: 'Insulated Boot Scuffs',
      timeline: '02:15 AM Access Log',
      suspect: 'David Ross (Systems Admin)',
      confidence: '88.4%',
      reasoning: 'Admin card badge bypass logged at 02:14 AM + fingerprint match detected on command console.'
    },
    {
      caseId: 'CASE #8812',
      location: 'Industrial Boiler Bay',
      weather: 'Dense Morning Fog',
      witnessReliability: '68%',
      footprints: 'Grease Stained Prints',
      timeline: '05:30 AM Shift Change',
      suspect: 'Michael Hayes (Maintenance Chef)',
      confidence: '94.7%',
      reasoning: 'Hydrocarbon residue traced on hand samples matches boiler valve sealant + alibi leak detected in security log.'
    }
  ];

  // Initialize background floating particles
  useEffect(() => {
    const generated = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10
    }));
    setParticles(generated);

    // Dynamic counts counting up
    const interval = setInterval(() => {
      setCasesSolvedCount(prev => Math.min(52431, prev + 124));
      setEvidenceCount(prev => Math.min(1200000, prev + 3400));
      setAccuracyVal(prev => Math.min(94.7, parseFloat((prev + 0.18).toFixed(1))));
      setSuspectsCount(prev => Math.min(430000, prev + 1150));
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Audio system hook
  useEffect(() => {
    if (soundOn) {
      startAmbientRain();
      // Randomly play police scanner sound effects
      const interval = setInterval(() => {
        playRadioBurst();
      }, 7000);
      return () => {
        clearInterval(interval);
        stopAmbientRain();
      };
    } else {
      stopAmbientRain();
    }
  }, [soundOn]);

  // Simulation Looper
  useEffect(() => {
    setSimProcessing(true);
    setSimProgress(0);
    
    // Simulate pipeline calculation loading
    const progressInterval = setInterval(() => {
      setSimProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setSimProcessing(false);
          // Play a small sound if audio active
          if (soundOn) playSuccessBeep();
          return 100;
        }
        return p + 10;
      });
    }, 250);

    // Loop cases
    const loopTimeout = setTimeout(() => {
      setActiveSimIndex(prev => (prev + 1) % simulations.length);
    }, 6500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(loopTimeout);
    };
  }, [activeSimIndex]);

  const toggleSound = () => {
    setSoundOn(!soundOn);
    playTypewriterTick();
  };

  const handleStartClicked = () => {
    if (soundOn) playScannerSweep();
    onStartGame();
  };

  const currentSim = simulations[activeSimIndex];

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-[#F8FAFC] overflow-x-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Immersive Scanline Screen Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 4px'
        }} 
      />

      {/* Floating Dust Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-[#FFD166]/20 rounded-full animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient Red/Blue Crime Lights floating shadows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* High Density Top Navbar */}
      <header className="relative z-40 border-b border-[#121826]/80 bg-[#0B0F19]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/30">
            <ShieldAlert className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-[#F8FAFC] flex items-center gap-1.5">
              <span>AI Investigator</span>
              <span className="text-[10px] bg-red-500/10 text-[#FF4D4D] border border-red-500/20 px-1.5 py-0.25 rounded font-mono font-bold animate-pulse">A.R.G.U.S. v2.5</span>
            </h1>
            <p className="text-[10px] text-[#94A3B8] font-mono">NEURAL FORENSICS MAINFRAME</p>
          </div>
        </div>

        {/* Global Navigation Link & System Controls */}
        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <button 
            onClick={onViewProfile}
            className="hidden md:flex items-center gap-1 text-xs font-mono uppercase text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer"
          >
            <span>Detective Profile</span>
          </button>
          
          <button 
            onClick={onViewAbout}
            className="hidden md:flex items-center gap-1 text-xs font-mono uppercase text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer"
          >
            <span>Explainable AI Chamber</span>
          </button>

          {/* Audio toggle */}
          <button 
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2d2d33] bg-[#121826]/40 hover:bg-[#121826]/80 text-xs font-mono transition-all text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
            title={soundOn ? "Disable Crime Scene Audio Loop" : "Enable Immersive Background Audio"}
          >
            {soundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FFD166] animate-pulse" />
                <span className="text-[10px] uppercase text-[#FFD166]">AUDIO_ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase">AUDIO_OFF</span>
              </>
            )}
          </button>

          <button 
            onClick={handleStartClicked}
            className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer border border-red-500/30 shadow-lg shadow-red-900/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Enter Desk</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION - 100vh styled as Investigation Room */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 z-35 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Text & Interactive Button */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-[#FF4D4D] text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#FF4D4D] rounded-full animate-ping" />
              <span>AAA Interactive Story-Driven Machine Learning</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-[#F8FAFC]">
              AI Crime Scene <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#FFD166] to-red-500 drop-shadow-[0_2px_15px_rgba(255,77,77,0.3)]">
                Investigator
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] font-sans max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Every clue tells a story. Can you solve the mystery before the AI does? Work alongside <strong className="text-[#FFD166]">A.R.G.U.S.</strong> to analyze evidence, plot Bayesian pathways, and reveal hidden culprits.
            </p>

            {/* Core Action Call */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={handleStartClicked}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-mono text-sm font-black uppercase tracking-widest transition-all cursor-pointer border border-red-500/40 shadow-[0_0_30px_rgba(255,77,77,0.25)] hover:shadow-[0_0_45px_rgba(255,77,77,0.4)] hover:scale-102 flex items-center gap-2.5"
              >
                <Play className="w-4.5 h-4.5 fill-current text-white group-hover:scale-110 transition-transform" />
                <span>Start Investigation</span>
                <ChevronRight className="w-4 h-4 text-red-300 animate-pulse" />
              </button>

              <a 
                href="#how-it-works"
                className="px-6 py-4 bg-[#121826]/60 hover:bg-[#121826]/90 border border-[#2d2d33] rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2"
              >
                <span>Read AI Blueprints</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>

            {/* Mini User Tag info if already has some stats */}
            {stats.totalSolved > 0 && (
              <div className="pt-2 font-mono text-[11px] text-[#94A3B8] flex items-center justify-center lg:justify-start gap-4">
                <span>Dossiers Solved: <strong className="text-emerald-400 font-bold">{stats.totalSolved}</strong></span>
                <span>•</span>
                <span>Detective Rank: <strong className="text-[#FFD166] font-bold">{stats.rank.toUpperCase()}</strong></span>
              </div>
            )}
          </div>

          {/* RIGHT: GIANT INTERACTIVE ANIMATED EVIDENCE BOARD */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-[#121826] border-2 border-amber-900/35 rounded-2xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.05)] overflow-hidden">
              {/* Wooden corkboard frame glow */}
              <div className="absolute inset-0 bg-radial-gradient opacity-[0.03] pointer-events-none" />
              <div className="absolute top-2 left-2 text-[8px] font-mono text-[#94A3B8]/40 uppercase tracking-widest">A.R.G.U.S._VISUAL_MATRIX_BOARD</div>

              <div className="grid grid-cols-3 gap-3 relative z-10">
                
                {/* 1. Victim Photo Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0B0F19] border border-red-500/30 p-2.5 rounded-lg shadow-lg relative rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow shadow-black" />
                  <div className="aspect-square bg-slate-900 rounded mb-1.5 overflow-hidden flex items-center justify-center text-3xl">
                    💀
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-red-500 font-mono text-center leading-tight">VICTIM_EMMA_C</h4>
                  <p className="text-[8px] text-[#94A3B8] font-mono text-center">Found 11:42 PM</p>
                </motion.div>

                {/* 2. Footprint Evidence Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0B0F19] border border-amber-500/30 p-2.5 rounded-lg shadow-lg relative rotate-[3deg] hover:rotate-0 transition-transform duration-300"
                >
                  <div className="absolute -top-1.5 left-1/3 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow" />
                  <div className="aspect-square bg-slate-900 rounded mb-1.5 flex items-center justify-center text-3xl">
                    👣
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-[#FFD166] font-mono text-center leading-tight">FOOTPRINT_S10</h4>
                  <p className="text-[8px] text-[#94A3B8] font-mono text-center">Depth Traced</p>
                </motion.div>

                {/* 3. Location Pin Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#0B0F19] border border-blue-500/30 p-2.5 rounded-lg shadow-lg relative rotate-[-1deg] hover:rotate-0 transition-transform duration-300"
                >
                  <div className="absolute -top-1.5 right-1/4 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow" />
                  <div className="aspect-square bg-slate-900 rounded mb-1.5 flex items-center justify-center text-3xl">
                    📍
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-[#3B82F6] font-mono text-center leading-tight">COORDINATES_X</h4>
                  <p className="text-[8px] text-[#94A3B8] font-mono text-center">Park Lawn Grid</p>
                </motion.div>

                {/* 4. Witness Statement */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="col-span-2 bg-[#0B0F19] border border-[#2d2d33] p-2.5 rounded-lg shadow-lg relative rotate-[1deg] hover:rotate-0 transition-transform duration-300 flex gap-3 items-center"
                >
                  <div className="absolute -top-1.5 left-1/4 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow" />
                  <div className="text-2xl shrink-0 p-1 bg-slate-900 rounded">🗣️</div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black uppercase text-emerald-500 font-mono">WITNESS_STATEMENT_01</h4>
                    <p className="text-[8px] text-[#94A3B8] leading-tight font-mono">&ldquo;I saw someone in a dark heavy coat leaving through the north arbor gates around 11:45 PM...&rdquo;</p>
                  </div>
                </motion.div>

                {/* 5. Suspect Profiles Pin */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-[#0B0F19] border border-red-500/40 p-2.5 rounded-lg shadow-lg relative rotate-[-3deg] hover:rotate-0 transition-transform duration-300"
                >
                  <div className="absolute -top-1.5 right-1/3 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow" />
                  <div className="aspect-square bg-slate-900 rounded mb-1.5 flex items-center justify-center text-3xl">
                    👩‍🔬
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-red-500 font-mono text-center leading-tight">SUSPECT_SARAH</h4>
                  <p className="text-[8px] text-[#94A3B8] font-mono text-center">91% Probability</p>
                </motion.div>
              </div>

              {/* Connected SVG Red Investigation Strings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ mixBlendMode: 'screen' }}>
                {/* String from Victim to Footprint */}
                <motion.path 
                  d="M 120 100 Q 150 150 220 100" 
                  fill="none" 
                  stroke="#FF4D4D" 
                  strokeWidth="2.5" 
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                {/* String from Victim to Witness */}
                <motion.path 
                  d="M 120 100 Q 110 200 180 230" 
                  fill="none" 
                  stroke="#FF4D4D" 
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 1.0 }}
                />
                {/* String from Witness to Coordinates */}
                <motion.path 
                  d="M 180 230 Q 250 250 340 100" 
                  fill="none" 
                  stroke="#FF4D4D" 
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 1.2 }}
                />
                {/* String from Suspect to Footprint */}
                <motion.path 
                  d="M 330 210 Q 270 170 220 100" 
                  fill="none" 
                  stroke="#FF4D4D" 
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 1.4 }}
                />
              </svg>

              {/* Dynamic Investigation Live Simulation Card */}
              <div className="mt-6 border-t border-[#2d2d33]/50 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">LIVE_DEDUCTION_SIMULATOR</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#94A3B8]">NEXT_CYCLE_6s</span>
                </div>

                <div className="bg-[#0B0F19] border border-[#2d2d33] rounded-lg p-3.5 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono">
                      <span className="text-stone-500 block uppercase">Active dossier:</span>
                      <strong className="text-[#FFD166]">{currentSim.caseId}</strong>
                    </div>
                    <div className="text-[9px] font-mono space-y-1">
                      <div className="text-stone-500">Location: <strong className="text-stone-300 font-normal">{currentSim.location}</strong></div>
                      <div className="text-stone-500">Weather: <strong className="text-stone-300 font-normal">{currentSim.weather}</strong></div>
                      <div className="text-stone-500">Witness Rel: <strong className="text-stone-300 font-normal">{currentSim.witnessReliability}</strong></div>
                    </div>
                  </div>

                  <div className="space-y-2 border-l border-[#2d2d33]/40 pl-3">
                    {simProcessing ? (
                      <div className="h-full flex flex-col justify-center items-center space-y-1.5 py-2">
                        <Cpu className="w-5 h-5 text-red-500 animate-spin" />
                        <span className="text-[8px] font-mono text-red-400 tracking-widest uppercase">ARGUS_COMPUTING_{simProgress}%</span>
                        <div className="w-full bg-[#121826] h-1 rounded-full overflow-hidden border border-[#2d2d33]">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${simProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1.5"
                      >
                        <div className="text-[10px] font-mono">
                          <span className="text-stone-500 block uppercase">Most Likely Suspect:</span>
                          <strong className="text-red-400">{currentSim.suspect}</strong>
                        </div>
                        <div className="text-[10px] font-mono">
                          <span className="text-stone-500 block uppercase">Confidence index:</span>
                          <span className="text-emerald-400 font-bold font-mono">{currentSim.confidence}</span>
                        </div>
                        <p className="text-[8px] text-stone-500 leading-tight font-mono">
                          {currentSim.reasoning}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* THREE INTERACTIVE ADVANTAGE CARDS */}
      <section id="how-it-works" className="py-16 border-t border-[#121826] bg-[#121826]/30 relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#FFD166] font-mono">Core Machine Learning Engines</h2>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F8FAFC]">Explainable AI (XAI) Chamber</h3>
            <p className="text-sm text-[#94A3B8]">
              No secret black boxes. ARGUS utilizes rigorous, standard classification systems and computes trace probability weights with full explanation loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Evidence Analysis */}
            <div className="bg-[#121826] border border-[#2d2d33] rounded-xl p-6 space-y-4 hover:border-red-500/30 hover:shadow-lg transition-all group duration-300">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-[#FF4D4D] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Evidence Joint-Extraction</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                Multimodal analysis scans raw image files and extracts alibi inconsistencies, footprint treads, and physical fiber stains.
              </p>
            </div>

            {/* Card 2: Bayesian Reasoning */}
            <div className="bg-[#121826] border border-[#2d2d33] rounded-xl p-6 space-y-4 hover:border-amber-500/30 hover:shadow-lg transition-all group duration-300">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-[#FFD166] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Bayesian Normalization</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                Updates prior guilt estimates P(S) based on conditional likelihood margins of alibi failure, timeline locks, and witness accounts.
              </p>
            </div>

            {/* Card 3: Suspect Prediction */}
            <div className="bg-[#121826] border border-[#2d2d33] rounded-xl p-6 space-y-4 hover:border-[#3B82F6]/30 hover:shadow-lg transition-all group duration-300">
              <div className="w-10 h-10 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Suspect Ranking Gradient</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                Ranks profiles according to maximum posterior log-likelihood, feeding clear decision streams back into the sleuth's visual tray.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* STORY PROGRESSION / ACTIVE CASES PREVIEW */}
      <section className="py-16 border-t border-[#121826] relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#3B82F6] font-mono">Story Chapters & Dossier Files</h2>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F8FAFC]">Select Active Crime Files</h3>
            </div>
            <button
              onClick={handleStartClicked}
              className="px-5 py-2.5 bg-[#121826] border border-[#2d2d33] text-xs font-mono font-bold uppercase hover:bg-stone-900 hover:text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Chapters ({activeCasesCount})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Case A */}
            <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                <span className="text-red-400">CHAPTER 01</span>
                <span className="bg-[#0B0F19] text-[#94A3B8] px-2 py-0.5 rounded border border-[#2d2d33]">EASY</span>
              </div>
              <h4 className="text-base font-black text-[#F8FAFC] mb-2">The Missing Diamond</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 font-mono">
                A flawless 50-carat blue diamond vanishes from a locked vault at the Royal Gala. Only three staff members held keys, but security logs reveal bypass markers.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-3 border-t border-[#2d2d33]/50">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-stone-500" /> 3 Clues</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-500" /> ~5 min</span>
              </div>
            </div>

            {/* Case B */}
            <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-600/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                <span className="text-amber-400">CHAPTER 02</span>
                <span className="bg-[#0B0F19] text-[#94A3B8] px-2 py-0.5 rounded border border-[#2d2d33]">MEDIUM</span>
              </div>
              <h4 className="text-base font-black text-[#F8FAFC] mb-2">Midnight Museum Theft</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 font-mono">
                A priceless Renaissance painting is carved out of its frame during a simulated thunder grid storm. Uncover the network access override trail.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-3 border-t border-[#2d2d33]/50">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-stone-500" /> 4 Clues</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-500" /> ~10 min</span>
              </div>
            </div>

            {/* Case C */}
            <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                <span className="text-blue-400">CHAPTER 03</span>
                <span className="bg-[#0B0F19] text-[#94A3B8] px-2 py-0.5 rounded border border-[#2d2d33]">HARD</span>
              </div>
              <h4 className="text-base font-black text-[#F8FAFC] mb-2">The Railway Mystery</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 font-mono">
                A high-profile passenger is poisoned on a moving express locomotive. Compartment locked from the inside, matching alibis, but timeline trace shows conflicts.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-3 border-t border-[#2d2d33]/50">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-stone-500" /> 5 Clues</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-500" /> ~15 min</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MODERN DYNAMIC STATISTICS STRIP */}
      <section className="py-12 border-y border-[#121826] bg-[#0E1321] relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            
            <div className="space-y-1">
              <span className="text-[#94A3B8] text-[10px] font-mono uppercase block tracking-wider">Cases Decoded</span>
              <strong className="text-2xl sm:text-3xl font-black text-[#F8FAFC] font-mono block">
                {casesSolvedCount.toLocaleString()}
              </strong>
            </div>

            <div className="space-y-1 border-l border-[#2d2d33]/60">
              <span className="text-[#94A3B8] text-[10px] font-mono uppercase block tracking-wider">Traces Processed</span>
              <strong className="text-2xl sm:text-3xl font-black text-[#FFD166] font-mono block">
                {(evidenceCount / 1000000).toFixed(1)}M
              </strong>
            </div>

            <div className="space-y-1 border-l border-[#2d2d33]/60">
              <span className="text-[#94A3B8] text-[10px] font-mono uppercase block tracking-wider">Classifier Accuracy</span>
              <strong className="text-2xl sm:text-3xl font-black text-[#FF4D4D] font-mono block">
                {accuracyVal}%
              </strong>
            </div>

            <div className="space-y-1 border-l border-[#2d2d33]/60">
              <span className="text-[#94A3B8] text-[10px] font-mono uppercase block tracking-wider">Suspects Ranked</span>
              <strong className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                {suspectsCount.toLocaleString()}+
              </strong>
            </div>

          </div>
        </div>
      </section>

      {/* MACHINE LEARNING PIPELINE DIAGRAM */}
      <section className="py-16 relative z-30 bg-[#121826]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-emerald-400 font-mono">Deduction Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F8FAFC]">Standard ML Inference Pipeline</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              Follow how evidence nodes transform into predictive probabilities of suspect guilt.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            
            <div className="w-full md:w-36 bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center font-mono">
              <div className="text-[10px] text-stone-500">INPUT</div>
              <strong className="text-xs text-white block mt-1 uppercase">Clues & Audio</strong>
            </div>

            <div className="text-stone-600 font-bold rotate-90 md:rotate-0">&rarr;</div>

            <div className="w-full md:w-40 bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center font-mono">
              <div className="text-[10px] text-red-400">FEATURE EXTR.</div>
              <strong className="text-xs text-white block mt-1 uppercase">Alibi, Timeline</strong>
            </div>

            <div className="text-stone-600 font-bold rotate-90 md:rotate-0">&rarr;</div>

            <div className="w-full md:w-44 bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center font-mono relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[6px] font-sans font-bold bg-amber-500/10 text-[#FFD166] border border-amber-500/20 px-1 rounded-bl">BAYES</div>
              <div className="text-[10px] text-[#FFD166]">POSTERIOR EVAL</div>
              <strong className="text-xs text-white block mt-1 uppercase">Motive & Opp.</strong>
            </div>

            <div className="text-stone-600 font-bold rotate-90 md:rotate-0">&rarr;</div>

            <div className="w-full md:w-40 bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center font-mono">
              <div className="text-[10px] text-blue-400">ENSEMBLE GRID</div>
              <strong className="text-xs text-white block mt-1 uppercase">Probability Node</strong>
            </div>

            <div className="text-stone-600 font-bold rotate-90 md:rotate-0">&rarr;</div>

            <div className="w-full md:w-36 bg-gradient-to-r from-red-950/40 to-stone-950/40 border border-red-500/30 p-3 rounded-lg text-center font-mono">
              <div className="text-[10px] text-red-500 font-bold animate-pulse">OUTPUT</div>
              <strong className="text-xs text-red-400 block mt-1 uppercase">True Suspect</strong>
            </div>

          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="py-16 border-t border-[#121826] relative z-30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#FFD166] font-mono">Active Bureau Mainframe</h2>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F8FAFC]">Top Investigator Bureau</h3>
          </div>

          <div className="bg-[#121826] border border-[#2d2d33] rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#0B0F19] border-b border-[#2d2d33] text-stone-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4 text-center">Cases Solved</th>
                  <th className="py-3.5 px-4 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d33]/40">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#FFD166] fill-current" /> <span>01</span></td>
                  <td className="py-3.5 px-4 text-white font-bold">Det. Alexandra Vance</td>
                  <td className="py-3.5 px-4 text-center text-[#FFD166]">1,420</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">98.4%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-stone-400 fill-current" /> <span>02</span></td>
                  <td className="py-3.5 px-4 text-stone-200">Det. Marcus Kane</td>
                  <td className="py-3.5 px-4 text-center">1,215</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">97.1%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-700 fill-current" /> <span>03</span></td>
                  <td className="py-3.5 px-4 text-stone-200">Sleuth Bishop</td>
                  <td className="py-3.5 px-4 text-center">980</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">95.8%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">04</td>
                  <td className="py-3.5 px-4 text-stone-300">Agent Linus</td>
                  <td className="py-3.5 px-4 text-center">875</td>
                  <td className="py-3.5 px-4 text-right text-emerald-500">94.2%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">05</td>
                  <td className="py-3.5 px-4 text-stone-300">Chief Vance</td>
                  <td className="py-3.5 px-4 text-center">740</td>
                  <td className="py-3.5 px-4 text-right text-stone-400">93.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-30 border-t border-[#121826] bg-[#0B0F19] py-10 text-center px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-xs text-[#94A3B8] font-mono leading-relaxed max-w-sm mx-auto">
            &ldquo;Every mystery leaves a trail. AI helps reveal it.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-stone-500 font-mono uppercase">
            <span>React</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Scikit-Learn</span>
            <span>•</span>
            <span>Bayesian Networks</span>
            <span>•</span>
            <span>Explainable AI</span>
          </div>
          <p className="text-[10px] text-stone-600 font-mono mt-4">
            &copy; {new Date().getFullYear()} AI Crime Scene Investigator. All classified rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
