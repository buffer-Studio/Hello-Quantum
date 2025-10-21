import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Zap, RotateCcw, ArrowLeft, Lightbulb, Trophy, Cpu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import QubitVisualizer from '../components/QubitVisualizer';
import GatePanel from '../components/GatePanel';
import { LEVELS, statesEqual, stateToString } from '../mock';

const QuantumGame = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = LEVELS.find(l => l.id === parseInt(levelId));

  const [currentState, setCurrentState] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedQubit, setSelectedQubit] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);

  useEffect(() => {
    if (level) {
      setCurrentState([...level.initialState]);
      setMoveCount(0);
      setIsComplete(false);
      setShowTutorial(true);
    }
  }, [levelId, level]);

  useEffect(() => {
    if (level && currentState.length > 0) {
      if (statesEqual(currentState, level.targetState)) {
        setIsComplete(true);
        toast({
          title: "Level Complete!",
          description: `Completed in ${moveCount} moves!`,
        });
      }
    }
  }, [currentState, level, moveCount]);

  const handleReset = () => {
    setCurrentState([...level.initialState]);
    setMoveCount(0);
    setIsComplete(false);
    setSelectedQubit(null);
    setSelectedGate(null);
  };

  const handleNextLevel = () => {
    const nextLevel = LEVELS.find(l => l.id === level.id + 1);
    if (nextLevel) {
      navigate(`/game/${nextLevel.id}`);
    } else {
      navigate('/levels');
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="p-8 bg-black/50 backdrop-blur border-cyan-500/30">
          <p className="text-cyan-400 text-xl">Level not found</p>
          <Button onClick={() => navigate('/levels')} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
            Back to Levels
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/levels')}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Levels
          </Button>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-purple-600/30 rounded-lg border border-purple-400/30">
              <span className="text-purple-300 font-semibold">Moves: {moveCount}/{level.maxMoves}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Cpu className="h-8 w-8 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {level.name}
          </h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            level.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300' :
            level.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300' :
            'bg-red-600/30 text-red-300'
          }`}>
            {level.difficulty}
          </span>
        </div>
        <p className="text-gray-300 text-lg">{level.description}</p>
      </div>

      {/* Tutorial Card */}
      {showTutorial && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-400/30 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-cyan-300 font-semibold text-lg mb-2">Tutorial</h3>
                <p className="text-gray-300">{level.tutorial}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(false)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Got it!
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current State */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 backdrop-blur border-cyan-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-cyan-400">Current State</h2>
            </div>
            <QubitVisualizer
              state={currentState}
              numQubits={level.numQubits}
              selectedQubit={selectedQubit}
              onQubitSelect={setSelectedQubit}
            />
            <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">State Vector:</p>
              <p className="text-sm text-cyan-300 font-mono break-all">
                {stateToString(currentState, level.numQubits)}
              </p>
            </div>
          </Card>
        </div>

        {/* Center: Gate Controls */}
        <div className="lg:col-span-1">
          <GatePanel
            availableGates={level.availableGates}
            numQubits={level.numQubits}
            currentState={currentState}
            onStateChange={(newState) => {
              setCurrentState(newState);
              setMoveCount(moveCount + 1);
            }}
            selectedQubit={selectedQubit}
            setSelectedQubit={setSelectedQubit}
            selectedGate={selectedGate}
            setSelectedGate={setSelectedGate}
            disabled={isComplete || moveCount >= level.maxMoves}
          />

          <div className="mt-4 flex gap-3">
            <Button
              onClick={handleReset}
              className="flex-1 bg-purple-600 hover:bg-purple-700 border border-purple-400/30"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            {!showTutorial && (
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                className="bg-cyan-900/20 hover:bg-cyan-900/40 border-cyan-400/30 text-cyan-300"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Target State */}
        <div className="lg:col-span-1">
          <Card className="bg-black/40 backdrop-blur border-purple-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-bold text-purple-400">Target State</h2>
            </div>
            <QubitVisualizer
              state={level.targetState}
              numQubits={level.numQubits}
              isTarget={true}
            />
            <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Target Vector:</p>
              <p className="text-sm text-purple-300 font-mono break-all">
                {stateToString(level.targetState, level.numQubits)}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-purple-900/90 to-cyan-900/90 border-2 border-cyan-400/50 p-8 max-w-md w-full">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">Level Complete!</h2>
              <p className="text-gray-300 mb-1">Moves used: {moveCount}/{level.maxMoves}</p>
              <p className="text-sm text-gray-400 mb-6">
                {moveCount <= level.maxMoves * 0.6 ? '⭐⭐⭐ Perfect!' :
                 moveCount <= level.maxMoves * 0.8 ? '⭐⭐ Great!' : '⭐ Complete!'}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-cyan-400/30 text-cyan-300 hover:bg-cyan-900/20"
                >
                  Retry
                </Button>
                <Button
                  onClick={handleNextLevel}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                >
                  {level.id < 5 ? 'Next Level' : 'Finish'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuantumGame;
