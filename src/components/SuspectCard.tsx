/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Suspect } from '../types';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Fingerprint, RefreshCw, BarChart2, MessageSquare, Compass, Eye } from 'lucide-react';

interface SuspectCardProps {
  key?: string | number;
  suspect: Suspect;
  onSelect: (suspectId: string) => void;
  isSelected: boolean;
  isWarmMode: boolean;
  disabled: boolean;
}

export default function SuspectCard({ suspect, onSelect, isSelected, isWarmMode, disabled }: SuspectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Styling helper based on isWarmMode
  const bgCard = isWarmMode 
    ? 'bg-[#f4ebe1] border-amber-800/30 text-stone-900 shadow-md' 
    : 'bg-[#15151a] border-[#2d2d33] text-[#d1d1d6] shadow-xl';

  const badgeStyle = isWarmMode
    ? 'bg-amber-900/10 text-amber-900 border-amber-800/30 font-serif'
    : 'bg-red-950/40 text-red-500 border border-red-900/40 font-mono';

  return (
    <div className="relative w-full max-w-[340px] aspect-[3/4.2] perspective-1000 mx-auto">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative w-full h-full transform-style-3d cursor-pointer"
        onClick={() => {
          if (!disabled) {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* FRONT OF THE CARD (Polaroid Mugshot) */}
        <div 
          className={`absolute inset-0 backface-hidden w-full h-full flex flex-col p-4 rounded-xl border transition-all ${bgCard} ${
            isSelected 
              ? 'ring-2 ring-red-500 scale-[1.02] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
              : 'hover:scale-[1.01]'
          }`}
          style={{ transform: 'rotateY(0deg)' }}
        >
          {/* Tape Accent for warm mode */}
          {isWarmMode && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-100/60 border border-yellow-200/50 -rotate-2 mix-blend-multiply shadow-sm"></div>
          )}

          {/* Photo frame */}
          <div className="relative w-full aspect-square rounded-lg bg-stone-950 overflow-hidden border border-stone-800/30 flex items-center justify-center group/photo">
            {/* Silhouetted Avatar background */}
            <div className="absolute inset-0 bg-radial from-stone-800 via-stone-950 to-stone-950 opacity-80" />
            
            {/* Fingerprint stamp in background */}
            <Fingerprint className={`absolute w-36 h-36 opacity-10 ${suspect.fingerprintMatch ? 'text-red-500' : 'text-stone-400'}`} />

            {/* Avatar Emoji */}
            <span className="text-7xl z-10 select-none transform transition-transform group-hover/photo:scale-110 duration-500">
              {suspect.avatarUrl}
            </span>

            {/* Suspect Tag badge */}
            <div className="absolute top-2 left-2 z-20 flex gap-1.5">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${badgeStyle}`}>
                {suspect.role}
              </span>
            </div>

            {/* Fingerprint indicator badge */}
            {suspect.fingerprintMatch && (
              <div className="absolute bottom-2 right-2 z-20 bg-red-950/90 text-red-400 px-2 py-0.5 rounded border border-red-800/50 text-[9px] uppercase font-mono flex items-center gap-1">
                <Fingerprint className="w-3 h-3 animate-pulse" />
                <span>Print Match</span>
              </div>
            )}
          </div>

          {/* Suspect Information */}
          <div className="mt-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className={`font-serif font-bold text-lg tracking-tight ${isWarmMode ? 'text-stone-900' : 'text-stone-100'}`}>
                  {suspect.name}
                </h3>
                <span className="text-xs text-stone-500 font-mono">ID: {suspect.id.split('-').pop()}</span>
              </div>
              
              <div className="mt-2 text-xs line-clamp-3 leading-relaxed opacity-90 italic">
                &ldquo;{suspect.motive}&rdquo;
              </div>
            </div>

            <div className={`border-t border-dashed pt-3 flex items-center justify-between ${
              isWarmMode ? 'border-stone-700/20' : 'border-[#2d2d33]'
            }`}>
              <button
                id={`flip-suspect-${suspect.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className={`text-[10px] font-mono flex items-center gap-1.5 transition-colors uppercase ${
                  isWarmMode ? 'text-amber-800 hover:text-amber-900' : 'text-[#6b6b76] hover:text-[#d1d1d6]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>INSPECT_PARAMS</span>
              </button>

              <button
                id={`select-suspect-${suspect.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(suspect.id);
                }}
                className={`px-3 py-1 text-[10px] font-bold rounded-sm font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border border-red-500'
                    : isWarmMode
                    ? 'bg-stone-900 text-[#f4ebe1] hover:bg-stone-800'
                    : 'bg-[#2d2d33] border border-[#3d3d45] text-[#d1d1d6] hover:bg-red-700 hover:text-white hover:border-red-500'
                }`}
              >
                {isSelected ? 'ACCUSED' : 'ACCUSE'}
              </button>
            </div>
          </div>
        </div>

        {/* BACK OF THE CARD (ML Feature Vectors) */}
        <div 
          className={`absolute inset-0 backface-hidden w-full h-full flex flex-col p-4 rounded-xl border transition-all ${bgCard} ${
            isSelected 
              ? 'ring-2 ring-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
              : ''
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-dashed border-stone-700/30 pb-2 mb-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
              ML Feature Vector System
            </span>
            <div className="flex items-center gap-1 bg-red-950 text-red-400 border border-red-900/50 text-[9px] font-mono px-1.5 py-0.5 rounded">
              <BarChart2 className="w-3 h-3" />
              <span>CLASSIFIER PARAMS</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-base mb-3 text-stone-300">
            {suspect.name} <span className="text-xs font-sans font-normal opacity-70">({suspect.role})</span>
          </h3>

          {/* Metric list */}
          <div className="space-y-3.5 flex-1">
            {/* Metric 1: Motive Score */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5 font-mono">
                <span className="text-[#6b6b76] uppercase">Motive Score</span>
                <span className="text-amber-500 font-bold">{suspect.motiveScore}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-1.5 rounded-full overflow-hidden border border-[#2d2d33]">
                <div 
                  className="bg-amber-500 h-full rounded transition-all duration-500" 
                  style={{ width: `${suspect.motiveScore}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Opportunity Score */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5 font-mono">
                <span className="text-[#6b6b76] uppercase">Opportunity Score</span>
                <span className="text-blue-500 font-bold">{suspect.opportunityScore}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-1.5 rounded-full overflow-hidden border border-[#2d2d33]">
                <div 
                  className="bg-blue-600 h-full rounded transition-all duration-500" 
                  style={{ width: `${suspect.opportunityScore}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Witness Reliability */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5 font-mono">
                <span className="text-[#6b6b76] uppercase">Witness Reliability</span>
                <span className="text-emerald-500 font-bold">{suspect.witnessReliability}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-1.5 rounded-full overflow-hidden border border-[#2d2d33]">
                <div 
                  className="bg-emerald-600 h-full rounded transition-all duration-500" 
                  style={{ width: `${suspect.witnessReliability}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Alibi Strength */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5 font-mono">
                <span className="text-[#6b6b76] uppercase">Alibi Strength</span>
                <span className="text-red-500 font-bold">{suspect.alibiStrength}%</span>
              </div>
              <div className="w-full bg-[#0c0c0e] h-1.5 rounded-full overflow-hidden border border-[#2d2d33]">
                <div 
                  className="bg-red-600 h-full rounded transition-all duration-500" 
                  style={{ width: `${suspect.alibiStrength}%` }}
                />
              </div>
            </div>
          </div>

          {/* Back action */}
          <div className="border-t border-dashed border-stone-700/20 pt-3 mt-auto flex items-center justify-between">
            <button
              id={`flip-back-suspect-${suspect.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className={`text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
                isWarmMode ? 'text-amber-800 hover:text-amber-900' : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Mugshot</span>
            </button>
            <span className="text-[10px] text-stone-500 font-mono">Click anywhere to flip</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
