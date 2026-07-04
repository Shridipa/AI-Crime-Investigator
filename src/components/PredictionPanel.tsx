/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { PredictionResult, Suspect } from '../types';
import { Calculator, HelpCircle } from 'lucide-react';
import * as d3 from 'd3';

interface PredictionPanelProps {
  rankings: PredictionResult[];
  suspects: Suspect[];
  isWarmMode: boolean;
  predictionHistory: Array<{ label: string; [suspectId: string]: any }>;
}

// Subcomponent: D3.js Line Chart
function BayesianLineChart({ history, suspects, isWarmMode }: { history: any[]; suspects: Suspect[]; isWarmMode: boolean }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || history.length === 0) return;

    // Dimensions
    const width = 480;
    const height = 180;
    const margin = { top: 15, right: 120, bottom: 25, left: 35 };

    // Select and clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('width', '100%')
       .attr('height', '100%');

    // Scales
    const x = d3.scaleLinear()
      .domain([0, history.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Horizontal grid lines
    const yGrid = d3.axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => '')
      .ticks(5);

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yGrid)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke', isWarmMode ? 'rgba(120,113,108,0.15)' : 'rgba(255,255,255,0.06)')
        .attr('stroke-dasharray', '2,2')
      );

    // Axes
    const xAxis = d3.axisBottom(x)
      .ticks(Math.min(6, history.length))
      .tickFormat((d) => {
        const idx = d.valueOf();
        if (history[idx]) {
          const lbl = history[idx].label;
          return lbl.length > 11 ? lbl.slice(0, 11) + '..' : lbl;
        }
        return '';
      });

    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    // Draw X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .call(g => g.select('.domain').attr('stroke', isWarmMode ? 'rgba(120,113,108,0.2)' : '#2d2d33'))
      .call(g => g.selectAll('.tick text')
        .attr('fill', isWarmMode ? '#44403c' : '#8e8e93')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
      );

    // Draw Y Axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', isWarmMode ? '#44403c' : '#8e8e93')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
      );

    // Dynamic color palettes for line tracking
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

    suspects.forEach((suspect, index) => {
      const color = colors[index % colors.length];

      // Format line data series
      const series = history.map((h, stepIndex) => ({
        step: stepIndex,
        probability: h[suspect.id] ?? (100 / suspects.length),
      }));

      // Line drawer
      const lineGenerator = d3.line<{ step: number; probability: number }>()
        .x(d => x(d.step))
        .y(d => y(d.probability))
        .curve(d3.curveMonotoneX);

      // Append curve path
      svg.append('path')
        .datum(series)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      // Append dot points
      svg.selectAll(`.dot-${suspect.id}`)
        .data(series)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.step))
        .attr('cy', d => y(d.probability))
        .attr('r', 3)
        .attr('fill', color)
        .attr('stroke', isWarmMode ? '#faf7f3' : '#0a0a0c')
        .attr('stroke-width', 1);

      // Label at the end of the trajectory line
      if (series.length > 0) {
        const last = series[series.length - 1];
        svg.append('text')
          .attr('x', x(last.step) + 6)
          .attr('y', y(last.probability) + 3)
          .attr('fill', color)
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(`${suspect.avatarUrl} ${suspect.name.split(' ')[0]} (${Math.round(last.probability)}%)`);
      }
    });

  }, [history, suspects, isWarmMode]);

  return (
    <div className={`border p-2 rounded-lg ${
      isWarmMode ? 'bg-[#faf7f3] border-amber-900/10' : 'bg-[#0a0a0c] border-[#2d2d33]'
    }`}>
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[8px] font-mono uppercase tracking-wider text-[#6b6b76]">Bayesian Inference Trajectory</span>
        <span className="text-[7px] font-mono text-stone-500">REALTIME_POSTERIOR_TRACING</span>
      </div>
      <svg ref={svgRef} className="w-full h-auto overflow-visible" />
    </div>
  );
}

export default function PredictionPanel({ rankings, suspects, isWarmMode, predictionHistory }: PredictionPanelProps) {
  // Sort rankings by descending probability
  const sortedRankings = [...rankings].sort((a, b) => b.probability - a.probability);

  const cardStyle = isWarmMode
    ? 'bg-[#eddcd0]/60 border-amber-800/20'
    : 'bg-[#15151a] border-[#2d2d33]';

  const textColor = isWarmMode ? 'text-stone-900' : 'text-[#d1d1d6]';

  return (
    <div className={`rounded-xl p-4 sm:p-5 border ${cardStyle} backdrop-blur space-y-4`}>
      {/* Panel Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
      }`}>
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-red-500" />
          <h2 className={`font-sans font-bold text-xs uppercase tracking-wider ${textColor}`}>Bayesian Probability Classifier</h2>
        </div>
        <div className={`flex items-center gap-1 border text-[9px] font-mono px-2 py-0.5 rounded ${
          isWarmMode 
            ? 'bg-amber-950/10 text-amber-900 border-amber-800/30' 
            : 'bg-red-950/40 text-red-500 border-red-900/40'
        }`}>
          <span>STABLE_POSTERIORS</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[10px] text-stone-500 leading-relaxed font-mono">
        Posterior Probability P(S_i | E) calculated by normalizing prior weights across Motive, Opportunity, and Alibi features.
      </p>

      {/* D3.js Line Chart Section */}
      {predictionHistory && predictionHistory.length > 0 && (
        <BayesianLineChart
          history={predictionHistory}
          suspects={suspects}
          isWarmMode={isWarmMode}
        />
      )}

      {/* Probability Bars */}
      <div className="space-y-3">
        {sortedRankings.map((rank, index) => {
          const suspect = suspects.find((s) => s.id === rank.suspectId);
          if (!suspect) return null;

          // Compute color scheme based on ranking index
          const colors = index === 0
            ? { text: 'text-red-500', bar: 'bg-red-600', bg: 'bg-[#25252b]/50 border-red-900/30' }
            : index === 1
            ? { text: 'text-amber-500', bar: 'bg-amber-500', bg: 'bg-[#1c1c24]' }
            : { text: 'text-[#6b6b76]', bar: 'bg-[#2d2d33]', bg: 'bg-[#1c1c24]' };

          return (
            <div 
              key={rank.suspectId} 
              className={`p-3 border rounded ${
                isWarmMode 
                  ? 'bg-[#f4ebe1]/80 border-stone-400/20' 
                  : `${colors.bg} border-[#2d2d33]`
              }`}
            >
              {/* Suspect Row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xl p-1 rounded border ${
                    isWarmMode ? 'bg-[#ebdcd0]/40 border-stone-300' : 'bg-[#0c0c0e] border-[#2d2d33]'
                  }`}>
                    {suspect.avatarUrl}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className={`text-xs font-bold ${isWarmMode ? 'text-stone-900' : 'text-stone-200'}`}>{suspect.name}</h3>
                      <span className={`text-[8px] uppercase tracking-wider border px-1 rounded font-mono ${
                        isWarmMode 
                          ? 'bg-amber-100 border-amber-300 text-amber-800' 
                          : 'bg-[#0c0c0e] border-[#2d2d33] text-[#6b6b76]'
                      }`}>
                        PRED_#{index + 1}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {suspect.role} &bull; Alibi Str: {suspect.alibiStrength}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold font-mono ${colors.text}`}>
                    {rank.probability}%
                  </span>
                  <p className="text-[9px] text-stone-500 font-mono uppercase">posterior</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden border relative ${
                isWarmMode ? 'bg-stone-200 border-stone-300' : 'bg-[#0c0c0e] border-[#2d2d33]'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${colors.bar}`}
                  style={{ width: `${rank.probability}%` }}
                />
              </div>

              {/* Hidden Bayesian multiplier breakdown */}
              <div className={`flex flex-wrap gap-x-3 gap-y-1 mt-2.5 pt-2 border-t text-[9px] font-mono text-stone-500 ${
                isWarmMode ? 'border-stone-800/10' : 'border-[#2d2d33]'
              }`}>
                <div className="flex items-center gap-1">
                  <span className="text-stone-600">Prior Motive:</span>
                  <span className={`font-medium ${isWarmMode ? 'text-stone-700' : 'text-stone-400'}`}>{rank.bayesianCalculation.motiveFactor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-stone-600">Opportunity:</span>
                  <span className={`font-medium ${isWarmMode ? 'text-stone-700' : 'text-stone-400'}`}>{rank.bayesianCalculation.opportunityFactor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-stone-600">Alibi Leak:</span>
                  <span className={`font-medium ${isWarmMode ? 'text-stone-700' : 'text-stone-400'}`}>{rank.bayesianCalculation.alibiFactor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-stone-600">Witness:</span>
                  <span className={`font-medium ${isWarmMode ? 'text-stone-700' : 'text-stone-400'}`}>{rank.bayesianCalculation.witnessFactor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-stone-600">Bio Weight:</span>
                  <span className={`font-medium ${isWarmMode ? 'text-stone-700' : 'text-stone-400'}`}>x{rank.bayesianCalculation.evidenceWeight}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
