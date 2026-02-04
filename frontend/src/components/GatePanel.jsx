import React, { useState } from 'react';
import { Zap, GitBranch, RefreshCw, Repeat, Activity, Sparkles, Cpu } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from '../hooks/use-toast';
import { GATES, applySingleQubitGate, applyCNOT, applySWAP } from '../mock';

const GatePanel = ({
  availableGates,
  numQubits,
  currentState,
  onStateChange,
  selectedQubit,
  setSelectedQubit,
  selectedGate,
  setSelectedGate,
  disabled
}) => {
  const [cnotControl, setCnotControl] = useState(null);
  const [swapFirst, setSwapFirst] = useState(null);

  const gateInfo = {
    H: {
      name: 'Hadamard',
      icon: Activity,
      description: 'Superposition',
      color: 'from-cyan-500/20 to-cyan-500/5',
      accent: 'var(--q-flux)',
      glow: 'shadow-[0_0_20px_rgba(0,245,255,0.2)]'
    },
    X: {
      name: 'Pauli-X',
      icon: RefreshCw,
      description: 'Bit Flip',
      color: 'from-blue-500/20 to-blue-500/5',
      accent: '#3B82F6',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'
    },
    Z: {
      name: 'Pauli-Z',
      icon: Zap,
      description: 'Phase Flip',
      color: 'from-purple-500/20 to-purple-500/5',
      accent: 'var(--q-entangle)',
      glow: 'shadow-[0_0_20px_rgba(188,19,254,0.2)]'
    },
    CNOT: {
      name: 'CNOT',
      icon: GitBranch,
      description: 'Entangle',
      color: 'from-pink-500/20 to-pink-500/5',
      accent: 'var(--q-rose)',
      glow: 'shadow-[0_0_20px_rgba(255,0,110,0.2)]'
    },
    SWAP: {
      name: 'SWAP',
      icon: Repeat,
      description: 'Exchange',
      color: 'from-orange-500/20 to-orange-500/5',
      accent: '#F97316',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]'
    }
  };

  const triggerImpact = (qubitIndex) => {
    // Dispatch custom event for screen shake and glow
    const event = new CustomEvent('quantum-impact', {
      detail: { qubitIndex, gate: selectedGate }
    });
    window.dispatchEvent(event);
  };

  const applyGate = (gate, qubit) => {
    if (disabled) return;

    triggerImpact(qubit);

    let newState;
    if (gate === 'H' || gate === 'X' || gate === 'Z') {
      newState = applySingleQubitGate(currentState, GATES[gate], qubit, numQubits);
      onStateChange(newState, { gate, qubit });
      setSelectedQubit(null);
      setSelectedGate(null);
    }
  };

  const handleGateClick = (gate) => {
    if (disabled) return;
    setSelectedGate(gate);

    if (gate === 'CNOT') setCnotControl(null);
    else if (gate === 'SWAP') setSwapFirst(null);
  };

  const handleQubitClick = (qubit) => {
    if (disabled) return;

    if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        setCnotControl(qubit);
      } else {
        if (qubit === cnotControl) return;
        triggerImpact(qubit);
        const newState = applyCNOT(currentState, cnotControl, qubit, numQubits);
        onStateChange(newState, { gate: 'CNOT', control: cnotControl, target: qubit });
        setCnotControl(null);
        setSelectedGate(null);
      }
    } else if (selectedGate === 'SWAP') {
      if (swapFirst === null) {
        setSwapFirst(qubit);
      } else {
        if (qubit === swapFirst) return;
        triggerImpact(qubit);
        const newState = applySWAP(currentState, swapFirst, qubit, numQubits);
        onStateChange(newState, { gate: 'SWAP', q1: swapFirst, q2: qubit });
        setSwapFirst(null);
        setSelectedGate(null);
      }
    } else if (selectedGate) {
      handleQubitClickProxy(qubit);
    }
  };

  const handleQubitClickProxy = (qubit) => {
    applyGate(selectedGate, qubit);
  };

  return (
    <Card className="glass-morphism-pro p-6 border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-orbitron font-bold text-q-flux tracking-widest flex items-center gap-2">
          <Cpu className="h-4 w-4 animate-pulse" />
          Logic_Forge
        </h2>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-q-flux animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-q-flux/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {availableGates.map((gate) => {
          const info = gateInfo[gate];
          const Icon = info.icon;
          const isSelected = selectedGate === gate;

          return (
            <button
              key={gate}
              onClick={() => handleGateClick(gate)}
              disabled={disabled}
              className={`group relative flex flex-col items-center justify-center p-4 rounded-xl transition-q-snap overflow-hidden border ${
                isSelected
                  ? 'border-q-flux ring-1 ring-q-flux/50 scale-[1.02] bg-white/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
              } disabled:opacity-30 disabled:grayscale transition-all duration-300`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-20 group-hover:opacity-40 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg bg-black/40 border border-white/10 ${isSelected ? 'text-q-flux' : 'text-white/60'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center text-white">
                  <div className="text-[10px] font-orbitron font-bold tracking-wider uppercase">
                    {info.name}
                  </div>
                  <div className="text-[8px] font-mono text-white/40 uppercase tracking-tighter">
                    {info.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute inset-0 bg-q-flux/5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {selectedGate && (
        <div className="glass-morphism-pro p-4 rounded-xl border-q-flux/20 animate-fade-in text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-3 w-3 text-q-flux" />
            <p className="font-mono text-[9px] text-q-flux uppercase tracking-[0.2em]">
              {selectedGate === 'CNOT' && cnotControl === null && 'Awaiting_Control_Node'}
              {selectedGate === 'CNOT' && cnotControl !== null && `Control: Node_0${cnotControl} | Awaiting_Target`}
              {selectedGate === 'SWAP' && swapFirst === null && 'Awaiting_Initial_Node'}
              {selectedGate === 'SWAP' && swapFirst !== null && `Node_0${swapFirst} | Awaiting_Partner`}
              {!['CNOT', 'SWAP'].includes(selectedGate) && 'Awaiting_Target_Node'}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: numQubits }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleQubitClick(idx)}
                disabled={disabled}
                className={`h-12 font-mono text-xs font-bold rounded border transition-q-snap ${
                  (cnotControl === idx || swapFirst === idx)
                    ? 'bg-q-flux text-black border-q-flux shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-q-flux/50 hover:text-white'
                }`}
              >
                q0{idx}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setSelectedGate(null);
              setCnotControl(null);
              setSwapFirst(null);
            }}
            className="mt-4 w-full py-2 font-mono text-[8px] uppercase tracking-widest text-white/40 hover:text-q-rose transition-colors"
          >
            [ Terminate_Operation ]
          </button>
        </div>
      )}

      <div className="pt-4 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-tighter">
          <span>Engine_Status: Nominal</span>
          <span>Latency: 0.002ms</span>
        </div>
        <div className="w-full h-[1px] bg-white/5 overflow-hidden">
          <div className="h-full bg-q-flux/20 w-1/3 animate-[scan-line_2s_linear_infinite]" />
        </div>
      </div>
    </Card>
  );
};

export default GatePanel;
