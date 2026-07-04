/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Network, Compass, Brain, FileText, ChevronLeft, HelpCircle, Activity } from 'lucide-react';

interface AboutArgusProps {
  onBackToMenu: () => void;
}

export default function AboutArgus({ onBackToMenu }: AboutArgusProps) {
  const [activeTab, setActiveTab] = useState<'bayes' | 'gradient' | 'xai'>('bayes');

  // Interactive sample state for user to test weights
  const [motive, setMotive] = useState(70);
  const [opportunity, setOpportunity] = useState(80);
  const [alibi, setAlibi] = useState(30); // 30% alibi strength is weak
  const [witness, setWitness] = useState(85);

  // Compute live Bayesian demo
  const p_motive = 0.15 + 0.7 * (motive / 100);
  const p_opportunity = 0.15 + 0.7 * (opportunity / 100);
  const p_alibi_fail = 0.15 + 0.7 * ((100 - alibi) / 100);
  const p_witness = 0.2 + 0.6 * (witness / 100);

  const rawLikelihood = p_motive * p_opportunity * p_alibi_fail * p_witness;
  const confidencePercent = Math.min(99.9, Math.round(rawLikelihood * 250 * 10) / 10);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] py-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2d2d33] bg-[#121826]/40 hover:bg-[#121826]/80 text-xs font-mono transition-all text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Bureau Mainframe</span>
        </button>

        {/* HERO TITLE */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-[#FF4D4D] text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>A.R.G.U.S. EXPLAINABLE AI CHAMBER</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">How A.R.G.U.S. Reaches Decisions</h2>
          <p className="text-sm text-[#94A3B8] max-w-2xl">
            ARGUS utilizes a custom ensemble of statistical classifiers to parse physical clues and rank suspect profiles transparently. Explore the live mathematics below.
          </p>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex border-b border-[#2d2d33] gap-1">
          <button
            onClick={() => setActiveTab('bayes')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'bayes'
                ? 'border-[#FFD166] text-[#FFD166] bg-amber-500/5'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            1. Bayesian Network P(S|E)
          </button>
          <button
            onClick={() => setActiveTab('gradient')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'gradient'
                ? 'border-[#FF4D4D] text-[#FF4D4D] bg-red-500/5'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            2. Gradient Boosting Tree
          </button>
          <button
            onClick={() => setActiveTab('xai')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'xai'
                ? 'border-[#3B82F6] text-[#3B82F6] bg-blue-500/5'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            3. Feature Importance (XAI)
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-[#121826] border border-[#2d2d33] rounded-2xl p-6 sm:p-8">
          {activeTab === 'bayes' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#FFD166]" />
                  <span>Bayesian Probability Propagation</span>
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                  Bayesian inference calculates conditional likelihood: <strong>P(S | E) = [P(E | S) * P(S)] / P(E)</strong>. 
                  When you discover physical evidence markers (e.g. Footprints, Witness overrides), the model updates its joint-probability estimates dynamically.
                </p>
              </div>

              {/* LIVE PLAYGROUND */}
              <div className="bg-[#0B0F19] border border-[#2d2d33] rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-amber-500 font-mono tracking-widest">Adjust Prior Weights</h4>
                  
                  {/* Motive Score slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Motive Weight Score:</span>
                      <strong className="text-white">{motive}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={motive} 
                      onChange={(e) => setMotive(Number(e.target.value))}
                      className="w-full h-1 bg-[#121826] rounded-full appearance-none cursor-pointer accent-[#FFD166]"
                    />
                  </div>

                  {/* Opportunity Score slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Opportunity Window Score:</span>
                      <strong className="text-white">{opportunity}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={opportunity} 
                      onChange={(e) => setOpportunity(Number(e.target.value))}
                      className="w-full h-1 bg-[#121826] rounded-full appearance-none cursor-pointer accent-[#FFD166]"
                    />
                  </div>

                  {/* Alibi Strength slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Alibi Security Strength:</span>
                      <strong className="text-white">{alibi}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={alibi} 
                      onChange={(e) => setAlibi(Number(e.target.value))}
                      className="w-full h-1 bg-[#121826] rounded-full appearance-none cursor-pointer accent-[#FFD166]"
                    />
                  </div>

                  {/* Witness Reliability slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Witness Overlap Match:</span>
                      <strong className="text-white">{witness}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={witness} 
                      onChange={(e) => setWitness(Number(e.target.value))}
                      className="w-full h-1 bg-[#121826] rounded-full appearance-none cursor-pointer accent-[#FFD166]"
                    />
                  </div>
                </div>

                {/* CALCULATOR OUTPUTS */}
                <div className="border-t md:border-t-0 md:border-l border-[#2d2d33]/50 pt-5 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#94A3B8] font-mono tracking-widest">Inference Computations</h4>
                    <div className="space-y-1.5 text-[10px] font-mono text-[#94A3B8]">
                      <div>P(Motive Factor) = <strong className="text-white">{p_motive.toFixed(3)}</strong></div>
                      <div>P(Opportunity Factor) = <strong className="text-white">{p_opportunity.toFixed(3)}</strong></div>
                      <div>P(Alibi Failure) = <strong className="text-white">{p_alibi_fail.toFixed(3)}</strong></div>
                      <div>P(Witness Factor) = <strong className="text-white">{p_witness.toFixed(3)}</strong></div>
                    </div>
                  </div>

                  <div className="bg-[#121826]/80 p-3 rounded-lg border border-amber-900/30 text-center space-y-1 mt-4">
                    <span className="text-[9px] font-mono text-stone-500 uppercase block tracking-widest">Posterior Confidence Score</span>
                    <strong className="text-2xl font-mono text-[#FFD166]">{confidencePercent}%</strong>
                    <div className="text-[8px] font-mono text-emerald-400">NOMINAL INFERENCE INDEX</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradient' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#FF4D4D]" />
                  <span>Ensemble Gradient Boosting Decision Tree</span>
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                  Gradient Boosting sequential tree ensembles optimize cross-entropy loss by fitting subsequent trees to the model residuals. Let's see how raw inputs filter down the branch branches:
                </p>
              </div>

              {/* DECISION TREE VISUAL DIAGRAM */}
              <div className="bg-[#0B0F19] border border-[#2d2d33] rounded-xl p-6 font-mono text-xs space-y-6">
                
                {/* Tree Root */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center w-56 shadow-lg">
                    <div className="text-[9px] text-stone-500 uppercase">Tree Root Node</div>
                    <strong className="text-[#FF4D4D]">Opportunity &gt; 50%</strong>
                  </div>
                  <div className="w-0.5 h-6 bg-red-950" />
                </div>

                {/* Sub branches */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center w-48 shadow-lg">
                      <div className="text-[9px] text-stone-500 uppercase">Branch Left (True)</div>
                      <strong className="text-[#FFD166]">Alibi Fail &gt; 60%</strong>
                    </div>
                    <div className="w-0.5 h-6 bg-[#2d2d33]" />
                    <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 p-2 rounded text-[10px] w-40 text-center uppercase tracking-wider font-bold">
                      Suspect Guilty
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-[#121826] border border-[#2d2d33] p-3 rounded-lg text-center w-48 shadow-lg">
                      <div className="text-[9px] text-stone-500 uppercase">Branch Right (False)</div>
                      <strong className="text-[#3B82F6]">Motive Match &lt; 30%</strong>
                    </div>
                    <div className="w-0.5 h-6 bg-[#2d2d33]" />
                    <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-2 rounded text-[10px] w-40 text-center uppercase tracking-wider font-bold">
                      Suspect Innocent
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-stone-500 pt-4 border-t border-[#2d2d33]/40">
                  *Residual error updates are multiplied by learning rate of 0.1 per epoch loop.
                </div>

              </div>
            </div>
          )}

          {activeTab === 'xai' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#3B82F6]" />
                  <span>Feature Importance (SHAP Matrix)</span>
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-mono">
                  SHAP values allocate a margin importance coefficient to each physical clue trace. This guarantees that human investigators can verify which elements had the highest mathematical sway.
                </p>
              </div>

              {/* FEATURE LIST WEIGHTS */}
              <div className="space-y-4 bg-[#0B0F19] p-5 rounded-xl border border-[#2d2d33]">
                
                {/* Feature 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span>1. Alibi Consistency Failure (X_alibi)</span>
                    <strong className="text-red-400">+0.38 Importance</strong>
                  </div>
                  <div className="w-full bg-[#121826] h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span>2. Physical Footprint Matching (X_footprint)</span>
                    <strong className="text-amber-400">+0.26 Importance</strong>
                  </div>
                  <div className="w-full bg-[#121826] h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span>3. Suspect motive weight (X_motive)</span>
                    <strong className="text-blue-400">+0.18 Importance</strong>
                  </div>
                  <div className="w-full bg-[#121826] h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span>4. Witness corroboration index (X_witness)</span>
                    <strong className="text-emerald-400">+0.12 Importance</strong>
                  </div>
                  <div className="w-full bg-[#121826] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
