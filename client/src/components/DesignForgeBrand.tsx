import React from 'react';

export interface BrandIconProps {
  className?: string;
  size?: number;
}

/**
 * Official DesignForge Bolt App Icon (from user design documents)
 */
export const DesignForgeAppIcon: React.FC<BrandIconProps> = ({ className = 'w-6 h-6', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;
  return (
    <div 
      style={style}
      className={
        'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#22242C] via-[#16171C] to-[#0A0A0D] border border-white/15 shadow-[0_4px_16px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden flex-none ' + 
        className
      }
    >
      {/* Ambient purple spotlight halo */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-500/30 blur-md pointer-events-none" />

      <svg 
        viewBox="0 0 100 140" 
        className="w-[68%] h-[68%] relative z-10 drop-shadow-[0_4px_10px_rgba(109,40,217,0.6)]"
      >
        <defs>
          <linearGradient id="dfBoltGradIcon" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#E8DBFF" />
            <stop offset="45%" stopColor="#A574F5" />
            <stop offset="100%" stopColor="#5B1FB8" />
          </linearGradient>
        </defs>
        <path 
          d="M58,2 L22,66 L44,66 L34,138 L80,50 L56,50 Z" 
          fill="url(#dfBoltGradIcon)" 
        />
        <path 
          d="M58,2 L22,66 L44,66" 
          fill="none" 
          stroke="#F6EEFF" 
          strokeWidth="3.5" 
          strokeOpacity="0.9" 
          strokeLinejoin="round" 
          strokeLinecap="round" 
        />
        <path 
          d="M34,138 L80,50 L56,50" 
          fill="none" 
          stroke="#26094F" 
          strokeWidth="2.5" 
          strokeOpacity="0.55" 
          strokeLinejoin="round" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

/**
 * Official DesignForge Monogram: D | F
 */
export const DesignForgeMonogram: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={'inline-flex items-center gap-1.5 font-bold tracking-wider ' + className}>
    <span className="text-[#F2F3F6]">D</span>
    <span className="w-[1px] h-3.5 bg-gradient-to-b from-transparent via-purple-400/60 to-transparent" />
    <span className="text-[#C7A6FF]">F</span>
  </div>
);

/**
 * Full DesignForge Logo with Official Typography & Aesthetic (Pictures folder design)
 */
export const DesignForgeLogo: React.FC<{
  showStudioBadge?: boolean;
  className?: string;
  iconSize?: number;
}> = ({ showStudioBadge = true, className = '', iconSize }) => {
  return (
    <div className={'inline-flex items-center gap-2.5 group cursor-pointer select-none ' + className}>
      <DesignForgeAppIcon size={iconSize} className="w-7 h-7 group-hover:scale-105 transition-transform duration-200" />
      
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-[#F1F2F5]">
            Design<span className="text-[#C7A6FF]">Forge</span>
          </span>
          {showStudioBadge && (
            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 tracking-wider shadow-[0_0_8px_rgba(168,85,247,0.25)]">
              STUDIO
            </span>
          )}
        </div>
        <span className="text-[8px] font-semibold tracking-[2px] text-slate-500 uppercase mt-0.5 font-mono">
          STUDIO v2.5
        </span>
      </div>
    </div>
  );
};