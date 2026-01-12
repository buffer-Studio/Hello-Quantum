import React, { useState } from 'react';
import { Zap, GitBranch, RefreshCw, Repeat, Activity, MousePointer2 } from 'lucide-react';
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
      color: 'text-cyan-400',
      border: 'border-cyan-500/50',
      bg: 'hover:bg-cyan-500/10',
      activeBg: 'bg-cyan-500/10',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]'
    },
    X: {
      name: 'Pauli-X',
      icon: RefreshCw,
      description: 'Bit Flip',
      color: 'text-blue-400',
      border: 'border-blue-500/50',
      bg: 'hover:bg-blue-500/10',
      activeBg: 'bg-blue-500/10',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
    Z: {
      name: 'Pauli-Z',
      icon: Zap,
      description: 'Phase Flip',
      color: 'text-purple-400',
      border: 'border-purple-500/50',
      bg: 'hover:bg-purple-500/10',
      activeBg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    },
    CNOT: {
      name: 'CNOT',
      icon: GitBranch,
      description: 'Entangle',
      color: 'text-pink-400',
      border: 'border-pink-500/50',
      bg: 'hover:bg-pink-500/10',
      activeBg: 'bg-pink-500/10',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]'
    },
    SWAP: {
      name: 'SWAP',
      icon: Repeat,
      description: 'Exchange',
      color: 'text-orange-400',
      border: 'border-orange-500/50',
      bg: 'hover:bg-orange-500/10',
      activeBg: 'bg-orange-500/10',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]'
    }
  };

  const applyGate = (gate, qubit) => {
    if (disabled) {
      toast({
        title: "ACCESS DENIED",
        description: "Operation cycle limit reached or objective complete.",
        variant: "destructive",
        className: "bg-red-950 border-red-500 text-red-200 font-mono"
      });
      return;
    }

    let newState;

    if (gate === 'H' || gate === 'X' || gate === 'Z') {
      newState = applySingleQubitGate(currentState, GATES[gate], qubit, numQubits);
      onStateChange(newState);
      setSelectedQubit(null);
      setSelectedGate(null);
    }
  };

  const handleGateClick = (gate) => {
    if (disabled) return;

    setSelectedGate(gate);

    if (gate === 'CNOT') {
      setCnotControl(null);
    } else if (gate === 'SWAP') {
      setSwapFirst(null);
    }
  };

  const handleQubitClick = (qubit) => {
    if (disabled) return;

    if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        setCnotControl(qubit);
      } else {
        if (qubit === cnotControl) return; // Self-target invalid
        const newState = applyCNOT(currentState, cnotControl, qubit, numQubits);
        onStateChange(newState);
        setCnotControl(null);
        setSelectedGate(null);
      }
    } else if (selectedGate === 'SWAP') {
      if (swapFirst === null) {
        setSwapFirst(qubit);
      } else {
        if (qubit === swapFirst) return;
        const newState = applySWAP(currentState, swapFirst, qubit, numQubits);
        onStateChange(newState);
        setSwapFirst(null);
        setSelectedGate(null);
      }
    } else if (selectedGate) {
      applyGate(selectedGate, qubit);
    }
  };

  return (
    <Card className="bg-card/50 border-white/5 overflow-hidden h-full flex flex-col rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="p-6 flex-1 flex flex-col justify-center">
        {/* Gate Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {availableGates.map((gate) => {
            const info = gateInfo[gate];
            const Icon = info.icon;
            const isSelected = selectedGate === gate;

            return (
              <Button
                key={gate}
                onClick={() => handleGateClick(gate)}
                disabled={disabled}
                variant="outline"
                className={`group relative h-auto py-4 px-4 border transition-all duration-300 rounded-xl overflow-hidden ${
                  isSelected
                    ? `${info.border} ${info.activeBg} ${info.glow} scale-105`
                    : `border-white/10 hover:border-white/20 hover:scale-102 ${info.bg}`
                }`}
              >
                 {/* Shine Effect */}
                 <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`} />

                <div className="flex flex-col items-start gap-1 w-full relative z-10">
                   <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-2 rounded-lg bg-black/30 border border-white/5 ${isSelected ? info.color : 'text-gray-400 group-hover:text-white'}`}>
                          <Icon className="h-5 w-5" />
                      </div>
                      <span className={`font-display font-bold text-xl ${isSelected ? info.color : 'text-gray-500 group-hover:text-white'}`}>
                        {gate}
                      </span>
                   </div>
                   <div className="w-full">
                       <span className="text-xs font-bold uppercase text-white/90 block mb-0.5">
                            {info.name}
                       </span>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground group-hover:text-white/70">
                        {info.description}
                      </span>
                   </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Dynamic Context Panel (Bottom) */}
        <div className={`transition-all duration-500 border-t border-white/5 -mx-6 -mb-6 p-6 ${
            selectedGate ? 'bg-gradient-to-b from-primary/5 to-primary/10' : 'bg-black/20'
        }`}>
            {!selectedGate ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground py-2 text-center">
                    <div className="p-3 rounded-full bg-white/5 mb-2 animate-pulse">
                         <MousePointer2 className="h-5 w-5 text-white/50" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide">Select a gate to begin</p>
                </div>
            ) : (
                 <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <div className="flex items-center justify-between">
                         <p className="text-xs font-display font-bold text-primary uppercase flex items-center gap-2">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                             {selectedGate === 'CNOT' && cnotControl === null && 'SELECT CONTROL QUBIT'}
                             {selectedGate === 'CNOT' && cnotControl !== null && `CONTROL: Q${cnotControl} >> SELECT TARGET`}
                             {selectedGate === 'SWAP' && swapFirst === null && 'SELECT QUBIT A'}
                             {selectedGate === 'SWAP' && swapFirst !== null && `QUBIT A: Q${swapFirst} >> SELECT QUBIT B`}
                             {!['CNOT', 'SWAP'].includes(selectedGate) && 'SELECT TARGET QUBIT'}
                         </p>
                         <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedGate(null); setCnotControl(null); setSwapFirst(null); }}
                            className="h-6 text-[10px] uppercase font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full px-3"
                         >
                            Cancel
                         </Button>
                    </div>

                    <div className="flex gap-2 justify-center">
                        {Array.from({ length: numQubits }).map((_, idx) => (
                        <Button
                            key={idx}
                            onClick={() => handleQubitClick(idx)}
                            disabled={disabled}
                            className={`h-12 w-12 rounded-xl font-display font-bold text-lg relative transition-all duration-300 ${
                                (cnotControl === idx || swapFirst === idx)
                                    ? 'bg-accent text-black hover:bg-accent ring-2 ring-accent shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-110'
                                    : 'bg-card border border-white/10 hover:border-primary hover:text-primary hover:scale-105'
                            }`}
                        >
                             q{idx}
                        </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </Card>
  );
};

export default GatePanel;
