import React from 'react';
import { Cpu, Atom, Shield, Terminal } from 'lucide-react';

const GameContainer = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-q-void text-foreground selection:bg-q-flux/30">
      {/* Scanline Overlay */}
      <div className="scan-overlay opacity-20" />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-q-flux/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-q-entangle/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Main HUD Interface */}
      <div className="relative z-10 flex flex-col min-h-[100dvh] font-sans">
        {/* Header HUD */}
        <header className="h-16 border-b border-white/5 glass-morphism-pro flex items-center justify-between px-6 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="p-2 glass-morphism-pro rounded-lg quantum-glow animate-quantum-pulse border-q-flux/30">
              <Atom className="h-6 w-6 text-q-flux" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-q-flux font-orbitron uppercase leading-tight">
                {title || 'Hello Quantum'}
              </h1>
              {subtitle && (
                <p className="text-[10px] font-mono text-q-flux/60 uppercase tracking-widest">
                   {subtitle}
                </p>
              )}
            </div>
          </div>

{/* Header Widgets Removed: Minimalism */ }

          <div className="flex items-center gap-4 p-2 glass-morphism-pro border-white/10 rounded-lg">
             <span className="text-[10px] font-mono text-white/40">DEV_BY:</span>
             <span className="text-[11px] font-bold text-q-flux/80 font-orbitron tracking-tighter uppercase">Yuvraj</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 container mx-auto p-4 md:p-8 relative">
          {children}
        </main>

        {/* Footer HUD */}
        <footer className="h-10 border-t border-white/5 glass-morphism-pro flex items-center justify-between px-6 text-[10px] font-mono text-white/30">
          <div className="flex w-full justify-center">
            <span className="text-q-flux/40 tracking-widest uppercase">bufferwise</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GameContainer;
