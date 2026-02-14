import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Cpu, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LEVELS } from '../mock';

const LevelSelect = () => {
  const navigate = useNavigate();

  // For MVP, all levels are unlocked
  const unlockedLevels = LEVELS.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary tracking-tight">
              Quantum Puzzle Game
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 font-light">
            Master quantum computing through interactive puzzles
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chart-1 to-blue-500" />
              <span className="text-muted-foreground">Superposition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chart-3 to-pink-500" />
              <span className="text-muted-foreground">Entanglement</span>
            </div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {LEVELS.map((level, idx) => {
            const isUnlocked = idx < unlockedLevels;

            return (
              <Card
                key={level.id}
                role="button"
                tabIndex={isUnlocked ? 0 : -1}
                aria-label={`Select Level ${level.id}: ${level.name}`}
                aria-disabled={!isUnlocked}
                className={`bg-card border-border shadow-sm transition-all duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isUnlocked
                    ? 'hover:border-primary/50 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed bg-muted/50'
                }`}
                onClick={() => isUnlocked && navigate(`/game/${level.id}`)}
                onKeyDown={(e) => {
                  if (isUnlocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    navigate(`/game/${level.id}`);
                  }
                }}
              >
                <div className="p-6">
                  {/* Level Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-primary font-semibold">
                          Level {level.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          level.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          level.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {level.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{level.name}</h3>
                    </div>
                    <Play className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors" />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">{level.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-chart-2" />
                      <span className="text-muted-foreground">{level.numQubits} qubit{level.numQubits > 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-muted-foreground">Max {level.maxMoves} moves</span>
                  </div>

                  {/* Gates */}
                  <div className="flex flex-wrap gap-2">
                    {level.availableGates.map((gate) => (
                      <span
                        key={gate}
                        className="px-2 py-1 bg-secondary text-secondary-foreground border border-border rounded text-xs font-mono"
                      >
                        {gate}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 text-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
