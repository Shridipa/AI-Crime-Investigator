/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Evidence } from '../types';
import { Footprints, ShieldAlert, Cpu, Lock, Database, Scissors, Compass, Wrench, Paperclip, CupSoda, Wind, Terminal, CheckCircle2, Circle } from 'lucide-react';

interface EvidenceBoardProps {
  evidenceList: Evidence[];
  isWarmMode: boolean;
  selectedEvidenceIds: string[];
  onToggleEvidence: (id: string) => void;
}

// Icon mapper for the Lucide icons
export const iconMap: { [key: string]: React.ComponentType<any> } = {
  Footprints,
  ShieldAlert,
  Cpu,
  Lock,
  Database,
  Scissors,
  Compass,
  Wrench,
  Paperclip,
  CupSoda,
  Wind,
  Terminal,
};

export default function EvidenceBoard({ evidenceList, isWarmMode, selectedEvidenceIds, onToggleEvidence }: EvidenceBoardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Styling properties
  const boardBg = isWarmMode 
    ? 'bg-[#d6c7b7] border-amber-900/20 shadow-inner' 
    : 'bg-[#1a1a1f] border-[#2d2d33] shadow-inner';

  const woodBorder = isWarmMode
    ? 'border-[12px] border-amber-950 bg-[#eccca2] shadow-xl'
    : 'border border-[#2d2d33] bg-[#1a1a1f] shadow-2xl';

  return (
    <div className={`relative rounded-xl p-4 sm:p-5 border transition-all overflow-hidden ${woodBorder}`}>
      {/* Background Grid Pattern */}
      {!isWarmMode ? (
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(#6b6b76 0.5px, transparent 0.5px)', 
            backgroundSize: '20px 20px' 
          }} 
        />
      ) : (
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      )}

      {/* Title */}
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-4 border-b gap-2 ${
        isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
      }`}>
        <div>
          <h2 className="font-sans font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-red-600"></span>
            <span className={isWarmMode ? 'text-stone-900' : 'text-[#d1d1d6] font-mono'}>Forensic Evidence board</span>
          </h2>
          <p className="text-[10px] text-stone-500 font-mono mt-0.5">
            Examine crime scene logs & telemetry nodes. Pin entries to map correlations.
          </p>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-mono border px-2 py-0.5 rounded ${
          isWarmMode 
            ? 'bg-amber-950/10 text-amber-900 border-amber-800/30' 
            : 'bg-red-950/40 text-red-400 border-red-900/40'
        }`}>
          <span>{selectedEvidenceIds.length}/{evidenceList.length} PLOTS_CONNECTED</span>
        </div>
      </div>

      {/* SVG Canvas for Red Strings */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full min-h-[300px]">
          {/* We draw beautiful connecting lines (red string) between adjacent evidence items if pinned */}
          {selectedEvidenceIds.length > 1 && (
            <g className="opacity-80">
              {selectedEvidenceIds.map((id, index) => {
                if (index === selectedEvidenceIds.length - 1) return null;
                const nextId = selectedEvidenceIds[index + 1];
                
                // Approximate coordinates based on index staggered grid
                const itemWidth = 100 / Math.min(3, evidenceList.length);
                const x1 = ((index % 3) + 0.5) * 33 + '%';
                const y1 = (Math.floor(index / 3) + 0.5) * 45 + '%';
                const x2 = (((index + 1) % 3) + 0.5) * 33 + '%';
                const y2 = (Math.floor((index + 1) / 3) + 0.5) * 45 + '%';

                return (
                  <line
                    key={`string-${id}-${nextId}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                    className="animate-pulse"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Staggered Cards Container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {evidenceList.map((evidence, idx) => {
          const isPinned = selectedEvidenceIds.includes(evidence.id);
          const IconComponent = iconMap[evidence.icon] || ShieldAlert;

          // Stagger card rotate style to mimic physical corkboard pinning
          const angle = (idx % 3 === 0) ? '-1deg' : (idx % 3 === 1) ? '1deg' : '-0.5deg';
          const shadowStyle = isPinned 
            ? 'shadow-[0_8px_16px_rgba(220,38,38,0.15)]' 
            : 'shadow-md';

          return (
            <div
              key={evidence.id}
              onClick={() => onToggleEvidence(evidence.id)}
              onMouseEnter={() => setHoveredId(evidence.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative p-3 border transition-all duration-300 cursor-pointer ${shadowStyle} ${
                isPinned
                  ? isWarmMode
                    ? 'bg-[#faf7f3] border-red-500 scale-[1.01]'
                    : 'bg-[#25252b] border-[#dc2626] scale-[1.01]'
                  : isWarmMode
                  ? 'bg-[#f4ebd9] border-stone-400/40 hover:bg-[#faf7f3] hover:border-stone-400'
                  : 'bg-[#25252b] border-[#3d3d45] hover:border-stone-500'
              }`}
              style={{ transform: `rotate(${angle})` }}
            >
              {/* Pushpin at the top center */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20">
                <div className={`w-2.5 h-2.5 rounded-full shadow-md flex items-center justify-center ${isPinned ? 'bg-red-600 animate-bounce' : 'bg-stone-500'}`}>
                  <div className="w-1 h-1 bg-white/60 rounded-full" />
                </div>
                <div className="w-0.5 h-2 bg-stone-500/70 mx-auto -mt-0.5" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between mb-2 mt-1">
                <div className={`p-1.5 rounded-sm ${isPinned ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-[#0c0c0e] text-[#6b6b76] border border-[#2d2d33]'}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                
                <span className={`text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded uppercase ${
                  evidence.importance === 'high' 
                    ? 'bg-red-950/60 text-red-400 border border-red-900/40' 
                    : 'bg-[#0c0c0e] text-stone-500 border border-[#2d2d33]'
                }`}>
                  {evidence.importance}_node
                </span>
              </div>

              {/* Title */}
              <h3 className={`font-mono font-bold text-xs tracking-tight mb-1 ${isWarmMode ? 'text-stone-900' : 'text-stone-100'}`}>
                {evidence.title}
              </h3>

              {/* Description */}
              <p className={`text-[11px] leading-tight line-clamp-4 ${isWarmMode ? 'text-stone-700' : 'text-[#a1a1aa]'}`}>
                {evidence.description}
              </p>

              {/* Pin/Unpin micro button overlay */}
              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[9px] font-mono text-stone-500 group-hover:text-stone-300 transition-colors ${
                isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
              }`}>
                <span>LOG_{evidence.type.toUpperCase()}</span>
                <span className={`flex items-center gap-1 font-semibold ${isPinned ? 'text-red-500' : 'text-stone-500'}`}>
                  {isPinned ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-red-500" />
                      <span>PINNED</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3 h-3 text-stone-600" />
                      <span>ATTACH_NODE</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
