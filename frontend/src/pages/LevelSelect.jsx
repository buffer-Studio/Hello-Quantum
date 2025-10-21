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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu className="h-12 w-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quantum Puzzle Game
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Master quantum computing through interactive puzzles
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500" />
              <span className="text-gray-400">Superposition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <span className="text-gray-400">Entanglement</span>
            </div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {LEVELS.map((level, idx) => {
            const isUnlocked = idx < unlockedLevels;

            return (
              <Card
                key={level.id}
                className={`bg-black/50 backdrop-blur border-2 transition-all duration-300 hover:scale-105 ${
                  isUnlocked
                    ? 'border-cyan-500/40 hover:border-cyan-400 cursor-pointer'
                    : 'border-gray-700 opacity-50'
                }`}
                onClick={() => isUnlocked && navigate(`/game/${level.id}`)}
              >
                <div className="p-6">
                  {/* Level Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-cyan-400 font-semibold">
                          Level {level.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          level.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300' :
                          level.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {level.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{level.name}</h3>
                    </div>
                    <Play className="h-8 w-8 text-cyan-400" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">{level.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-400">{level.numQubits} qubit{level.numQubits > 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-gray-400">Max {level.maxMoves} moves</span>
                  </div>

                  {/* Gates */}
                  <div className="flex flex-wrap gap-2">
                    {level.availableGates.map((gate) => (
                      <span
                        key={gate}
                        className="px-2 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded text-xs font-mono text-cyan-300"
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
            className="bg-cyan-900/20 hover:bg-cyan-900/40 border-cyan-400/30 text-cyan-300"
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
