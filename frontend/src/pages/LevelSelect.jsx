import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Cpu, Home, Atom, Shield, Terminal, Zap, Info, ChevronRight, Activity, Lock, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LEVELS } from '../mock';
import GameContainer from '../components/layout/GameContainer';
import { cn } from '../lib/utils';

// Helper for Starmap Node positions
const NODE_POSITIONS = {
  1: { x: 15, y: 65, label: "INIT" },
  2: { x: 35, y: 25, label: "SUPERP" },
  3: { x: 55, y: 55, label: "ENTANG" },
  4: { x: 75, y: 20, label: "DANCE" },
  5: { x: 90, y: 60, label: "MASTER" },
};

const BentoCard = ({ children, className, title, icon: Icon, delay = 0 }) => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "glass-morphism-pro rounded-xl overflow-hidden relative group border-white/5",
        "animate-fade-in opacity-0 transition-q-snap magnetic-flux-glow",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
    <div className="p-4 flex flex-col h-full">
      {(title || Icon) && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="h-4 w-4 text-q-flux/60" />}
          {title && <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">{title}</h3>}
          <div className="ml-auto h-[1px] flex-1 bg-white/5" />
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
    </div>
  );
};

const StarmapNode = ({ level, position, active, hovered, onHover, onClick, isUnlocked, isCompleted, grade }) => {
  return (
    <div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 transition-q-snap z-20",
        isUnlocked ? "cursor-pointer" : "opacity-30 pointer-events-none"
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onMouseEnter={() => isUnlocked && onHover(level.id)}
      onMouseLeave={() => isUnlocked && onHover(null)}
      onClick={() => isUnlocked && onClick(level.id)}
    >
      <div className="relative">
        {/* Connection Pulse */}
        {active && (
          <div className="absolute inset-0 bg-q-flux/20 rounded-full animate-ping scale-150" />
        )}

        {/* Node Base */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-q-snap",
          "glass-morphism-pro border-2 relative",
          active || hovered
            ? "border-q-flux shadow-[0_0_20px_rgba(0,245,255,0.4)] scale-110"
            : isCompleted ? "border-q-flux/60 shadow-[0_0_15px_rgba(0,245,255,0.2)]" : "border-q-flux/20 bg-q-void/80"
        )}>
          {isUnlocked ? (
            <Atom className={cn(
              "h-6 w-6 transition-colors",
              active || hovered ? "text-q-flux animate-spin-slow" : isCompleted ? "text-q-flux" : "text-q-flux/40"
            )} />
          ) : (
            <Lock className="h-4 w-4 text-white/20" />
          )}

          {/* Mastery Signature */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-q-flux flex items-center justify-center border border-q-void z-30 animate-pulse shadow-[0_0_10px_var(--q-flux)]">
              <Check className="h-2 w-2 text-q-void font-bold" />
            </div>
          )}
        </div>

        {/* Label */}
        <div className={cn(
          "absolute top-full mt-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md",
          "bg-q-void/90 border border-white/5 backdrop-blur-md transition-q-snap",
          active || hovered ? "opacity-100 translate-y-0" : "opacity-40 -translate-y-1"
        )}>
          <span className="text-[9px] font-mono whitespace-nowrap tracking-widest text-white uppercase">
            {position.label || `NODE_${level.id}`}
          </span>
        </div>
      </div>
    </div>
  );
};

const LevelSelect = () => {
  const navigate = useNavigate();
  const [hoveredLevelId, setHoveredLevelId] = useState(null);
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [completedLevels, setCompletedLevels] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('completedLevels') || '{}');
    setCompletedLevels(data);
  }, []);

  const totalCompleted = Object.keys(completedLevels).length;
  const syncPercentage = Math.round((totalCompleted / LEVELS.length) * 100);
  const unlockedLevels = Math.min(LEVELS.length, totalCompleted + 1);

  const [logs, setLogs] = useState([
    "INITIATING_QUANTUM_HUD...",
    "SECTOR_MAP_RENDERED: 100%",
    "NEURAL_LINK_STABLE",
    `PROGRESS_LOGGED: ${totalCompleted}/${LEVELS.length} SECTORS_CLEAR`
  ]);

  useEffect(() => {
    if (hoveredLevelId) {
      setLogs(prev => [...prev.slice(-3), `SCANNING_SECTOR_${hoveredLevelId}...`]);
    }
  }, [hoveredLevelId]);

  const hoveredLevel = useMemo(() =>
    LEVELS.find(l => l.id === (hoveredLevelId || activeLevelId)),
    [hoveredLevelId, activeLevelId]
  );

  const handlePlay = (id) => {
    navigate(`/game/${id}`);
  };

  return (
    <GameContainer title="Neural Matrix" subtitle="Sector Selection Protocol">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-160px)] min-h-[600px]">

        {/* Left Panel: Profile & Intel */}
        <div className="col-span-12 lg:col-span-3 row-span-12 flex flex-col gap-4 h-full overflow-hidden">
          <BentoCard title="Operator Status" icon={Shield} className="row-span-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-q-flux/20 flex items-center justify-center relative p-1">
                 <div className="absolute inset-0 border-t-2 border-q-flux rounded-full animate-spin-slow" />
                 <div className="w-full h-full bg-q-flux/10 rounded-full flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-q-flux" />
                 </div>
              </div>
              <div>
                <div className="text-xl font-bold font-orbitron text-white">bufferwise</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-q-flux transition-all duration-1000" style={{ width: `${syncPercentage}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-q-flux">{syncPercentage}% SYNC</span>
                </div>
              </div>
            </div>
              <div className="flex gap-4 mt-6 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <div className="flex flex-col">
                  <span>Progress</span>
                  <span className="text-white mt-1">{totalCompleted.toString().padStart(2, '0')}/{LEVELS.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                   <span>XP</span>
                   <span className="text-q-entangle mt-1">{totalCompleted * 400}</span>
                </div>
              </div>
          </BentoCard>

          <BentoCard title="Sector Intelligence" icon={Info} className="flex-1 overflow-hidden flex flex-col">
            {hoveredLevel ? (
              <div className="space-y-4 flex flex-col h-full">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tighter">
                    {hoveredLevel.name}
                  </h2>
                  <p className="text-[10px] text-white/30 font-mono mt-1">SECTOR_ID: 00{hoveredLevel.id}</p>
                </div>

                <p className="text-xs text-white/60 leading-relaxed italic">
                  "{hoveredLevel.description}"
                </p>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/30">DIFFICULTY</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-sm border",
                      hoveredLevel.difficulty === 'Easy' ? "text-green-400 border-green-500/20 bg-green-500/5" :
                      hoveredLevel.difficulty === 'Medium' ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/5" :
                      "text-red-400 border-red-500/20 bg-red-500/5"
                    )}>
                      {hoveredLevel.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/30">QUBITS</span>
                    <span className="text-white">{hoveredLevel.numQubits} UNIT</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/30">ENERGY_CAP</span>
                    <span className="text-q-flux">{hoveredLevel.maxMoves} OPS</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                   <div className="text-[9px] font-mono text-white/30 mb-2">AUTH_GATES:</div>
                   <div className="flex flex-wrap gap-1.5">
                      {hoveredLevel.availableGates.map(gate => (
                        <span key={gate} className="px-2 py-1 text-[9px] bg-white/5 border border-white/10 rounded font-mono text-q-flux">
                          {gate}
                        </span>
                      ))}
                   </div>
                </div>

                <Button
                  onClick={() => handlePlay(hoveredLevel.id)}
                  className={cn(
                    "w-full mt-4 bg-q-flux/10 hover:bg-q-flux border border-q-flux/40 text-q-flux hover:text-q-void transition-all duration-500 py-6 uppercase font-bold tracking-[0.2em] text-[11px] rounded-xl relative group overflow-hidden",
                    completedLevels[hoveredLevel.id] && "shadow-[0_0_25px_rgba(0,245,255,0.3)] border-q-flux"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {completedLevels[hoveredLevel.id] ? "RE-STABILIZE PROTOCOL" : "Initialize Protocol"}
                    <Play className="h-3 w-3 fill-current" />
                  </div>
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-[10px] font-mono animate-pulse">
                WAITING_FOR_SCAN...
              </div>
            )}
          </BentoCard>
        </div>

        {/* Main Center Section: Starmap */}
        <div className="col-span-12 lg:col-span-9 row-span-12 flex flex-col gap-4 h-full">
          <BentoCard title="Quantum Starmap Matrix" icon={Activity} className="flex-[3] relative overflow-hidden">
            {/* Investigation Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-q-void/40"
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '80px 80px'
              }}
            />

            <div className="relative w-full h-full min-h-[400px]">
              {/* Connections Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                   <linearGradient id="flux-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(0, 245, 255, 0)" />
                      <stop offset="50%" stopColor="rgba(0, 245, 255, 0.5)" />
                      <stop offset="100%" stopColor="rgba(0, 245, 255, 0)" />
                   </linearGradient>
                </defs>
                {/* Connections paths based on NODE_POSITIONS */}
                {[1, 2, 3, 4].map(id => {
                  const start = NODE_POSITIONS[id];
                  const end = NODE_POSITIONS[id+1];
                  return (
                    <g key={`conn-${id}`}>
                      <line
                        x1={`${start.x}%`} y1={`${start.y}%`}
                        x2={`${end.x}%`} y2={`${end.y}%`}
                        stroke="rgba(0, 245, 255, 0.1)" strokeWidth="1"
                      />
                      <line
                        x1={`${start.x}%`} y1={`${start.y}%`}
                        x2={`${end.x}%`} y2={`${end.y}%`}
                        stroke="url(#flux-gradient)" strokeWidth="2"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Level Nodes */}
              {LEVELS.map((level, idx) => (
                <StarmapNode
                  key={level.id}
                  level={level}
                  position={NODE_POSITIONS[level.id]}
                  active={activeLevelId === level.id}
                  hovered={hoveredLevelId === level.id}
                  onHover={setHoveredLevelId}
                  onClick={(id) => {
                    setActiveLevelId(id);
                    setLogs(prev => [...prev.slice(-3), `ACCESSING_SECTOR_${id}..._LOCKED_IN`]);
                  }}
                  isUnlocked={idx < unlockedLevels}
                  isCompleted={!!completedLevels[level.id]}
                  grade={completedLevels[level.id]?.grade}
                />
              ))}

              {/* Scanning Box Ornament (follows hovered level if exists) */}
              <div
                className={cn(
                  "absolute pointer-events-none border border-q-flux/20 transition-all duration-700 ease-out z-0 rounded-2xl",
                  hoveredLevelId ? "opacity-100" : "opacity-0"
                )}
                style={{
                  left: hoveredLevelId ? `${NODE_POSITIONS[hoveredLevelId].x}%` : '50%',
                  top: hoveredLevelId ? `${NODE_POSITIONS[hoveredLevelId].y}%` : '50%',
                  width: '160px',
                  height: '160px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-q-flux" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-q-flux" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-q-flux" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-q-flux" />
              </div>
            </div>
          </BentoCard>

          {/* Bottom Feed Removed */}
        </div>
      </div>

      {/* Navigation Footer Shortcut */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-white/20 hover:text-q-flux hover:bg-white/5 tracking-[0.4em] font-mono text-[9px] uppercase gap-2 group border border-white/5 backdrop-blur-xl px-6 rounded-full transition-q-snap superposition-jitter"
        >
          <Home className="h-3 w-3 transition-q-snap group-hover:-translate-x-1" />
          Terminate Connection
        </Button>
      </div>
    </GameContainer>
  );
};

export default LevelSelect;
