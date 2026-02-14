import React, { useState } from 'react';
import { Zap, GitBranch, RefreshCw, Repeat, Activity } from 'lucide-react';
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
      description: 'Creates superposition',
      className: 'bg-chart-1 text-white border-chart-1/50 hover:bg-chart-1/90'
    },
    X: {
      name: 'Pauli-X',
      icon: RefreshCw,
      description: 'Flips |0⟩↔|1⟩',
      className: 'bg-chart-2 text-white border-chart-2/50 hover:bg-chart-2/90'
    },
    Z: {
      name: 'Pauli-Z',
      icon: Zap,
      description: 'Phase flip',
      className: 'bg-chart-3 text-white border-chart-3/50 hover:bg-chart-3/90'
    },
    CNOT: {
      name: 'CNOT',
      icon: GitBranch,
      description: 'Controlled-NOT (entanglement)',
      className: 'bg-chart-4 text-white border-chart-4/50 hover:bg-chart-4/90'
    },
    SWAP: {
      name: 'SWAP',
      icon: Repeat,
      description: 'Swaps two qubits',
      className: 'bg-chart-5 text-white border-chart-5/50 hover:bg-chart-5/90'
    }
  };

  const applyGate = (gate, qubit) => {
    if (disabled) {
      toast({
        title: "Cannot apply gate",
        description: "Level complete or max moves reached",
        variant: "destructive"
      });
      return;
    }

    let newState;

    if (gate === 'H' || gate === 'X' || gate === 'Z') {
      newState = applySingleQubitGate(currentState, GATES[gate], qubit, numQubits);
      toast({
        title: `${gate} Gate Applied`,
        description: `Applied to qubit ${qubit}`,
      });
      onStateChange(newState);
      setSelectedQubit(null);
      setSelectedGate(null);
    }
  };

  const handleGateClick = (gate) => {
    if (disabled) return;

    setSelectedGate(gate);

    if (gate === 'CNOT') {
      toast({
        title: "CNOT Gate",
        description: "Select control qubit, then target qubit",
      });
      setCnotControl(null);
    } else if (gate === 'SWAP') {
      toast({
        title: "SWAP Gate",
        description: "Select first qubit, then second qubit",
      });
      setSwapFirst(null);
    } else {
      toast({
        title: `${gate} Gate Selected`,
        description: "Click on a qubit to apply",
      });
    }
  };

  const handleQubitClick = (qubit) => {
    if (disabled) return;

    if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        setCnotControl(qubit);
        toast({
          title: "Control qubit selected",
          description: `q${qubit} is control. Now select target.`,
        });
      } else {
        if (qubit === cnotControl) {
          toast({
            title: "Invalid target",
            description: "Target must be different from control",
            variant: "destructive"
          });
          return;
        }
        const newState = applyCNOT(currentState, cnotControl, qubit, numQubits);
        toast({
          title: "CNOT Applied",
          description: `Control: q${cnotControl}, Target: q${qubit}`,
        });
        onStateChange(newState);
        setCnotControl(null);
        setSelectedGate(null);
      }
    } else if (selectedGate === 'SWAP') {
      if (swapFirst === null) {
        setSwapFirst(qubit);
        toast({
          title: "First qubit selected",
          description: `q${qubit} selected. Now select second.`,
        });
      } else {
        if (qubit === swapFirst) {
          toast({
            title: "Invalid selection",
            description: "Select a different qubit",
            variant: "destructive"
          });
          return;
        }
        const newState = applySWAP(currentState, swapFirst, qubit, numQubits);
        toast({
          title: "SWAP Applied",
          description: `Swapped q${swapFirst} and q${qubit}`,
        });
        onStateChange(newState);
        setSwapFirst(null);
        setSelectedGate(null);
      }
    } else if (selectedGate) {
      applyGate(selectedGate, qubit);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-chart-1" />
        Quantum Gates
      </h2>

      {/* Gate Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {availableGates.map((gate) => {
          const info = gateInfo[gate];
          const Icon = info.icon;
          const isSelected = selectedGate === gate;

          return (
            <Button
              key={gate}
              onClick={() => handleGateClick(gate)}
              disabled={disabled}
              className={`relative h-auto py-4 px-4 border ${info.className} ${
                isSelected ? 'ring-2 ring-foreground scale-105' : ''
              } shadow-sm transition-all duration-200 disabled:opacity-50`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="h-6 w-6" />
                <span className="font-bold text-sm">{info.name}</span>
                <span className="text-xs opacity-90">{info.description}</span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Qubit Selection */}
      {selectedGate && (
        <Card className="bg-secondary/20 border-border p-4 mb-4">
          <p className="text-foreground text-sm font-semibold mb-3">
            {selectedGate === 'CNOT' && cnotControl === null && 'Select control qubit:'}
            {selectedGate === 'CNOT' && cnotControl !== null && `Control: q${cnotControl} - Select target:`}
            {selectedGate === 'SWAP' && swapFirst === null && 'Select first qubit:'}
            {selectedGate === 'SWAP' && swapFirst !== null && `First: q${swapFirst} - Select second:`}
            {!['CNOT', 'SWAP'].includes(selectedGate) && 'Select target qubit:'}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: numQubits }).map((_, idx) => (
              <Button
                key={idx}
                onClick={() => handleQubitClick(idx)}
                disabled={disabled}
                className={`h-12 font-mono font-bold ${
                  (cnotControl === idx || swapFirst === idx)
                    ? 'bg-accent text-accent-foreground ring-2 ring-primary'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                q{idx}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedGate(null);
              setCnotControl(null);
              setSwapFirst(null);
            }}
            className="mt-3 w-full"
          >
            Cancel
          </Button>
        </Card>
      )}

      {/* Quick reference */}
      <div className="mt-4 p-3 bg-secondary/30 rounded border border-border">
        <p className="text-xs text-muted-foreground font-semibold mb-2">Quick Reference:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <span className="text-chart-1 font-medium">H</span>: |0⟩ → |+⟩ (superposition)</li>
          <li>• <span className="text-chart-2 font-medium">X</span>: |0⟩ → |1⟩ (bit flip)</li>
          <li>• <span className="text-chart-3 font-medium">Z</span>: Phase flip on |1⟩</li>
          <li>• <span className="text-chart-4 font-medium">CNOT</span>: Entangles qubits</li>
          <li>• <span className="text-chart-5 font-medium">SWAP</span>: Exchanges states</li>
        </ul>
      </div>
    </Card>
  );
};

export default GatePanel;
