import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
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

  const qubitData = useMemo(() => {
    return Array.from({ length: numQubits }).map((_, idx) => getQubitProbabilities(idx));
  }, [state, numQubits]);

  // Check if qubits are entangled
  const checkEntanglement = () => {
    if (numQubits < 2) return [];

    const entangled = [];
    for (let i = 0; i < numQubits - 1; i++) {
      const { prob0: p0_i, prob1: p1_i } = qubitData[i];
      const { prob0: p0_j, prob1: p1_j } = qubitData[i + 1];

      // Heuristic for entanglement: if both are in superposition, show a potential bond
      // In a real simulator, we'd check if the density matrix is separable.
      if (p0_i > 0.05 && p0_i < 0.95 && p0_j > 0.05 && p0_j < 0.95) {
        entangled.push([i, i+1]);
      }
    }

    return entangled;
  };

  const entanglementPairs = checkEntanglement();

  return (
    <div className="relative w-full">
      {/* SVG Container for Entanglement Beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: numQubits * 120 }}>
        <defs>
          <filter id="quantum-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>

          <linearGradient id="entangle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--q-entangle)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--q-entangle)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--q-entangle)" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {entanglementPairs.map(([i, j], idx) => (
          <g key={idx}>
            <line
              x1="60" y1={idx * 120 + 72}
              x2="60" y2={(idx + 1) * 120 + 72}
              stroke="url(#entangle-gradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            {/* Dynamic Energy Strands */}
            <path
              d={`M 60 ${idx * 120 + 72} Q 80 ${(idx + 0.5) * 120 + 72} 60 ${(idx + 1) * 120 + 72}`}
              fill="none"
              stroke="var(--q-entangle)"
              strokeWidth="1"
              opacity="0.5"
              filter="url(#glow)"
              className="animate-quantum-pulse"
            />
          </g>
        ))}
      </svg>

      {/* Qubits */}
      <div className="flex flex-col gap-8 relative z-10">
        {qubitData.map((data, idx) => {
          const { prob0, prob1 } = data;
          const isSelected = selectedQubit === idx;
          const inSuperposition = prob0 > 0.05 && prob1 > 0.05;

          return (
            <div key={idx} className="relative group min-h-[100px]">
              <div className="flex items-center gap-3 md:gap-6">
                {/* Qubit Label & Control */}
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-mono tracking-tighter uppercase transition-q-snap ${
                    isSelected ? 'text-q-flux scale-110' : 'text-white/40'
                  }`}>
                    Node_0{idx}
                  </span>

                  {/* Holographic Qubit Visualizer */}
                  <div
                    onClick={() => onQubitSelect && onQubitSelect(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-q-snap group-hover:scale-105 ${
                      onQubitSelect ? 'cursor-pointer' : ''
                    } ${
                      isSelected ? 'ring-2 ring-q-flux ring-offset-4 ring-offset-black/50' : 'ring-1 ring-white/10'
                    }`}
                    style={{
                      background: `radial-gradient(circle at center,
                        ${inSuperposition ? 'var(--q-entangle)' : prob0 > 0.9 ? 'var(--q-flux)' : 'var(--q-rose)'} 0%,
                        transparent 70%)`,
                    }}
                  >
                    {/* Turbulence / Probability Cloud */}
                    <div
                      className="absolute inset-2 rounded-full opacity-40 mix-blend-screen"
                      style={{
                        filter: 'url(#quantum-noise)',
                        background: `radial-gradient(circle, ${inSuperposition ? 'var(--q-entangle)' : prob0 > 0.9 ? 'var(--q-flux)' : 'var(--q-rose)'} 0%, transparent 60%)`,
                        animation: 'spin-slow 12s linear infinite'
                      }}
                    />

                    {/* State Glyph */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white font-orbitron text-lg tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {prob0 > 0.98 ? '0' : prob1 > 0.98 ? '1' : 'Ψ'}
                      </span>
                    </div>

                    {/* Pulse Rings */}
                    <div className={`absolute -inset-2 rounded-full border border-q-flux/20 ${isSelected ? 'animate-ping' : 'hidden'}`} />
                  </div>
                </div>

                {/* Scitech HUD Details */}
                <div className="flex-1 glass-morphism-pro p-3 rounded-lg border-white/5 space-y-3 relative overflow-hidden">
                  {/* Scan line effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-q-flux/5 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-scan-line pointer-events-none" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-mono text-q-flux/60 uppercase">Prob|0⟩</span>
                        <span className="text-xs font-mono text-q-flux">{(prob0 * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-q-flux shadow-[0_0_8px_var(--q-flux)] transition-all duration-700 ease-out"
                          style={{ width: `${prob0 * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-mono text-q-entangle/60 uppercase">Prob|1⟩</span>
                        <span className="text-xs font-mono text-q-entangle">{(prob1 * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-q-entangle shadow-[0_0_8px_var(--q-entangle)] transition-all duration-700 ease-out"
                          style={{ width: `${prob1 * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <Activity className="h-2 w-2 text-green-500 animate-pulse" />
                    Status: {inSuperposition ? 'Coherent_Superposition' : 'Determinate_State'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default QubitVisualizer;
