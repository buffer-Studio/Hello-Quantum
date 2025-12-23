import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Cpu, Home, Database, Network, Share2, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LEVELS } from '../mock';

const LevelSelect = () => {
  const navigate = useNavigate();

  // For MVP, all levels are unlocked
  const unlockedLevels = LEVELS.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16 space-y-4">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-50 animate-pulse"></div>
                <div className="relative bg-black rounded-full p-4 border border-white/10">
                    <Cpu className="h-16 w-16 text-primary" />
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 font-mono tracking-tighter uppercase mb-2">
                    Quantum<span className="text-primary">/</span>Sim
                </h1>
                <p className="text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
                    Initialize training protocols. Master superposition and entanglement.
                </p>
            </div>

            <div className="flex items-center gap-8 mt-8 border-t border-white/5 pt-8">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">System Online</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Neural Link Stable</span>
                 </div>
            </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {LEVELS.map((level, idx) => {
            const isUnlocked = idx < unlockedLevels;
            const isLast = idx === LEVELS.length - 1;

            return (
              <Card
                key={level.id}
                className={`group relative overflow-hidden transition-all duration-500 border-0 bg-transparent ${
                  isUnlocked ? 'cursor-pointer hover:-translate-y-2' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && navigate(`/game/${level.id}`)}
              >
                {/* Custom Card Styling */}
                <div className={`absolute inset-0 bg-gradient-to-b from-card to-black border border-white/10 ${
                    isUnlocked ? 'group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]' : ''
                }`} />

                {/* Decorative Corner lines */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors" />

                <div className="relative p-8 h-full flex flex-col">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-xs font-mono text-primary/80 uppercase tracking-widest mb-1 block">
                            Node 0{level.id}
                        </span>
                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors font-mono uppercase">
                            {level.name}
                        </h3>
                    </div>
                    <div className={`p-2 rounded-sm border ${
                        isUnlocked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-muted-foreground'
                    }`}>
                        {isUnlocked ? <Play className="h-5 w-5 fill-current" /> : <Lock className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow border-l-2 border-white/5 pl-4">
                    {level.description}
                  </p>

                  {/* Metadata Footer */}
                  <div className="space-y-4">
                      {/* Difficulty Meter */}
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                        <span className="text-muted-foreground">Difficulty</span>
                        <span className={`${
                            level.difficulty === 'Easy' ? 'text-emerald-500' :
                            level.difficulty === 'Medium' ? 'text-yellow-500' :
                            'text-red-500'
                        }`}>
                            {level.difficulty}
                        </span>
                      </div>

                      {/* Technical Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/5 p-2 rounded flex items-center gap-2 text-muted-foreground">
                              <Database className="h-3 w-3" />
                              {level.numQubits} Qubits
                          </div>
                          <div className="bg-white/5 p-2 rounded flex items-center gap-2 text-muted-foreground">
                              <Network className="h-3 w-3" />
                              {level.availableGates.length} Modules
                          </div>
                      </div>

                      {/* Gate Tags */}
                      <div className="flex flex-wrap gap-1 pt-2">
                        {level.availableGates.map((gate) => (
                          <span
                            key={gate}
                            className="px-2 py-0.5 bg-black border border-white/10 rounded-sm text-[10px] font-mono text-gray-400 group-hover:border-primary/30 group-hover:text-primary transition-colors"
                          >
                            {gate}
                          </span>
                        ))}
                      </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="text-center border-t border-white/10 pt-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-muted-foreground hover:text-white hover:bg-white/5 uppercase tracking-widest text-xs"
          >
            <Home className="mr-2 h-4 w-4" />
            Terminate Session
          </Button>
          <p className="mt-8 text-[10px] text-gray-600 font-mono uppercase">
            System v2.0.77 // Corp_Net_Access_Granted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
