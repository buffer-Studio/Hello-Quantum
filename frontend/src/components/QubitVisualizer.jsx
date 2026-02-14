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
                  isTarget ? 'text-chart-3' : 'text-chart-1'
                } font-semibold`}>
                  q{idx}
                </span>

                {/* Qubit Circle */}
                <div
                  onClick={() => onQubitSelect && onQubitSelect(idx)}
                  className={`relative w-24 h-24 rounded-full transition-all duration-300 border-2 ${
                    onQubitSelect ? 'cursor-pointer hover:border-foreground/50' : 'border-border'
                  } ${
                    isSelected ? 'ring-4 ring-primary ring-offset-2 scale-110' : ''
                  }`}
                  style={{
                    background: inSuperposition
                      ? `linear-gradient(135deg, hsl(var(--chart-1)), hsl(var(--chart-3)))`
                      : prob0 > 0.9
                      ? 'hsl(var(--chart-1))'
                      : 'hsl(var(--chart-3))',
                    opacity: 0.9
                  }}
                >
                  {/* State Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl drop-shadow-sm font-mono">
                      {prob0 > 0.95 ? '|0⟩' : prob1 > 0.95 ? '|1⟩' : '|ψ⟩'}
                    </span>
                  </div>
                </div>

                {/* Probability bars */}
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-mono">|0⟩</span>
                      <span className="text-muted-foreground font-mono">{(prob0 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-chart-1 transition-all duration-300"
                        style={{ width: `${prob0 * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-mono">|1⟩</span>
                      <span className="text-muted-foreground font-mono">{(prob1 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-chart-3 transition-all duration-300"
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
        <div className="mt-4 p-3 bg-secondary/50 rounded border border-chart-4/30">
          <p className="text-xs text-chart-4 font-semibold mb-1">Entangled Qubits:</p>
          {entanglementPairs.map(([i, j], idx) => (
            <p key={idx} className="text-xs text-muted-foreground font-mono">
              q{i} ⟷ q{j}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default QubitVisualizer;
