import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const SystemCommandStream = () => {
    const location = useLocation();
    const [logs, setLogs] = useState([
        "[OK] SYSTEM_BOOT: Quantum_OS v4.0.2 stabilized.",
        "[OK] ARCHITECT_YUVRAJ: Connection established."
    ]);

    const addLog = useCallback((message) => {
        setLogs(prev => [...prev.slice(-5), message]);
    }, []);

    useEffect(() => {
        const handleLog = (e) => {
            if (e.detail && e.detail.message) {
                addLog(e.detail.message);
            }
        };

        window.addEventListener('system-log', handleLog);
        return () => window.removeEventListener('system-log', handleLog);
    }, [addLog]);

    useEffect(() => {
        const path = location.pathname;
        let newMessage = "";

        if (path === "/") {
            newMessage = "[OK] ARCHITECT_YUVRAJ: Monitoring landing zone alpha.";
        } else if (path === "/levels") {
            newMessage = "[OK] ARCHITECT_YUVRAJ: Calibrating level_matrix_nodes.";
        } else if (path.startsWith("/game/")) {
            const level = path.split("/").pop();
            newMessage = `[OK] ARCHITECT_YUVRAJ: Initializing simulation_sector_${level}.`;
        }

        if (newMessage) {
            addLog(newMessage);
        }
    }, [location, addLog]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-80 pointer-events-none">
            <div className="glass-morphism-pro p-3 rounded-xl border-white/5 space-y-2 select-none shadow-2xl backdrop-blur-xl bg-black/40">
                <div className="flex items-center justify-between font-mono text-[8px] text-q-flux/40 uppercase tracking-widest border-b border-white/5 pb-1">
                    <span className="flex items-center gap-1">
                        <Terminal className="h-2 w-2" />
                        Live_Command_Stream
                    </span>
                    <span className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-q-flux animate-pulse" />
                    </span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-left">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 transition-q-snap animate-fade-in">
                            <span className="text-q-flux/40">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className={log.includes("[SUCCESS]") ? "text-q-flux font-orbitron font-bold animate-pulse tracking-tight" : "text-white/90 leading-tight"}>
                                {log.includes("[SUCCESS]") ? (
                                    log
                                ) : log.includes("ARCHITECT_YUVRAJ") ? (
                                    <>
                                        ARCHITECT_
                                        <span className="text-q-flux font-bold decoration-q-flux/30 underline underline-offset-2">YUVRAJ</span>
                                        {log.split("ARCHITECT_YUVRAJ")[1]}
                                    </>
                                ) : log}
                            </span>
                        </div>
                    ))}
                    <div className="flex gap-2 animate-pulse">
                        <span className="opacity-20 text-white">{'>'}</span>
                        <div className="w-1.5 h-2.5 bg-q-flux/40" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemCommandStream;
