/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal as TerminalIcon, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface ExplanationEngineProps {
  cluesSummary: string;
  reasoningChain: string;
  isLoading: boolean;
  isWarmMode: boolean;
}

export default function ExplanationEngine({ cluesSummary, reasoningChain, isLoading, isWarmMode }: ExplanationEngineProps) {
  const panelStyle = isWarmMode
    ? 'bg-[#fcf8f2] border-amber-800/20 text-stone-900 shadow-md'
    : 'bg-[#15151a] border-[#2d2d33] text-[#d1d1d6] shadow-xl';

  const terminalStyle = isWarmMode
    ? 'bg-[#f4ebe1] border-amber-800/10 text-stone-900 font-serif'
    : 'bg-[#0c0c0e] border-[#2d2d33] text-stone-300 font-mono';

  return (
    <div className={`rounded-xl p-4 sm:p-5 border ${panelStyle}`}>
      {/* Title */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-4 border-b gap-2 ${
        isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
      }`}>
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-red-500 animate-pulse" />
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider">Explainable AI (XAI) Deduction Engine</h2>
        </div>
        <div className={`flex items-center gap-1 border text-[9px] font-mono px-2 py-0.5 rounded ${
          isWarmMode 
            ? 'bg-amber-950/10 text-amber-900 border-amber-800/30' 
            : 'bg-red-950/40 text-red-500 border-red-900/40'
        }`}>
          <Sparkles className="w-3 h-3 text-red-500" />
          <span>COGNITIVE_REASONING_ENGINE</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border border-red-500/10 animate-ping" />
          </div>
          <div>
            <p className="text-xs font-mono text-stone-400">Ensemble Gradient Boosting Classifier running...</p>
            <p className="text-[10px] font-mono text-stone-500 mt-1">Calculating posterior Bayes logs and drafting case file...</p>
          </div>
        </div>
      ) : reasoningChain || cluesSummary ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column 1: Forensic Clues Summary */}
          <div className="space-y-2">
            <div className={`flex items-center gap-1.5 border-b pb-2 ${
              isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
            }`}>
              <BookOpen className="w-4 h-4 text-[#6b6b76]" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b76] font-mono">
                Forensic Analytics Summary
              </h3>
            </div>
            
            <div className={`p-3 rounded border text-[11px] leading-relaxed space-y-3 max-h-[350px] overflow-y-auto ${terminalStyle}`}>
              {cluesSummary ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {cluesSummary}
                </div>
              ) : (
                <div className="italic text-stone-500 text-center py-6">
                  No forensic summary returned. Verify telemetry links.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Bayesian Reasoning Chain */}
          <div className="space-y-2">
            <div className={`flex items-center gap-1.5 border-b pb-2 ${
              isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
            }`}>
              <TerminalIcon className="w-4 h-4 text-[#6b6b76]" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b76] font-mono">
                Bayesian Reasoning Dossier
              </h3>
            </div>

            <div className={`p-3 rounded border text-[11px] leading-relaxed space-y-3 max-h-[350px] overflow-y-auto ${terminalStyle}`}>
              {reasoningChain ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {reasoningChain}
                </div>
              ) : (
                <div className="italic text-stone-500 text-center py-6">
                  No reasoning chain calculated. Tap 'Analyze Clues' to run Bayesian network.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center py-10 border border-dashed rounded-xl text-center px-4 ${
          isWarmMode ? 'border-stone-800/20 bg-[#f4ebe1]/30' : 'border-[#2d2d33] bg-[#0c0c0e]/30'
        }`}>
          <AlertCircle className="w-7 h-7 text-stone-500 mb-3" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Evidence Chamber Unlocked</h3>
          <p className="text-[11px] text-stone-500 max-w-sm mt-1 mb-4 font-mono">
            Examine the suspects and pin key clues on the corkboard above. Then tap the primary ML calculation button below to run the prediction system.
          </p>
        </div>
      )}
    </div>
  );
}
