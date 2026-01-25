import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Activity } from 'lucide-react';

const BootSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "INITIALIZING_QUANTUM_OS_v4.0...",
    "ESTABLISHING_NEURAL_LINK...",
    "VERIFYING_ENTANGLEMENT_STATES...",
    "CALIBRATING_HADAMARD_GATES...",
    "HANDSHAKE_WITH_QPU_SUCCESSFUL",
    "DECRYPTING_SECTOR_MAPS...",
    "SYSTEM_STABLE: READY_FOR_OPERATOR",
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        setProgress(Math.min(((currentLog + 1) / bootLogs.length) * 100, 100));
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-q-void flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-morphism-pro p-8 rounded-2xl border-q-flux/20 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Activity className="h-12 w-12 text-q-flux" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-q-flux/10 rounded-lg">
              <Cpu className="h-5 w-5 text-q-flux animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron text-sm font-bold tracking-widest text-white uppercase">Initialize Mission</h2>
              <p className="font-mono text-[10px] text-q-flux/60">KERNEL_HASH: 0x7E3...A9B</p>
            </div>
          </div>

          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-q-flux transition-all duration-300 shadow-[0_0_10px_#00F5FF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-black/40 p-4 rounded-lg font-mono text-[11px] h-40 overflow-hidden flex flex-col-reverse justify-end gap-1.5 border border-white/5">
            {logs.slice().reverse().map((log, i) => (
              <div key={i} className="flex gap-2 items-start animate-fade-in">
                <span className="text-q-flux/40">{">"}</span>
                <span className={i === 0 ? "text-q-flux" : "text-white/60"}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center font-mono text-[9px] text-white/20 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              AUTH: GRANTED
            </div>
            <span>v4.0.0-PRO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
