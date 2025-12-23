import React from 'react';

const QubitVisualizer = ({ state, numQubits, selectedQubit, onQubitSelect, isTarget = false }) => {
  // Calculate individual qubit states
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

  // Check if qubits are entangled
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
    <div className="relative">
      <div className="flex flex-col gap-6">
        {Array.from({ length: numQubits }).map((_, idx) => {
          const { prob0, prob1 } = getQubitProbabilities(idx);
          const isSelected = selectedQubit === idx;
          const inSuperposition = prob0 > 0.05 && prob1 > 0.05;

          return (
            <div key={idx} className="relative group">

              {/* Connection Line (Entanglement Visual) */}
              {idx < numQubits - 1 && entanglementPairs.some(p => p[0] === idx && p[1] === idx + 1) && (
                  <div className="absolute left-10 top-20 bottom-0 w-0.5 h-12 bg-gradient-to-b from-purple-500 to-transparent z-0 opacity-50 animate-pulse" />
              )}

              <div className="flex items-center gap-6">
                {/* Qubit Label */}
                <div className="flex flex-col items-center gap-1 w-8">
                    <span className={`text-xs font-mono font-bold uppercase ${
                    isTarget ? 'text-accent' : 'text-primary'
                    }`}>
                    Q{idx}
                    </span>
                    <div className={`w-px h-12 bg-gradient-to-b ${
                        isTarget ? 'from-accent/50' : 'from-primary/50'
                    } to-transparent`} />
                </div>

                {/* Main Qubit Orb */}
                <div
                  onClick={() => onQubitSelect && onQubitSelect(idx)}
                  className={`relative w-20 h-20 rounded-full transition-all duration-300 z-10 ${
                    onQubitSelect ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                >
                  {/* Outer Ring */}
                  <div className={`absolute inset-0 rounded-full border-2 ${
                      isSelected ? 'border-accent shadow-[0_0_20px_rgba(252,238,10,0.5)]' : 'border-white/10'
                  } transition-all duration-300`} />

                  {/* Inner Rotating Ring */}
                  {inSuperposition && (
                    <div className="absolute inset-1 rounded-full border border-purple-500/50 border-t-transparent animate-spin-slow" />
                  )}

                  {/* Core Visual */}
                  <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center bg-black">
                     {/* Background Gradient based on state */}
                     <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at center,
                                ${prob0 > 0.9 ? 'rgba(6,182,212,0.8)' : prob1 > 0.9 ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.1)'} 0%,
                                transparent 70%)`
                        }}
                     />

                     {/* Superposition Dual-Color Fog */}
                     {inSuperposition && (
                         <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 blur-md" />
                     )}

                     {/* Text State */}
                     <span className="relative z-20 font-mono font-bold text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {prob0 > 0.95 ? '|0⟩' : prob1 > 0.95 ? '|1⟩' : '|ψ⟩'}
                     </span>
                  </div>
                </div>

                {/* Data readout bars */}
                <div className="flex-1 space-y-3 font-mono">
                  {/* |0> Bar */}
                  <div className="group/bar">
                    <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider">
                      <span className="text-cyan-400">State |0⟩</span>
                      <span className="text-cyan-400">{(prob0 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-900 rounded-sm overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300"
                        style={{ width: `${prob0 * 100}%` }}
                      />
                    </div>
                  </div>

                   {/* |1> Bar */}
                   <div className="group/bar">
                    <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider">
                      <span className="text-purple-400">State |1⟩</span>
                      <span className="text-purple-400">{(prob1 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-900 rounded-sm overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300"
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
        <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 mb-2">
                <GitBranch className="h-3 w-3 text-purple-400" />
                <span className="text-[10px] uppercase font-mono text-purple-400 font-bold tracking-widest">
                    Quantum Entanglement Detected
                </span>
            </div>
          <div className="flex flex-wrap gap-2">
            {entanglementPairs.map(([i, j], idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-[10px] font-mono text-purple-300">
                LINK: Q{i} ↔ Q{j}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QubitVisualizer;
