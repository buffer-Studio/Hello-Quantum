import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Zap, RotateCcw, ArrowLeft, Lightbulb, Trophy, Cpu, Terminal, Shield, Activity, Radio, Target } from 'lucide-react';
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
        <Card className="p-8 bg-card border-destructive/50 text-center max-w-md w-full rounded-2xl">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-destructive mb-2 font-display">ERROR 404</h1>
          <p className="text-muted-foreground mb-6">Level Data Corrupted or Missing.</p>
          <Button onClick={() => navigate('/levels')} variant="outline" className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive/10">
            Return to Node Select
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 font-sans selection:bg-primary/30">
      {/* Top Navigation Bar */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <div className="flex items-center justify-between bg-card/30 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-lg">
            <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/levels')}
                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5"
                >
                <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white font-display uppercase leading-none">
                        {level.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`h-2 w-2 rounded-full ${
                            level.difficulty === 'Easy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                            level.difficulty === 'Medium' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                        }`} />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                            {level.difficulty} Protocol
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 px-4">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Operation Cycles</p>
                    <p className="text-xl font-display font-bold text-primary tabular-nums">
                        {String(moveCount).padStart(2, '0')}<span className="text-muted-foreground/50 text-sm">/{String(level.maxMoves).padStart(2, '0')}</span>
                    </p>
                </div>
                <div className="h-10 w-24 relative hidden md:block">
                     <ActivityGraph className="h-full w-full text-primary opacity-50" />
                </div>
            </div>
        </div>
      </div>

      {/* Tutorial/Briefing */}
      {showTutorial && (
        <div className="max-w-[1400px] mx-auto mb-6">
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                 <Terminal className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-primary font-display font-bold text-sm uppercase mb-2 tracking-wider flex items-center gap-2">
                     Mission Briefing
                     <span className="h-px flex-1 bg-primary/20" />
                </h3>
                <p className="text-gray-300 font-light leading-relaxed max-w-3xl">{level.tutorial}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(false)}
                className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs uppercase rounded-lg"
              >
                [ Acknowledge ]
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-250px)] min-h-[600px]">

        {/* Left: Current State (Monitor) */}
        <div className="lg:col-span-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary animate-pulse" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Feed</h2>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Active</span>
            </div>

          <Card className="flex-1 bg-card/50 border-white/5 overflow-hidden rounded-2xl relative group shadow-2xl flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

            <div className="relative z-10 p-6 flex-1 overflow-y-auto custom-scrollbar">
                <QubitVisualizer
                    state={currentState}
                    numQubits={level.numQubits}
                    selectedQubit={selectedQubit}
                    onQubitSelect={setSelectedQubit}
                />
            </div>

            <div className="bg-black/40 backdrop-blur p-4 border-t border-white/5 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground uppercase text-[10px] font-bold">Vector Output</p>
                    <Zap className="h-3 w-3 text-yellow-500" />
                </div>
                <p className="text-primary break-all leading-relaxed opacity-80">
                    {stateToString(currentState, level.numQubits)}
                </p>
            </div>
          </Card>
        </div>

        {/* Center: Controls (Console) */}
        <div className="lg:col-span-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-secondary" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Command Console</h2>
                </div>
            </div>

            <div className="flex-1 mb-4">
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

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-white/10 hover:border-white/30 hover:bg-white/5 text-muted-foreground hover:text-white uppercase tracking-wider text-xs font-bold h-12 rounded-xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset System
            </Button>
            {!showTutorial && (
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 uppercase tracking-wider text-xs font-bold h-12 rounded-xl"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Help
              </Button>
            )}
          </div>
        </div>

        {/* Right: Target State (Objective) */}
        <div className="lg:col-span-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Objective Data</h2>
                </div>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20">Target</span>
            </div>

          <Card className="flex-1 bg-card/50 border-white/5 overflow-hidden rounded-2xl relative shadow-2xl flex flex-col">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
            <div className="relative z-10 p-6 flex-1 overflow-y-auto custom-scrollbar">
                <QubitVisualizer
                state={level.targetState}
                numQubits={level.numQubits}
                isTarget={true}
                />
            </div>
             <div className="bg-black/40 backdrop-blur p-4 border-t border-white/5 font-mono text-xs">
                 <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground uppercase text-[10px] font-bold">Required Vector</p>
                    <Trophy className="h-3 w-3 text-accent" />
                </div>
                <p className="text-accent break-all leading-relaxed opacity-80">
                    {stateToString(level.targetState, level.numQubits)}
                </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Modal - Glassmorphism Style */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl blur opacity-30 animate-pulse"></div>

            <Card className="relative bg-card/90 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 mb-6 border border-accent/20 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                    <Trophy className="h-12 w-12 text-accent" />
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 font-display tracking-tight uppercase">
                    System Override
                </h2>
                <p className="text-muted-foreground mb-8">Quantum state synchronization achieved.</p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-sm mx-auto">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase text-muted-foreground mb-1 font-bold tracking-wider">Status</p>
                        <p className="text-emerald-400 font-display font-bold text-lg">OPTIMAL</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase text-muted-foreground mb-1 font-bold tracking-wider">Efficiency</p>
                        <p className="text-white font-display font-bold text-lg">{moveCount} <span className="text-sm text-muted-foreground font-normal">Cycles</span></p>
                    </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5 h-14 uppercase tracking-wide text-xs font-bold rounded-xl"
                  >
                    Reboot
                  </Button>
                  <Button
                    onClick={handleNextLevel}
                    className="flex-1 bg-primary text-black hover:bg-cyan-400 h-14 uppercase tracking-wide text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
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
    <path d="M0 15H10L15 5L20 25L25 10L30 20L35 15H45L50 8L55 22L60 15H100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default QuantumGame;
