import React, { useState } from 'react';
import { Zap, GitBranch, RefreshCw, Repeat, Activity, MousePointer2, AlertCircle } from 'lucide-react';
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
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'
    },
    X: {
      name: 'Pauli-X',
      icon: RefreshCw,
      description: 'Bit Flip (NOT)',
      color: 'text-blue-400',
      border: 'border-blue-500/50',
      bg: 'hover:bg-blue-500/10',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
    },
    Z: {
      name: 'Pauli-Z',
      icon: Zap,
      description: 'Phase Flip',
      color: 'text-purple-400',
      border: 'border-purple-500/50',
      bg: 'hover:bg-purple-500/10',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
    },
    CNOT: {
      name: 'CNOT',
      icon: GitBranch,
      description: 'Entangle',
      color: 'text-pink-400',
      border: 'border-pink-500/50',
      bg: 'hover:bg-pink-500/10',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]'
    },
    SWAP: {
      name: 'SWAP',
      icon: Repeat,
      description: 'Exchange',
      color: 'text-orange-400',
      border: 'border-orange-500/50',
      bg: 'hover:bg-orange-500/10',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
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
    <Card className="bg-card border-white/10 p-0 overflow-hidden h-full flex flex-col">
       <div className="bg-black/40 p-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Activity className="h-3 w-3" /> Gate Array
          </h2>
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
       </div>

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
                className={`group relative h-auto py-5 px-4 bg-black/40 border-l-2 transition-all duration-300 ${
                  isSelected
                    ? `${info.border} border-l-4 bg-white/5 ${info.glow}`
                    : `border-white/10 border-l-2 hover:border-l-4 hover:${info.border} ${info.bg}`
                }`}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                   <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-mono font-bold text-lg ${isSelected ? info.color : 'text-gray-400 group-hover:text-white'}`}>
                            {gate}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-muted-foreground/70">
                            {info.name}
                        </span>
                      </div>
                      <Icon className={`h-5 w-5 ${isSelected ? info.color : 'text-gray-600 group-hover:text-white'}`} />
                   </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-gray-400">
                    {info.description}
                  </span>
                </div>

                {/* Tech corner accents */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            );
          })}
        </div>

        {/* Dynamic Context Panel (Bottom) */}
        <div className={`transition-all duration-300 border-t border-white/10 -mx-6 -mb-6 p-6 ${
            selectedGate ? 'bg-primary/5' : 'bg-black/20'
        }`}>
            {!selectedGate ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                    <MousePointer2 className="h-4 w-4" />
                    <p className="text-xs font-mono uppercase">Select a gate module to initiate operation.</p>
                </div>
            ) : (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <p className="text-xs font-mono font-bold text-primary uppercase flex items-center gap-2">
                             <span className="h-1.5 w-1.5 bg-primary rounded-sm animate-spin" />
                             {selectedGate === 'CNOT' && cnotControl === null && 'AWAITING CONTROL QUBIT...'}
                             {selectedGate === 'CNOT' && cnotControl !== null && `CONTROL: Q${cnotControl} >> AWAITING TARGET...`}
                             {selectedGate === 'SWAP' && swapFirst === null && 'AWAITING QUBIT A...'}
                             {selectedGate === 'SWAP' && swapFirst !== null && `QUBIT A: Q${swapFirst} >> AWAITING QUBIT B...`}
                             {!['CNOT', 'SWAP'].includes(selectedGate) && 'AWAITING TARGET QUBIT...'}
                         </p>
                         <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedGate(null); setCnotControl(null); setSwapFirst(null); }}
                            className="h-6 text-[10px] uppercase text-red-400 hover:text-red-300 hover:bg-red-950/30"
                         >
                            Cancel
                         </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: numQubits }).map((_, idx) => (
                        <Button
                            key={idx}
                            onClick={() => handleQubitClick(idx)}
                            disabled={disabled}
                            className={`h-10 font-mono font-bold text-sm relative overflow-hidden transition-all ${
                                (cnotControl === idx || swapFirst === idx)
                                    ? 'bg-accent text-black hover:bg-accent border-none ring-2 ring-accent/50'
                                    : 'bg-black border border-white/20 hover:border-primary hover:text-primary'
                            }`}
                        >
                             <span className="z-10">q{idx}</span>
                             {/* Scanline hover effect */}
                             <div className="absolute inset-0 bg-white/5 translate-y-full hover:translate-y-0 transition-transform duration-300" />
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
