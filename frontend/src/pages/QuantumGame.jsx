import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Zap, RotateCcw, ArrowLeft, Lightbulb, Trophy, Cpu, Terminal, Shield } from 'lucide-react';
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
          title: "SYSTEM OVERRIDE SUCCESSFUL",
          description: `Pattern matched in ${moveCount} cycles.`,
          className: "bg-black border-cyan-500 text-cyan-500 font-mono"
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 bg-card border-destructive/50 text-center max-w-md w-full">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2 font-mono">ERROR 404</h1>
          <p className="text-muted-foreground mb-6">Level Data Corrupted or Missing.</p>
          <Button onClick={() => navigate('/levels')} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
            Return to Node Select
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 font-sans selection:bg-cyan-500/30">
      {/* HUD Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-white/10 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/levels')}
              className="h-10 w-10 border-white/20 hover:bg-white/5 hover:text-primary rounded-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-primary animate-pulse" />
                <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase">
                  {level.name}
                </h1>
                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border ${
                  level.difficulty === 'Easy' ? 'border-emerald-500/50 text-emerald-500' :
                  level.difficulty === 'Medium' ? 'border-yellow-500/50 text-yellow-500' :
                  'border-red-500/50 text-red-500'
                }`}>
                  {level.difficulty} Protocol
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1 font-mono pl-9 border-l-2 border-primary/30 ml-1">
                {level.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card/50 px-4 py-2 border border-white/5 rounded-sm">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Cycles</p>
              <p className="text-xl font-mono font-bold text-primary tabular-nums">
                {String(moveCount).padStart(2, '0')}<span className="text-muted-foreground text-sm">/{String(level.maxMoves).padStart(2, '0')}</span>
              </p>
            </div>
            <ActivityGraph className="h-8 w-16 text-primary opacity-50" />
          </div>
        </div>
      </div>

      {/* Tutorial/Briefing */}
      {showTutorial && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="bg-primary/5 border-l-4 border-l-primary border-y-0 border-r-0 rounded-none p-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <div className="flex items-start gap-4">
              <Terminal className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-primary font-mono font-bold text-sm uppercase mb-2 tracking-wider"> Mission Briefing</h3>
                <p className="text-gray-300 font-light leading-relaxed">{level.tutorial}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(false)}
                className="text-primary hover:text-primary hover:bg-primary/10 font-mono text-xs uppercase"
              >
                [ Acknowledge ]
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Interface Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Current State (Monitor) */}
        <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Live Feed</h2>
            </div>
          <Card className="bg-card border-white/10 p-0 overflow-hidden rounded-sm relative group">
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]" />

            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Current State
                </h2>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1">MONITORING</span>
                </div>

                <QubitVisualizer
                state={currentState}
                numQubits={level.numQubits}
                selectedQubit={selectedQubit}
                onQubitSelect={setSelectedQubit}
                />
            </div>

            <div className="bg-black/80 p-3 border-t border-white/10 font-mono text-xs">
                <p className="text-muted-foreground mb-1 uppercase text-[10px]">Vector Output</p>
                <p className="text-primary break-all">
                    {stateToString(currentState, level.numQubits)}
                </p>
            </div>
          </Card>
        </div>

        {/* Center: Controls (Console) */}
        <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-2">
                <div className="h-2 w-2 bg-secondary rounded-full" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Command Console</h2>
            </div>
          <div className="flex-1">
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
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 border-white/10 hover:border-white/30 hover:bg-white/5 uppercase tracking-widest text-xs font-bold h-12"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              System Reset
            </Button>
            {!showTutorial && (
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 h-12 w-12"
              >
                <Lightbulb className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Target State (Objective) */}
        <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-2">
                <div className="h-2 w-2 bg-accent rounded-full" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Objective Data</h2>
            </div>
          <Card className="bg-card border-white/10 p-0 overflow-hidden rounded-sm relative opacity-90">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]" />
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" /> Target Pattern
                </h2>
                <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1">LOCKED</span>
                </div>

                <QubitVisualizer
                state={level.targetState}
                numQubits={level.numQubits}
                isTarget={true}
                />
            </div>
             <div className="bg-black/80 p-3 border-t border-white/10 font-mono text-xs">
                <p className="text-muted-foreground mb-1 uppercase text-[10px]">Required Vector</p>
                <p className="text-accent break-all">
                    {stateToString(level.targetState, level.numQubits)}
                </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Modal - Cyberpunk Style */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-lg">
             {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-lg blur opacity-75 animate-pulse"></div>

            <Card className="relative bg-black border border-white/10 p-8 rounded-lg shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 mb-6 border border-accent/20">
                    <Trophy className="h-12 w-12 text-accent" />
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 font-mono tracking-tighter uppercase">
                    System Override
                </h2>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />

                <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-xs mx-auto">
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                        <p className="text-[10px] uppercase text-muted-foreground mb-1">Status</p>
                        <p className="text-emerald-400 font-mono font-bold">SUCCESS</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                        <p className="text-[10px] uppercase text-muted-foreground mb-1">Efficiency</p>
                        <p className="text-white font-mono font-bold">{moveCount}/{level.maxMoves}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 h-12 uppercase tracking-wide text-xs"
                  >
                    Reboot Level
                  </Button>
                  <Button
                    onClick={handleNextLevel}
                    className="flex-1 bg-primary text-black hover:bg-cyan-400 h-12 uppercase tracking-wide text-xs font-bold"
                  >
                    {level.id < 5 ? 'Initialize Next Node' : 'Finalize Session'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple SVG Waveform component for visual flair
const ActivityGraph = ({ className }) => (
  <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 15H10L15 5L20 25L25 10L30 20L35 15H100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
  </svg>
);

export default QuantumGame;
