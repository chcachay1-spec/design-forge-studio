import React from 'react';

interface CanvasRulersProps {
  zoom: number;
  cursorPos?: { x: number; y: number };
}

export const CanvasRulers: React.FC<CanvasRulersProps> = ({ zoom, cursorPos }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none">
      {/* Top Ruler (Horizontal) */}
      <div className="absolute top-0 left-6 right-0 h-6 bg-slate-950/85 backdrop-blur-sm border-b border-slate-800/80 flex items-end">
        <svg className="w-full h-full text-slate-600 font-mono text-[9px]">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = i * 50;
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                <line x1="0" y1="16" x2="0" y2="24" stroke="currentColor" strokeWidth="1" />
                <line x1="25" y1="20" x2="25" y2="24" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                <text x="3" y="14" fill="currentColor" opacity="0.8">
                  {Math.round(x / zoom)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Cursor indicator line X */}
        {cursorPos && (
          <div 
            className="absolute top-0 bottom-0 w-px bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
            style={{ left: `${cursorPos.x}px` }}
          />
        )}
      </div>

      {/* Left Ruler (Vertical) */}
      <div className="absolute top-6 left-0 bottom-0 w-6 bg-slate-950/85 backdrop-blur-sm border-r border-slate-800/80 flex justify-end">
        <svg className="w-full h-full text-slate-600 font-mono text-[9px]">
          {Array.from({ length: 30 }).map((_, i) => {
            const y = i * 50;
            return (
              <g key={i} transform={`translate(0, ${y})`}>
                <line x1="16" y1="0" x2="24" y2="0" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="25" x2="24" y2="25" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                <text x="2" y="10" fill="currentColor" opacity="0.8" transform={`rotate(-90 2 10)`}>
                  {Math.round(y / zoom)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Cursor indicator line Y */}
        {cursorPos && (
          <div 
            className="absolute left-0 right-0 h-px bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
            style={{ top: `${cursorPos.y}px` }}
          />
        )}
      </div>

      {/* Corner Origin Indicator */}
      <div className="absolute top-0 left-0 w-6 h-6 bg-slate-950 border-r border-b border-slate-800 flex items-center justify-center text-[9px] font-mono text-indigo-400 font-bold">
        px
      </div>
    </div>
  );
};
