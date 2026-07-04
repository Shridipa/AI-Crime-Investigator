/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimelineEvent, Suspect } from '../types';
import { Calendar, AlertTriangle, AlertOctagon, HelpCircle, Eye, Info } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  suspects: Suspect[];
  isWarmMode: boolean;
  highlightedSuspectId: string | null;
  onHighlightSuspect: (id: string | null) => void;
}

export default function TimelineView({ timeline, suspects, isWarmMode, highlightedSuspectId, onHighlightSuspect }: TimelineViewProps) {
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);

  // Styling helper
  const textColor = isWarmMode ? 'text-stone-900' : 'text-[#d1d1d6]';
  const labelColor = isWarmMode ? 'text-stone-600' : 'text-[#6b6b76]';

  const getEventBadge = (importance: 'neutral' | 'suspicious' | 'critical') => {
    switch (importance) {
      case 'critical':
        return {
          bg: 'bg-red-950/40 text-red-500 border border-red-900/30',
          dot: 'bg-red-600',
          icon: AlertOctagon,
          label: 'CRITICAL_NODE',
        };
      case 'suspicious':
        return {
          bg: 'bg-amber-950/20 text-amber-500 border border-amber-800/20',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'SUSPICIOUS_SIGNAL',
        };
      default:
        return {
          bg: 'bg-[#0c0c0e] text-[#6b6b76] border border-[#2d2d33]',
          dot: 'bg-stone-600',
          icon: Info,
          label: 'CHRONO_LOG',
        };
    }
  };

  const activeEvent = timeline[activeEventIndex] || timeline[0];

  return (
    <div className={`rounded-xl p-4 sm:p-5 border transition-all ${isWarmMode ? 'bg-[#ebdcd0]/75 border-amber-800/20' : 'bg-[#15151a] border-[#2d2d33]'} backdrop-blur`}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-red-500" />
        <h2 className={`font-sans font-bold text-xs uppercase tracking-wider ${textColor}`}>Chronological Crime Scene Timeline</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT: Event Navigation Cards */}
        <div className="lg:col-span-5 space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {timeline.map((event, index) => {
            const badge = getEventBadge(event.importance);
            const isSelected = activeEventIndex === index;
            const eventSuspect = suspects.find((s) => s.id === event.suspectId);
            const isSuspectHighlighted = event.suspectId === highlightedSuspectId;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveEventIndex(index);
                  if (event.suspectId) {
                    onHighlightSuspect(event.suspectId);
                  } else {
                    onHighlightSuspect(null);
                  }
                }}
                className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                  isSelected
                    ? isWarmMode
                      ? 'bg-[#faf6f0] border-amber-800/60 shadow-sm'
                      : 'bg-[#25252b] border-red-600'
                    : isSuspectHighlighted
                    ? isWarmMode
                      ? 'bg-amber-100 border-amber-500'
                      : 'bg-[#1c1c24] border-stone-500'
                    : isWarmMode
                    ? 'bg-[#fcf8f2] hover:bg-[#faf4e9] border-stone-300/40'
                    : 'bg-[#0c0c0e] hover:bg-[#1c1c24] border-[#2d2d33]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[9px] font-mono border px-1.5 rounded ${
                    isWarmMode ? 'bg-[#f4ebe1] border-stone-300' : 'bg-[#0c0c0e] border-[#2d2d33] text-stone-300'
                  }`}>
                    {event.time}
                  </span>
                  
                  <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <p className={`text-[11px] font-mono leading-tight truncate ${
                  isWarmMode ? 'text-stone-800' : 'text-[#a1a1aa]'
                }`}>
                  {event.description}
                </p>

                {eventSuspect && (
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-[#6b6b76] font-mono">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    <span>CROSS_LINK: <strong className={`font-semibold ${isWarmMode ? 'text-stone-800' : 'text-stone-300'}`}>{eventSuspect.name}</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Selected Event Micro-Deduction Panel */}
        <div className="lg:col-span-7 h-full flex flex-col justify-between">
          {activeEvent ? (
            <div className={`p-3.5 rounded border flex flex-col h-full min-h-[180px] justify-between ${
              isWarmMode ? 'bg-[#faf6f0] border-amber-800/20' : 'bg-[#0c0c0e] border-[#2d2d33]'
            }`}>
              {/* Event Header */}
              <div>
                <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                  isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${
                      isWarmMode ? 'bg-[#f4ebe1] border-stone-300' : 'bg-[#1c1c24] border-[#2d2d33] text-stone-200'
                    }`}>
                      TIMESTAMP: {activeEvent.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getEventBadge(activeEvent.importance).dot}`} />
                    <span className="text-[9px] uppercase tracking-wider font-mono text-stone-500">
                      {activeEvent.importance} node
                    </span>
                  </div>
                </div>

                <p className={`text-xs font-mono leading-relaxed mb-3 ${textColor}`}>
                  {activeEvent.description}
                </p>
              </div>

              {/* Connected Suspect Profile Link */}
              {activeEvent.suspectId ? (
                (() => {
                  const suspect = suspects.find((s) => s.id === activeEvent.suspectId);
                  if (!suspect) return null;
                  return (
                    <div className={`border p-2 rounded flex items-center justify-between gap-3 ${
                      isWarmMode ? 'bg-[#ebdcd0]/40 border-stone-300' : 'bg-[#1c1c24] border-[#2d2d33]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg p-1 rounded border ${
                          isWarmMode ? 'bg-[#ebdcd0]/50 border-stone-300' : 'bg-[#0c0c0e] border-[#2d2d33]'
                        }`}>{suspect.avatarUrl}</span>
                        <div>
                          <h4 className={`text-xs font-bold ${isWarmMode ? 'text-stone-900' : 'text-stone-200'}`}>{suspect.name}</h4>
                          <p className="text-[9px] text-stone-500 font-mono">Linked Suspect ({suspect.role})</p>
                        </div>
                      </div>
                      
                      <div className="text-right font-mono text-[9px] text-[#6b6b76]">
                        <div>Alibi Weight: <strong className="text-red-500 font-semibold">{suspect.alibiStrength}%</strong></div>
                        <div>Motive Weight: <strong className="text-amber-500 font-semibold">{suspect.motiveScore}%</strong></div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className={`text-[10px] italic font-mono p-2 rounded text-center border ${
                  isWarmMode 
                    ? 'bg-amber-50/40 border-amber-200 text-stone-500' 
                    : 'bg-[#1c1c24]/40 border-[#2d2d33] text-[#6b6b76]'
                }`}>
                  No suspect vector cross-registered at this timestamp.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-xs text-stone-500 font-mono py-12">
              Select a chrono log item to load forensic tracking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
