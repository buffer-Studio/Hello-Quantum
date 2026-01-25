import React, { useMemo } from 'react';

const NebulaBackdrop = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-q-void z-0">
      {/* Deep Space Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-q-entangle/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-q-rose/5 blur-[120px] rounded-full" />

      {/* SVG Particles */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={p.left}
            cy={p.top}
            r={p.size}
            fill="var(--q-flux)"
            fillOpacity={p.opacity}
            style={{
              animation: `float-particle ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes float-particle {
          0% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, 40px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default NebulaBackdrop;
