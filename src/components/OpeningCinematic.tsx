/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Terminal, Eye, Sparkles } from 'lucide-react';
import { playTypewriterTick, playRadioBurst, playScannerSweep } from '../lib/audioEngine';

interface OpeningCinematicProps {
  onComplete: () => void;
}

export default function OpeningCinematic({ onComplete }: OpeningCinematicProps) {
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "CONFIDENTIAL CASE FILE // AUTHORIZED BUREAU PERSONS ONLY // COMMENCING A.R.G.U.S. BOOT SECTOR INITIALIZATION...";

  useEffect(() => {
    // Stage-based triggers
    const timers = [
      setTimeout(() => { setStep(1); playRadioBurst(); }, 1200), // Classified stamp
      setTimeout(() => { setStep(2); playRadioBurst(); }, 2800), // Typewriter text start
      setTimeout(() => { setStep(3); playScannerSweep(); }, 5000), // Boot up system
      setTimeout(() => { setStep(4); }, 7500), // Game title reveal
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  // Handle typing effect for step 2
  useEffect(() => {
    if (step === 2 && textIndex < fullText.length) {
      const interval = setTimeout(() => {
        setText(prev => prev + fullText[textIndex]);
        setTextIndex(i => i + 1);
        // Play click sound occasionally for realist keyboard feel
        if (textIndex % 2 === 0) {
          playTypewriterTick();
        }
      }, 35);
      return () => clearTimeout(interval);
    }
  }, [step, textIndex]);

  const handleSkip = () => {
    playScannerSweep();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black text-[#F8FAFC] z-50 flex flex-col justify-center items-center px-4 overflow-hidden select-none font-mono">
      {/* Immersive CRT overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.04]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 4px'
        }} 
      />

      <div className="absolute top-6 left-6 text-[10px] text-stone-500 font-mono tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
        <span>SECURE_SESSION_ENCRYPTED_AES256</span>
      </div>

      <button 
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-4 py-2 border border-[#2d2d33] hover:border-red-500/50 bg-[#121826]/30 hover:bg-black hover:text-white rounded text-xs font-mono tracking-wider transition-all cursor-pointer z-50"
      >
        SKIP CINEMATIC [ESC]
      </button>

      <div className="max-w-2xl w-full text-center space-y-8 relative">
        <AnimatePresence mode="wait">
          
          {/* Step 0: Pitch Black Beginning */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-stone-700 text-xs font-mono uppercase tracking-widest"
            >
              Establishing connection stream...
            </motion.div>
          )}

          {/* Step 1: CONFIDENTIAL STAMP */}
          {step === 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-red-950/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-black text-xl animate-pulse">
                ⚠️
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-red-500 tracking-[0.25em] uppercase">
                CONFIDENTIAL CASE FILE
              </h2>
              <p className="text-[10px] text-[#FFD166] tracking-[0.4em] font-bold">
                CLASSIFIED DATA DIVISION
              </p>
            </motion.div>
          )}

          {/* Step 2: Boot System Diagnostic Typing */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-left bg-stone-950/80 border border-stone-900 rounded-lg p-6 font-mono text-[11px] leading-relaxed text-emerald-400 min-h-[140px] flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="text-stone-500 text-[9px] uppercase">A.R.G.U.S. Core Loader:</div>
                <p className="font-mono">
                  {text}
                  <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse ml-0.5" />
                </p>
              </div>
              <div className="flex justify-between items-center text-stone-600 text-[9px] pt-4 border-t border-stone-900/50 mt-4">
                <span>SECTOR: 0x88F11A</span>
                <span>STATUS: NOMINAL</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Neural Systems Activating & Booting */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="w-12 h-12 rounded-full border border-red-500 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white tracking-widest uppercase">ARGUS ONLINE</h3>
                <div className="flex justify-center gap-1.5 text-[9px] text-[#94A3B8] uppercase">
                  <span>[Neural Grid: OK]</span>
                  <span>[Bayes: OK]</span>
                  <span>[Explainers: OK]</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Full Game Title Reveal */}
          {step === 4 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-[#FF4D4D] text-[9px] font-mono px-3 py-1 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CYBERNETIC SLEUTH MAINFRAME ENGAGED</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white uppercase">
                AI Crime Scene <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#FFD166] to-red-600">
                  Investigator
                </span>
              </h1>

              <p className="text-xs text-[#94A3B8] tracking-widest uppercase font-mono max-w-sm mx-auto">
                "Every clue leaves a trace. Let neural inference isolate the guilty."
              </p>

              <button
                onClick={handleSkip}
                className="mt-4 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-widest rounded-lg transition-all transform hover:scale-105 cursor-pointer border border-red-500/30 shadow-lg shadow-red-900/30"
              >
                Launch Bureau Terminal
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
