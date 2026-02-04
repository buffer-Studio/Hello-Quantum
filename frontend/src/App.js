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

import BootSequence from "./components/home/BootSequence";
import { Terminal, Shield, Activity } from "lucide-react";

import ParallaxWrapper from "./components/effects/ParallaxWrapper";

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
    <div className="min-h-[100dvh] relative overflow-hidden bg-q-void text-white selection:bg-q-flux/30">
      {/* Interactive Nebula Backdrop */}
      {/* Interactive Nebula Backdrop */}

      {/* Scanline Overlay */}
      <div className="scan-overlay opacity-10 pointer-events-none" />

      {isBooting && <BootSequence onComplete={handleBootComplete} />}

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8">
        <ParallaxWrapper amount={10}>
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Title and CTA */}
            <div className="text-center lg:text-left space-y-12 order-2 lg:order-1">
              {/* Logo and Title */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase font-orbitron leading-none">
                    <span className="font-ink-flow drop-shadow-[0_0_30px_rgba(0,245,255,0.3)] inline-block">Hello</span>
                    <br />
                    <span className="font-ink-flow drop-shadow-[0_0_30px_rgba(0,245,255,0.3)]">
                      Quantum
                    </span>
                  </h1>

                  <div className="flex items-center justify-center lg:justify-start gap-4 font-mono text-q-flux/50 uppercase tracking-[0.4em] text-[10px]">
                    <span className="w-12 h-px bg-q-flux/20" />
                    QUANTUM SIMULATION
                    <span className="w-12 h-px bg-q-flux/20" />
                  </div>
                </div>

                <p className="text-sm font-mono text-white/40 max-w-lg mx-auto lg:mx-0 leading-relaxed tracking-wide">
                  Master the fundamentals of quantum mechanics through high-fidelity visual challenges.
                </p>
              </div>

              {/* CTA */}
              <div className="relative group inline-block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-q-flux via-q-entangle to-q-rose rounded-lg blur opacity-30 group-hover:opacity-100 transition-q-snap" />
                <Button
                  onClick={startInitialization}
                  className="relative bg-q-void hover:bg-black text-white px-12 py-8 text-lg font-bold rounded-lg transition-q-snap border border-white/10 group-active:scale-95 flex items-center gap-4 overflow-hidden superposition-jitter"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-q-flux to-q-rose" />
                  <span className="relative flex items-center gap-3 font-orbitron tracking-[0.2em] uppercase">
                    Initialize Mission
                    <Activity className="h-4 w-4 text-q-flux group-hover:rotate-90 transition-q-snap" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Right Column: 3D Qubit Replacement */}
            <div className="relative order-1 lg:order-2 flex justify-center items-center h-[400px] md:h-[600px] w-full">
              <div className="absolute inset-0 bg-q-flux/5 blur-[120px] rounded-full animate-quantum-pulse" />
              <div className="relative w-64 h-64 border border-q-flux/20 rounded-full flex items-center justify-center animate-spin-slow">
                 <div className="absolute inset-0 border border-q-flux/10 rounded-full scale-150" />
                 <div className="w-48 h-48 bg-q-flux/10 rounded-full blur-xl" />
                 <Atom className="absolute h-32 w-32 text-q-flux animate-pulse" />
              </div>
            </div>

          </div>
        </ParallaxWrapper>

        {/* Feature Cards Section */}
        <div className="mt-32 w-full max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: "Quantum Logic",
                desc: "Authentic simulator with complex matrix operations and state vector tracking.",
                color: "text-q-flux",
                bg: "group-hover:bg-q-flux/10",
                border: "group-hover:border-q-flux/50",
                glow: "from-q-flux"
              },
              {
                icon: Zap,
                title: "Immersive Depth",
                desc: "Interact with the Bloch Sphere in real-time 3D space with haptic visual feedback.",
                color: "text-q-entangle",
                bg: "group-hover:bg-q-entangle/10",
                border: "group-hover:border-q-entangle/50",
                glow: "from-q-entangle"
              },
              {
                icon: Atom,
                title: "Visual Physics",
                desc: "Intuitive state mapping with holographic overlays and real-time interference patterns.",
                color: "text-q-rose",
                bg: "group-hover:bg-q-rose/10",
                border: "group-hover:border-q-rose/50",
                glow: "from-q-rose"
              }
            ].map((f, i) => (
              <div key={i} className="group relative p-8 rounded-3xl bg-[#0A0A0A]/80 border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-2xl">

                {/* Ambient Glow Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.glow} to-transparent opacity-0 ${f.bg} transition-all duration-700 blur-2xl`} />

                {/* Tech Corners */}
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  0{i + 1} // SYS_READY
                </div>

                {/* Cyber Scanline Top */}
                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${f.color.split('-')[1]} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-x-0 group-hover:scale-x-100`} />

                <div className="relative z-10 flex flex-col items-start h-full">
                  {/* Icon Container */}
                  <div className={`mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 ${f.border} transition-colors duration-500 group-hover:scale-105 transform origin-left`}>
                    <f.icon className={`h-8 w-8 ${f.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3 font-orbitron group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono leading-relaxed group-hover:text-gray-300 transition-colors">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>

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
