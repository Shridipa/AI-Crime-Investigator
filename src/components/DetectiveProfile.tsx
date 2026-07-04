/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldAlert, Star, Compass, Clock, CheckCircle2, User, ChevronLeft } from 'lucide-react';

interface DetectiveProfileProps {
  stats: { totalPlayed: number; totalSolved: number; xp: number; rank: string };
  onBackToMenu: () => void;
  archiveCount: number;
}

export default function DetectiveProfile({ stats, onBackToMenu, archiveCount }: DetectiveProfileProps) {
  // Badges list
  const badges = [
    {
      id: 'badge-01',
      title: 'First Footprint',
      description: 'Discovered and linked your very first physical evidence node.',
      unlocked: stats.totalPlayed > 0,
      icon: '👣',
      color: 'border-amber-500 text-[#FFD166]'
    },
    {
      id: 'badge-02',
      title: 'Deductive Genius',
      description: 'Accused the true culprit correctly based on Bayesian likelihood.',
      unlocked: stats.totalSolved > 0,
      icon: '🧠',
      color: 'border-emerald-500 text-emerald-400'
    },
    {
      id: 'badge-03',
      title: 'Cyber Investigator',
      description: 'Utilized standard Gemini AI explanations to parse a suspect alibi.',
      unlocked: stats.xp >= 200,
      icon: '👁️‍🗨️',
      color: 'border-blue-500 text-blue-400'
    },
    {
      id: 'badge-04',
      title: 'Gold Star Solver',
      description: 'Successfully cracked 3 or more cases in the active dossier registry.',
      unlocked: stats.totalSolved >= 3,
      icon: '⭐',
      color: 'border-yellow-500 text-yellow-400'
    }
  ];

  // XP level calculations
  const nextLevelXp = 500;
  const levelProgress = Math.min(100, Math.round((stats.xp / nextLevelXp) * 100));

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

        {/* PROFILE BANNER */}
        <div className="bg-[#121826] border border-[#2d2d33] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-red-900/20">
              🕵️‍♂️
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] font-mono text-[#FFD166] uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                OFFICIAL DEPUTY DOSSIER
              </span>
              <h2 className="text-2xl font-black text-white leading-none">Det. {stats.rank === 'Junior Sleuth' ? 'Rookie Sleuth' : stats.rank}</h2>
              <p className="text-[11px] text-[#94A3B8] font-mono">BUREAU IDENTIFIER: #US-DET-994</p>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-400">XP PROGRESS</span>
              <span className="text-[#FFD166]">{stats.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-[#0B0F19] h-2.5 rounded-full overflow-hidden border border-[#2d2d33]">
              <div className="bg-gradient-to-r from-red-500 to-amber-400 h-full transition-all duration-500" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="text-[9px] text-stone-500 text-right font-mono uppercase">
              {100 - levelProgress}% TO LEVEL UP
            </p>
          </div>
        </div>

        {/* DETECTIVE LIFETIME STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 text-center space-y-2">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-[#FF4D4D] rounded-full flex items-center justify-center mx-auto">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Cases Processed</span>
            <strong className="text-2xl font-black text-white font-mono block">
              {stats.totalPlayed}
            </strong>
          </div>

          <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Successful Arrests</span>
            <strong className="text-2xl font-black text-white font-mono block">
              {stats.totalSolved}
            </strong>
          </div>

          <div className="bg-[#121826]/40 border border-[#2d2d33] rounded-xl p-5 text-center space-y-2">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Solved Case Archives</span>
            <strong className="text-2xl font-black text-white font-mono block">
              {archiveCount}
            </strong>
          </div>

        </div>

        {/* BADGES & ACHIEVEMENTS CABINET */}
        <div className="bg-[#121826] border border-[#2d2d33] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2d2d33] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFD166]" />
              <span>Deductive Achievement Badges</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Unlock prestigious bureau decorations by successfully conducting analytical work and finding real patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`border p-4.5 rounded-xl flex gap-4 items-start transition-all ${
                  badge.unlocked 
                    ? 'bg-[#0B0F19] border-[#2d2d33]' 
                    : 'bg-stone-950/20 border-stone-900/60 opacity-55'
                }`}
              >
                <div className={`w-12 h-12 shrink-0 rounded-lg border flex items-center justify-center text-2xl ${
                  badge.unlocked ? badge.color + ' bg-black/40' : 'border-stone-800 text-stone-600 bg-stone-900/20'
                }`}>
                  {badge.unlocked ? badge.icon : '🔒'}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-white' : 'text-stone-500'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-normal font-mono">
                    {badge.description}
                  </p>
                  <div className="pt-1.5 flex items-center">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.25 rounded ${
                      badge.unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-stone-900 text-stone-600'
                    }`}>
                      {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
