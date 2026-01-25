import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Cpu, Atom, Zap } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import QuantumGame from './pages/QuantumGame';
import LevelSelect from './pages/LevelSelect';
import { Toaster } from './components/ui/toaster';

import NebulaBackdrop from "./components/effects/NebulaBackdrop";
import BootSequence from "./components/home/BootSequence";
import SystemCommandStream from "./components/layout/SystemCommandStream";
import { Terminal, Shield, Activity } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isBooting, setIsBooting] = useState(false);

  const startInitialization = () => {
    setIsBooting(true);
  };

  const handleBootComplete = () => {
    navigate('/levels');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-q-void text-white selection:bg-q-flux/30">
      {/* Interactive Nebula Backdrop */}
      <NebulaBackdrop />

      {/* Scanline Overlay */}
      <div className="scan-overlay opacity-10 pointer-events-none" />

      {isBooting && <BootSequence onComplete={handleBootComplete} />}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto text-center space-y-12">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="p-1 rounded-2xl relative group">
                <div className="absolute inset-0 bg-q-flux/20 blur-xl group-hover:bg-q-flux/40 transition-q-snap" />
                <div className="relative p-6 glass-morphism-pro rounded-2xl quantum-glow animate-float">
                  <Atom className="h-20 w-20 text-q-flux" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase font-orbitron">
                  <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Hello</span>
                  <br />
                  <span className="bg-gradient-to-r from-q-flux via-q-entangle to-q-rose bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                    Quantum
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-4 font-mono text-q-flux/50 uppercase tracking-[0.4em] text-[10px]">
                  <span className="w-12 h-px bg-q-flux/20" />
                  Neural Entanglement Protocol v4.0
                  <span className="w-12 h-px bg-q-flux/20" />
                </div>
              </div>
            </div>

            <p className="text-lg text-white/50 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              Scale the frontiers of computation. Master the fundamentals of quantum mechanics through high-fidelity visual challenges.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Cpu, title: "Quantum Logic", desc: "Authentic simulator with complex matrix operations", color: "text-q-flux", border: "border-q-flux/20" },
              { icon: Zap, title: "5 Sectors", desc: "Progressive difficulty from basic gates to entanglement", color: "text-q-entangle", border: "border-q-entangle/20" },
              { icon: Atom, title: "Visual Physics", desc: "Intuitive state mapping and holographic feedback", color: "text-q-rose", border: "border-q-rose/20" }
            ].map((f, i) => (
              <Card key={i} className={`bg-q-glass backdrop-blur-md p-6 text-center group border-white/5 hover:border-white/20 transition-q-snap overflow-hidden relative ${f.border}`}>
                <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-transparent via-current to-transparent ${f.color}`} />
                <f.icon className={`h-10 w-10 opacity-30 group-hover:opacity-100 transition-q-snap mx-auto mb-4 group-hover:scale-110 ${f.color}`} />
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-3 font-orbitron">{f.title}</h3>
                <p className="text-[11px] text-white/40 font-mono leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-8">
            <div className="relative group inline-block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-q-flux via-q-entangle to-q-rose rounded-lg blur opacity-30 group-hover:opacity-100 transition-q-snap" />
              <Button
                onClick={startInitialization}
                className="relative bg-q-void hover:bg-black text-white px-16 py-8 text-lg font-bold rounded-lg transition-q-snap border border-white/10 group-active:scale-95 flex items-center gap-4 overflow-hidden superposition-jitter"
              >
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-q-flux to-q-rose" />
                <span className="relative flex items-center gap-3 font-orbitron tracking-[0.2em] uppercase">
                  Initialize Mission
                  <Activity className="h-4 w-4 text-q-flux group-hover:rotate-90 transition-q-snap" />
                </span>
              </Button>
            </div>
          </div>

          {/* Legacy Terminal Credits removed to transition to Global narration engine */}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SystemCommandStream />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={<QuantumGame />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
