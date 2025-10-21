import React from 'react';
import { Card } from './ui/card';

const QubitVisualizer = ({ state, numQubits, selectedQubit, onQubitSelect, isTarget = false }) => {
  // Calculate individual qubit states from the full state vector
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
    // Simple heuristic: if the state can't be factorized, qubits are entangled
    // For display, we'll show connections between qubits with significant correlation

    for (let i = 0; i < numQubits - 1; i++) {
      const { prob0: p0_i, prob1: p1_i } = getQubitProbabilities(i);
      const { prob0: p0_j, prob1: p1_j } = getQubitProbabilities(i + 1);

      // If both qubits are in superposition, they might be entangled
      if (p0_i > 0.1 && p0_i < 0.9 && p0_j > 0.1 && p0_j < 0.9) {
        entangled.push([i, i + 1]);
      }
    }

    return entangled;
  };

  const entanglementPairs = checkEntanglement();

  return (
    <div className="relative">
      {/* Qubits */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: numQubits }).map((_, idx) => {
          const { prob0, prob1 } = getQubitProbabilities(idx);
          const isSelected = selectedQubit === idx;
          const inSuperposition = prob0 > 0.05 && prob1 > 0.05;

          return (
            <div key={idx} className="relative">
              {/* Qubit Label */}
              <div className="flex items-center gap-4">
                <span className={`text-sm font-mono ${
                  isTarget ? 'text-purple-400' : 'text-cyan-400'
                } font-semibold`}>
                  q{idx}
                </span>

                {/* Qubit Circle */}
                <div
                  onClick={() => onQubitSelect && onQubitSelect(idx)}
                  className={`relative w-24 h-24 rounded-full transition-all duration-300 ${
                    onQubitSelect ? 'cursor-pointer' : ''
                  } ${
                    isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                  }`}
                  style={{
                    background: inSuperposition
                      ? `linear-gradient(135deg,
                          rgba(0, 212, 255, ${prob0}) 0%,
                          rgba(139, 92, 246, ${prob1}) 100%)`
                      : prob0 > 0.9
                      ? 'radial-gradient(circle, rgba(0, 212, 255, 0.8), rgba(0, 150, 255, 0.3))'
                      : 'radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(120, 70, 220, 0.3))',
                    boxShadow: inSuperposition
                      ? '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(0, 212, 255, 0.3)'
                      : prob0 > 0.9
                      ? '0 0 30px rgba(0, 212, 255, 0.8)'
                      : '0 0 30px rgba(139, 92, 246, 0.8)',
                  }}
                >
                  {/* State Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl drop-shadow-lg">
                      {prob0 > 0.95 ? '|0⟩' : prob1 > 0.95 ? '|1⟩' : '|ψ⟩'}
                    </span>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full animate-pulse opacity-50"
                    style={{
                      background: 'radial-gradient(circle, transparent 60%, currentColor)',
                      color: inSuperposition ? '#8B5CF6' : prob0 > 0.9 ? '#00D4FF' : '#8B5CF6'
                    }}
                  />
                </div>

                {/* Probability bars */}
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyan-300">|0⟩</span>
                      <span className="text-cyan-300">{(prob0 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${prob0 * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-purple-300">|1⟩</span>
                      <span className="text-purple-300">{(prob1 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
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

      {/* Entanglement visualization */}
      {entanglementPairs.length > 0 && (
        <div className="mt-4 p-3 bg-purple-900/30 rounded border border-purple-500/30">
          <p className="text-xs text-purple-300 font-semibold mb-1">Entangled Qubits:</p>
          {entanglementPairs.map(([i, j], idx) => (
            <p key={idx} className="text-xs text-purple-400">
              q{i} ⟷ q{j}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default QubitVisualizer;
