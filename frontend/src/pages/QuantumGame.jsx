import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Zap, RotateCcw, ArrowLeft, Lightbulb, Trophy, Cpu, Target, ChevronRight, Activity, Shield, Terminal, Atom } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';
import { toast } from '../hooks/use-toast';
import QubitVisualizer from '../components/QubitVisualizer';
import GatePanel from '../components/GatePanel';
import GameContainer from '../components/layout/GameContainer';
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
  const [impactInfo, setImpactInfo] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

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
      }
    }
  }, [currentState, level]);



  useEffect(() => {
    if (isComplete && level) {
      const efficiency = (level.maxMoves / Math.max(1, moveCount)) * 100;
      let grade = "INITIATE";
      if (efficiency >= 90) grade = "QUANTUM MASTER";
      else if (efficiency >= 70) grade = "SENIOR OPERATOR";

      const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '{}');
      completedLevels[level.id] = {
        efficiency,
        grade,
        moves: moveCount,
        timestamp: Date.now()
      };
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels));

    }
  }, [isComplete, level, moveCount]);

  useEffect(() => {
    const handleImpact = (e) => {
      const { qubitIndex, gate } = e.detail;
      setImpactInfo({ qubitIndex, gate });
      setIsShaking(true);



      setTimeout(() => setImpactInfo(null), 800);
      setTimeout(() => setIsShaking(false), 300);
    };

    window.addEventListener('quantum-impact', handleImpact);
    return () => window.removeEventListener('quantum-impact', handleImpact);
  }, []);

  const handleReset = () => {
    setCurrentState([...level.initialState]);
    setMoveCount(0);
    setIsComplete(false);
    setSelectedQubit(null);
    setSelectedGate(null);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="p-8 glass-morphism-pro border-q-rose/30 text-center space-y-4">
          <p className="text-q-rose text-xl font-orbitron tracking-widest uppercase">Critical_System_Failure</p>
          <p className="text-white/40 font-mono text-xs uppercase">Sector_Nodes_Not_Found</p>
          <Button onClick={() => navigate('/levels')} className="bg-q-rose hover:bg-rose-600 text-white font-bold tracking-widest">
            ABORT_MISSION
          </Button>
        </div>
      </div>
    );
  }

  const stabilityPercentage = Math.max(0, 100 - (moveCount / level.maxMoves) * 100);

  return (
    <div className={`transition-transform duration-100 ${isShaking ? 'translate-x-1 translate-y-1' : ''}`}>
      <GameContainer title={level.name} subtitle={`SECTOR_${level.id.toString().padStart(2, '0')} // ${level.difficulty}`}>

        {/* PEAK_HUD: Quantum Stability & Metrics */}
        <div className="max-w-7xl mx-auto mb-6 md:mb-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <Card className="col-span-2 md:col-span-1 glass-morphism-pro p-4 border-white/5 flex items-center gap-6 overflow-hidden relative group">
             {/* 2D Stability Indicator Replacement */}
             <div className="relative w-24 h-24 shrink-0 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
               <Zap className={`h-10 w-10 ${stabilityPercentage > 50 ? 'text-q-flux' : 'text-q-rose'} animate-pulse`} />
             </div>

             <div className="flex-1 space-y-1">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Operations_Sync</span>
                <div className="flex items-end gap-1">
                  <span className={`text-2xl font-bold font-orbitron ${moveCount > level.maxMoves ? 'text-q-rose' : 'text-q-flux'}`}>
                    {moveCount.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-white/20 pb-1">/ {level.maxMoves}</span>
                </div>
                <div className="flex items-center gap-1 text-[8px] font-mono text-white/40">
                   <Activity className="h-2 w-2 text-q-flux" />
                   {stabilityPercentage > 50 ? 'COHERENCE_OPTIMAL' : 'INTERFERENCE_DETECTED'}
                </div>
             </div>
          </Card>

          <Card className="glass-morphism-pro p-4 border-white/5 flex flex-col justify-center relative group">
             <div className="absolute top-2 right-2 flex gap-1">
               <div className="w-1 h-1 rounded-full bg-q-entangle animate-pulse" />
             </div>
             <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">State_Integrity</span>
             <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-orbitron text-q-entangle uppercase tracking-widest">
                  {isComplete ? 'Stabilized' : 'Fluctuating'}
                </span>
                <Shield className="h-4 w-4 text-q-entangle/40" />
             </div>
             <div className="h-0.5 w-full bg-white/5 mt-3 overflow-hidden">
                <div
                  className="h-full bg-q-entangle transition-all duration-1000 shadow-[0_0_10px_var(--q-entangle)]"
                  style={{ width: isComplete ? '100%' : '20%' }}
                />
             </div>
          </Card>

          <Card className="hidden md:flex glass-morphism-pro p-4 border-white/5 flex-col justify-center">
             <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Hardware_Nodes</span>
             <span className="text-lg font-bold text-white font-orbitron tracking-tighter uppercase truncate">{level.numQubits} Qubit_Array_v4</span>
             <div className="flex gap-1 mt-2">
               {Array.from({ length: level.numQubits }).map((_, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-sm bg-q-flux/20 border border-q-flux/40" />
               ))}
             </div>
          </Card>

{/* Active Protocol Card Removed */}
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="max-w-7xl mx-auto mb-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-morphism-pro p-1 rounded-2xl bg-gradient-to-r from-q-flux/20 via-transparent to-q-entangle/20">
              <div className="bg-black/80 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Lightbulb className="h-32 w-32 text-q-flux" />
                </div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="p-4 rounded-xl bg-q-flux/10 border border-q-flux/20 text-q-flux">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-q-flux font-orbitron font-bold uppercase tracking-[0.3em] text-xs underline underline-offset-8 decoration-q-flux/30">Intelligence_Brief</h3>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <p className="text-white/60 font-mono text-xs leading-relaxed max-w-4xl italic">
                      {level.tutorial}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTutorial(false)}
                    className="font-orbitron text-[10px] tracking-widest text-q-flux/60 hover:text-q-flux border border-white/5 bg-white/5"
                  >
                    ACKNOWLEDGE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative h-full">

          {/* Dynamic Impact Glow Overlay */}
          {impactInfo && (
            <div
              className="fixed pointer-events-none z-50 rounded-full bg-q-flux/10 blur-[100px] animate-ping"
              style={{
                top: `${(impactInfo.qubitIndex * 120 + 250)}px`,
                left: '20%',
                width: '80vw',
                height: '80vw',
                maxWidth: '400px',
                maxHeight: '400px'
              }}
            />
          )}

          {/* Left: Component Analysis */}
          <div className="lg:col-span-4 h-full">
            <div className="glass-morphism-pro p-6 rounded-2xl border-white/5 relative group h-full">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-q-flux animate-pulse" />
                  <h2 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-[0.3em]">Source_Array</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-q-flux/5 rounded border border-q-flux/20">
                  <div className="w-1 h-1 rounded-full bg-q-flux animate-pulse" />
                  <span className="font-mono text-[8px] text-q-flux uppercase tracking-widest">Live_Feed</span>
                </div>
              </div>

              <QubitVisualizer
                state={currentState}
                numQubits={level.numQubits}
                selectedQubit={selectedQubit}
                onQubitSelect={setSelectedQubit}
              />

              <div className="mt-12 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-2 mb-4">
                    <Terminal className="h-3 w-3 text-q-flux/40" />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Quantum_State_Vector</span>
                 </div>
                 <div className="p-4 glass bg-black/60 rounded-xl border border-white/5 font-mono text-[10px] text-white/40 break-all leading-relaxed relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-q-flux/5 to-transparent pointer-events-none" />
                    <span className="text-q-flux mr-2">$</span>
                    {stateToString(currentState, level.numQubits).replace(/\+/g, ' + ')}
                 </div>
              </div>
            </div>
          </div>

          {/* Center: Instruction Forge */}
          <div className="lg:col-span-4">
            <GatePanel
              availableGates={level.availableGates}
              numQubits={level.numQubits}
              currentState={currentState}
              onStateChange={(newState, data) => {
                setCurrentState(newState);
                setMoveCount(m => m + 1);
              }}
              selectedQubit={selectedQubit}
              setSelectedQubit={setSelectedQubit}
              selectedGate={selectedGate}
              setSelectedGate={setSelectedGate}
              disabled={isComplete || moveCount >= level.maxMoves}
            />

            <div className="mt-8 flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 glass-morphism-pro border-white/5 hover:border-q-rose/40 hover:bg-q-rose/5 text-xs font-orbitron tracking-widest uppercase transition-all duration-300 group h-12"
              >
                <RotateCcw className="mr-2 h-3 w-3 group-hover:rotate-[-180deg] transition-transform duration-500" />
                Flush_Cache
              </Button>
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                className="w-14 glass-morphism-pro border-white/5 hover:border-q-flux/40 hover:bg-q-flux/5 text-q-flux transition-all duration-300 h-12"
              >
                <Lightbulb className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right: Objective Blueprint */}
          <div className="lg:col-span-4 h-full">
            <div className="glass-morphism-pro p-6 rounded-2xl border-white/5 relative group h-full">
               <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-q-entangle" />
                  <h2 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-[0.3em]">Target</h2>
                </div>
              </div>

              <QubitVisualizer
                state={level.targetState}
                numQubits={level.numQubits}
                isTarget={true}
              />

              <div className="mt-12 pt-8 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-2 mb-4">
                    <Terminal className="h-3 w-3 text-q-entangle/40" />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Target_Checksum</span>
                 </div>
                 <div className="p-4 glass bg-black/60 rounded-xl border border-white/5 font-mono text-[10px] text-white/20 break-all leading-relaxed">
                    <span className="text-q-entangle mr-2">#</span>
                    {stateToString(level.targetState, level.numQubits).replace(/\+/g, ' + ')}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Victory/Defeat Protocol Overlay */}
        {isComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-q-void/95 backdrop-blur-xl animate-in fade-in duration-700" />

            {/* Singularity Particle Explosion */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(60)].map((_, i) => {
                const angle = (i / 60) * Math.PI * 2;
                const distance = 300 + Math.random() * 500;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--q-flux)' : 'var(--q-rose)',
                      boxShadow: i % 2 === 0 ? '0 0 15px var(--q-flux)' : '0 0 15px var(--q-rose)',
                      '--tx': `${tx}px`,
                      '--ty': `${ty}px`,
                      opacity: 0,
                      animation: `singularity-particle ${1.5 + Math.random()}s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`,
                      animationDelay: `${Math.random() * 0.8}s`
                    }}
                  />
                );
              })}
            </div>

            <Card className="relative w-full max-w-2xl bg-q-void/50 border-white/5 overflow-hidden animate-q-snap shadow-[0_0_100px_rgba(0,245,255,0.1)] p-1">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-q-flux to-transparent animate-scan" />
              <div className="bg-[#020408]/90 rounded-2xl p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-q-flux/10 border border-q-flux/20 mb-8 animate-quantum-pulse">
                  <Trophy className="h-12 w-12 text-q-flux" />
                </div>

                <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-2 tracking-tighter">
                  SINGULARITY_ACHIEVED
                </h1>
                <p className="font-mono text-q-flux text-sm tracking-[0.3em] uppercase mb-12">
                  Sector_{level.id.toString().padStart(2, '0')}_Synchronized
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="glass-morphism-pro p-6 rounded-xl border-white/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-q-flux/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="block text-[10px] font-mono text-white/40 uppercase mb-2">Stability Grade</span>
                    <span className={cn(
                      "text-lg font-orbitron font-bold tracking-tight",
                      moveCount <= level.maxMoves ? "text-q-flux" :
                      moveCount <= level.maxMoves * 1.5 ? "text-q-entangle" : "text-q-rose"
                    )}>
                      {moveCount <= level.maxMoves ? "QUANTUM MASTER" :
                       moveCount <= level.maxMoves * 1.5 ? "SENIOR OPERATOR" : "INITIATE"}
                    </span>
                  </div>
                  <div className="glass-morphism-pro p-6 rounded-xl border-white/5">
                    <span className="block text-[10px] font-mono text-white/40 uppercase mb-2">Neural Efficiency</span>
                    <span className="text-2xl font-orbitron font-bold text-white">
                      {Math.max(0, Math.round((level.maxMoves / Math.max(1, moveCount)) * 100))}%
                    </span>
                  </div>
                  <div className="glass-morphism-pro p-6 rounded-xl border-white/5">
                    <span className="block text-[10px] font-mono text-white/40 uppercase mb-2">Complexity</span>
                    <span className="text-2xl font-orbitron font-bold text-white">
                      {level.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Neural Recap: Concept Mastery */}
                <div className="mb-12 text-left bg-white/5 rounded-xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-4 w-4 text-q-flux" />
                    <h3 className="text-xs font-mono text-white/60 uppercase tracking-widest">Neural Recap: Mastery_Logged</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {level.numQubits > 1 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-q-entangle/10 border border-q-entangle/20 text-q-entangle text-[9px] font-mono rounded-lg uppercase">
                        <Atom className="h-3 w-3" />
                        ENTANGLEMENT_FORGED
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-q-flux/10 border border-q-flux/20 text-q-flux text-[9px] font-mono rounded-lg uppercase">
                      <Zap className="h-3 w-3" />
                      SUPERPOSITION_STABILIZED
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 text-[9px] font-mono rounded-lg uppercase">
                      <Shield className="h-3 w-3" />
                      COHERENCE_SHIELD_ACTIVE
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={handleNextLevel}
                    className="flex-1 bg-q-flux hover:bg-cyan-400 text-black font-orbitron font-bold h-14 tracking-widest uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(0,245,255,0.3)] group"
                  >
                    Proceed_To_Next_Sector
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => navigate('/levels')}
                    variant="outline"
                    className="flex-1 border-white/10 hover:bg-white/5 text-white font-orbitron font-bold h-14 tracking-widest uppercase rounded-xl"
                  >
                    Return_To_Matrix
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {moveCount >= level.maxMoves && !isComplete && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-700">
            <div className={`relative p-[1px] rounded-2xl bg-gradient-to-br from-q-rose to-red-900 animate-quantum-pulse max-w-lg w-full`}>
              <Card className="bg-[#020408] border-none p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <Atom className={`absolute -bottom-20 -right-20 h-64 w-64 text-q-rose opacity-[0.03] rotate-12`} />

                <div className="relative z-10">
                  <div className={`p-6 glass-morphism-pro rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,45,85,0.2)]`}>
                    <Zap className="h-10 w-10 text-q-rose" />
                  </div>

                  <h2 className="text-4xl font-orbitron font-bold text-white uppercase tracking-tighter mb-2"> Protocol_Failure </h2>
                  <p className={`text-q-rose font-mono text-[10px] uppercase tracking-[0.4em] mb-10`}> Maximum_Operations_Exceeded </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                     <div className="p-6 glass-morphism-pro border-white/5 rounded-2xl text-center">
                        <span className="block text-[10px] font-mono text-white/20 uppercase mb-2">Rating</span>
                        <span className="text-2xl font-orbitron font-bold text-q-rose tracking-widest"> F_RANK </span>
                     </div>
                     <div className="p-6 glass-morphism-pro border-white/5 rounded-2xl text-center">
                        <span className="block text-[10px] font-mono text-white/20 uppercase mb-2">Operations</span>
                        <span className={`text-2xl font-orbitron font-bold text-q-rose`}>
                          {moveCount} <span className="text-xs text-white/20">/ {level.maxMoves}</span>
                        </span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button onClick={handleReset} className="w-full bg-q-rose hover:bg-rose-600 text-white font-orbitron font-bold h-16 tracking-widest uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(255,0,110,0.3)]">
                      Retry_Operation
                    </Button>
                    <Button onClick={() => navigate('/levels')} variant="ghost" className="w-full text-white/20 hover:text-white font-mono text-[9px] uppercase tracking-widest h-12">
                      Return_To_Command_Center
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

      </GameContainer>
    </div>
  );
};export default QuantumGame;
