import React from 'react';
import { GitBranch } from 'lucide-react';

const QubitVisualizer = ({ state, numQubits, selectedQubit, onQubitSelect, isTarget = false }) => {
  const getQubitProbabilities = (qubitIndex) => {
    const dim = Math.pow(2, numQubits);
    let prob0 = 0;
    let prob1 = 0;

    for (let i = 0; i < dim; i++) {
      const bit = (i >> (numQubits - 1 - qubitIndex)) & 1;
      const amplitude = state[i] ? state[i].magnitude() : 0;
      const prob = amplitude * amplitude;

      if (bit === 0) {
        prob0 += prob;
      } else {
        prob1 += prob;
      }
    }
    return { prob0, prob1 };
  };

  const checkEntanglement = () => {
    if (numQubits < 2) return [];
    const entangled = [];
    for (let i = 0; i < numQubits - 1; i++) {
      const { prob0: p0_i } = getQubitProbabilities(i);
      const { prob0: p0_j } = getQubitProbabilities(i + 1);
      if (p0_i > 0.1 && p0_i < 0.9 && p0_j > 0.1 && p0_j < 0.9) {
        entangled.push([i, i + 1]);
      }
    }
    return entangled;
  };

  const entanglementPairs = checkEntanglement();

  return (
    <div className="relative py-2">
      <div className="flex flex-col gap-6">
        {Array.from({ length: numQubits }).map((_, idx) => {
          const { prob0, prob1 } = getQubitProbabilities(idx);
          const isSelected = selectedQubit === idx;
          const inSuperposition = prob0 > 0.05 && prob1 > 0.05;

          return (
            <div key={idx} className="relative group">

              {/* Entanglement Line */}
              {idx < numQubits - 1 && entanglementPairs.some(p => p[0] === idx && p[1] === idx + 1) && (
                  <div className="absolute left-[3.25rem] top-16 bottom-[-1.5rem] w-1 bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-purple-500/50 z-0 animate-pulse rounded-full blur-[1px]" />
              )}

              <div className="flex items-center gap-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors duration-300">

                {/* Qubit Orb */}
                <div
                  onClick={() => onQubitSelect && onQubitSelect(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 transition-all duration-300 z-10 ${
                    onQubitSelect ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                >
                    {/* Glow Container */}
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-colors duration-500 ${
                         inSuperposition ? 'bg-purple-500' : prob0 > 0.9 ? 'bg-cyan-500' : 'bg-pink-500'
                    }`} />

                  {/* Main Orb */}
                  <div className={`relative w-full h-full rounded-full border-2 overflow-hidden backdrop-blur-md flex items-center justify-center shadow-inner transition-all duration-300 ${
                       isSelected ? 'border-accent ring-2 ring-accent/30 scale-105' : 'border-white/20'
                  }`}
                  style={{
                      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)`
                  }}
                  >
                     {/* Dynamic Fluid Background */}
                     <div
                        className="absolute inset-0 transition-all duration-700 opacity-80 mix-blend-screen"
                        style={{
                            background: inSuperposition
                                ? 'conic-gradient(from 0deg, #06b6d4, #d946ef, #06b6d4)'
                                : prob0 > 0.9
                                    ? 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
                                    : 'radial-gradient(circle, #d946ef 0%, transparent 70%)'
                        }}
                     />

                     {inSuperposition && <div className="absolute inset-0 animate-spin-slow opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />}

                     {/* Text State */}
                     <span className="relative z-20 font-display font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {prob0 > 0.95 ? '|0⟩' : prob1 > 0.95 ? '|1⟩' : '|ψ⟩'}
                     </span>
                  </div>

                  {/* Label Pill */}
                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded-full border border-white/10 backdrop-blur text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest z-20">
                        q{idx}
                   </div>
                </div>

                {/* Data Bars */}
                <div className="flex-1 space-y-3 min-w-[120px]">
                  {/* |0> Bar */}
                  <div className="group/bar">
                    <div className="flex justify-between text-[10px] mb-1.5 uppercase tracking-wider font-bold">
                      <span className="text-cyan-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></span>
                        State |0⟩
                      </span>
                      <span className="text-white font-mono">{(prob0 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-500 ease-out"
                        style={{ width: `${prob0 * 100}%` }}
                      />
                    </div>
                  </div>

                   {/* |1> Bar */}
                   <div className="group/bar">
                    <div className="flex justify-between text-[10px] mb-1.5 uppercase tracking-wider font-bold">
                      <span className="text-pink-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_5px_rgba(232,121,249,0.5)]"></span>
                        State |1⟩
                      </span>
                      <span className="text-white font-mono">{(prob1 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-600 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all duration-500 ease-out"
                        style={{ width: `${prob1 * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Entanglement Status Indicator */}
      {entanglementPairs.length > 0 && (
        <div className="mt-4 animate-in slide-in-from-bottom-2 fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
                <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wide">
                    Entanglement Active
                </span>
                <div className="flex gap-1 ml-2">
                     {entanglementPairs.map(([i, j], idx) => (
                        <span key={idx} className="text-[10px] font-mono text-purple-200 bg-purple-500/20 px-1.5 rounded">
                            {i}↔{j}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default QubitVisualizer;
