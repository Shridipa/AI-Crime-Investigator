/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserStats } from '../types';
import { Shield, Sparkles, Award, HelpCircle, Moon, Sun, Flame } from 'lucide-react';

interface DeskHeaderProps {
  stats: UserStats;
  isWarmMode: boolean;
  setIsWarmMode: (mode: boolean) => void;
  geminiStatus: { available: boolean; message: string } | null;
  onBackToMenu?: () => void;
}

export default function DeskHeader({ stats, isWarmMode, setIsWarmMode, geminiStatus, onBackToMenu }: DeskHeaderProps) {
  const accuracy = stats.totalPlayed > 0 
    ? Math.round((stats.totalSolved / stats.totalPlayed) * 100) 
    : 100;

  return (
    <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${
      isWarmMode
        ? 'border-amber-800/20 bg-[#ebdcd0] text-stone-900 shadow-sm'
        : 'border-[#2d2d33] bg-[#15151a] text-[#d1d1d6]'
    } px-4 py-2 sm:px-6`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="mr-2 px-2.5 py-1 text-[10px] font-mono uppercase bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors cursor-pointer"
              title="Return to Bureau Main Menu"
            >
              &larr; Bureau Menu
            </button>
          )}
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-red-900/30 border border-red-600">
            <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-sans font-extrabold text-sm tracking-wider uppercase ${
                isWarmMode ? 'text-stone-950' : 'text-red-500 font-mono'
              }`}>
                AI Crime Scene Investigator
              </h1>
              <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border font-mono ${
                isWarmMode 
                  ? 'bg-amber-900/10 text-amber-950 border-amber-800/30' 
                  : 'bg-red-950/40 text-red-400 border-red-900/40'
              }`}>
                LIVE_ML_ACTIVE
              </span>
            </div>
            <p className={`text-[10px] font-mono uppercase tracking-tight ${
              isWarmMode ? 'text-stone-600' : 'text-[#6b6b76]'
            }`}>
              Bayesian Classifier &bull; Case Terminal #772-OMEGA
            </p>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-auto md:ml-0">
          {/* Gemini AI Status Badge */}
          {geminiStatus && (
            <div className={`hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${
              geminiStatus.available 
                ? isWarmMode
                  ? 'bg-emerald-950/10 text-emerald-800 border-emerald-800/30'
                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                : isWarmMode
                  ? 'bg-amber-950/10 text-amber-800 border-amber-800/30'
                  : 'bg-amber-950/40 text-amber-400 border-[#2d2d33]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${geminiStatus.available ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{geminiStatus.available ? 'Gemini AI Online' : 'Local Bayesian Engine'}</span>
            </div>
          )}

          {/* User Score Badge */}
          <div className={`flex items-center gap-3 border px-2.5 py-1 rounded font-mono text-[11px] ${
            isWarmMode
              ? 'bg-[#f4ebe1]/80 border-amber-800/20 text-stone-700'
              : 'bg-[#1c1c24] border-[#2d2d33] text-[#d1d1d6]'
          }`}>
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>XP:</span>
              <span className="text-amber-500 font-bold">{stats.xp}</span>
            </div>
            
            <div className={`h-3 w-px ${isWarmMode ? 'bg-stone-300' : 'bg-[#2d2d33]'}`} />

            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Cases:</span>
              <span className="font-bold text-red-500">{stats.totalSolved}/{stats.totalPlayed}</span>
              <span className="text-[9px] opacity-60">({accuracy}%)</span>
            </div>

            <div className={`hidden sm:block h-3 w-px ${isWarmMode ? 'bg-stone-300' : 'bg-[#2d2d33]'}`} />

            <div className="hidden sm:flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="opacity-70">Rank:</span>
              <span className="text-blue-400 text-[10px] font-bold uppercase">{stats.rank}</span>
            </div>
          </div>

          {/* Theme / Lamp Switcher */}
          <button
            id="theme-lamp-toggle"
            onClick={() => setIsWarmMode(!isWarmMode)}
            className={`px-2.5 py-1 rounded border text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isWarmMode
                ? 'bg-amber-950/20 text-amber-900 border-amber-800/40 hover:bg-amber-950/30'
                : 'bg-[#1c1c24] text-[#a1a1aa] border-[#2d2d33] hover:border-stone-500 hover:text-white'
            }`}
            title="Toggle between Desk Lamp (Warm paper) and Lab Mode (Digital Terminal)"
          >
            {isWarmMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="hidden sm:inline">DESK_LAMP_ON</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">LAB_TERMINAL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
