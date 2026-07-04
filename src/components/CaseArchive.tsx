/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Case } from '../types';
import { FolderHeart, CheckCircle2, XCircle, Tag, Calendar, User, Eye } from 'lucide-react';

interface CaseArchiveProps {
  archive: Case[];
  isWarmMode: boolean;
  onViewCase: (c: Case) => void;
}

export default function CaseArchive({ archive, isWarmMode, onViewCase }: CaseArchiveProps) {
  const panelStyle = isWarmMode
    ? 'bg-[#ebdcd0]/70 border-amber-800/20'
    : 'bg-[#15151a] border-[#2d2d33]';

  const textColor = isWarmMode ? 'text-stone-900' : 'text-[#d1d1d6]';

  return (
    <div className={`rounded-xl p-4 sm:p-5 border ${panelStyle} backdrop-blur`}>
      <div className="flex items-center gap-2 mb-4">
        <FolderHeart className="w-4 h-4 text-red-500" />
        <h2 className={`font-sans font-bold text-xs uppercase tracking-wider ${textColor}`}>Solved Case Archives</h2>
      </div>

      {archive.length === 0 ? (
        <div className={`text-center py-10 border border-dashed rounded-xl ${
          isWarmMode ? 'border-stone-800/20 bg-[#f4ebe1]/30' : 'border-[#2d2d33] bg-[#0c0c0e]/20'
        }`}>
          <FolderHeart className="w-7 h-7 text-stone-650 mx-auto mb-2" />
          <p className="text-xs text-stone-550 font-mono">Archive Drawer is empty.</p>
          <p className="text-[10px] text-stone-600 font-mono mt-0.5">Solve active cases to register file entries here.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
          {archive.map((solvedCase) => {
            const guessedSuspect = solvedCase.suspects.find((s) => s.id === solvedCase.guessedSuspectId);
            const actualCulprit = solvedCase.suspects.find((s) => s.guilty);
            const isGuessedRight = guessedSuspect?.id === actualCulprit?.id;

            return (
              <div
                key={solvedCase.id}
                className={`border p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isWarmMode ? 'bg-[#f4ebe1]/80 border-stone-300' : 'bg-[#0c0c0e] border-[#2d2d33]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap font-mono">
                    <h3 className={`font-bold text-sm ${isWarmMode ? 'text-stone-900' : 'text-stone-200'}`}>{solvedCase.title}</h3>
                    <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded border ${
                      solvedCase.difficulty === 'hard'
                        ? 'bg-red-950/40 text-red-400 border-red-900/30'
                        : solvedCase.difficulty === 'medium'
                        ? 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30'
                    }`}>
                      {solvedCase.difficulty}
                    </span>
                  </div>

                  {/* Victim and completed date */}
                  <p className="text-stone-500 font-mono text-[10px]">
                    Victim: <span className="text-stone-400">{solvedCase.victim}</span>
                  </p>
                  
                  {/* Solved state */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-stone-500 font-mono text-[10px] flex items-center gap-1">
                      VERDICT:
                    </span>
                    {isGuessedRight ? (
                      <span className="flex items-center gap-1 text-emerald-500 font-bold text-[9px] bg-emerald-950/10 border border-emerald-900/30 px-1.5 py-0.5 rounded font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>SUCCESS &bull; +100 XP</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 font-bold text-[9px] bg-red-950/10 border border-red-900/30 px-1.5 py-0.5 rounded font-mono">
                        <XCircle className="w-3 h-3 text-red-550" />
                        <span>FAILED &bull; +25 XP</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between gap-1.5 border-t sm:border-t-0 border-stone-800/10 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right font-mono text-[9px] text-[#6b6b76]">
                    <div>Guessed: <strong className={isGuessedRight ? 'text-emerald-500' : 'text-red-500'}>{guessedSuspect?.name}</strong></div>
                    <div>Actual Culprit: <strong className="text-stone-400">{actualCulprit?.name}</strong></div>
                  </div>

                  <button
                    id={`view-archive-${solvedCase.id}`}
                    onClick={() => onViewCase(solvedCase)}
                    className={`flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded w-full sm:w-auto justify-center transition-colors cursor-pointer border ${
                      isWarmMode
                        ? 'bg-[#ebdcd0] border-stone-300 text-stone-700 hover:bg-stone-200'
                        : 'bg-[#1c1c24] border-[#2d2d33] text-[#d1d1d6] hover:bg-[#25252b] hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>REVIEW_RECORDS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
