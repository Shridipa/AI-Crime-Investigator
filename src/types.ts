/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Suspect {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  motive: string;
  motiveScore: number; // 0-100
  opportunity: string;
  opportunityScore: number; // 0-100
  witnessStatement: string;
  witnessReliability: number; // 0-100
  alibi: string;
  alibiStrength: number; // 0-100
  fingerprintMatch: boolean;
  guilty: boolean;
}

export interface Evidence {
  id: string;
  title: string;
  type: 'footprint' | 'weather' | 'location' | 'witness' | 'timeline' | 'forensic';
  description: string;
  icon: string;
  importance: 'low' | 'medium' | 'high';
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  suspectId: string | null;
  importance: 'neutral' | 'suspicious' | 'critical';
}

export interface Case {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  location: string;
  weather: string;
  victim: string;
  timeOfCrime: string;
  suspects: Suspect[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  solved: boolean;
  guessedSuspectId: string | null;
  solvedAt?: string;
}

export interface BayesianFactor {
  motiveFactor: number;
  opportunityFactor: number;
  alibiFactor: number;
  witnessFactor: number;
  evidenceWeight: number;
}

export interface PredictionResult {
  suspectId: string;
  suspectName: string;
  probability: number; // 0-100
  bayesianCalculation: BayesianFactor;
  reasoning: string;
}

export interface AnalysisResponse {
  rankings: PredictionResult[];
  reasoningChain: string;
  cluesSummary: string;
}

export interface UserStats {
  totalPlayed: number;
  totalSolved: number;
  xp: number;
  rank: string;
}
