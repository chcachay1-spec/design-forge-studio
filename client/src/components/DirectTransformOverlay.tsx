import React from 'react';

export type ResizeHandle = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right';

export type CornerRadiusHandle = 
  | 'corner-tl' 
  | 'corner-tr' 
  | 'corner-bl' 
  | 'corner-br';

export type PaddingEdge = 'pad-top' | 'pad-bottom' | 'pad-left' | 'pad-right';

interface DirectTransformOverlayProps {
  onStartResize: (handle: ResizeHandle, e: React.MouseEvent) => void;
  onStartRadius: (handle: CornerRadiusHandle, e: React.MouseEvent) => void;
  onStartPadding?: (edge: PaddingEdge, e: React.MouseEvent) => void;
  borderRadius?: string;
  padding?: string;
  nodeName: string;
}

export const DirectTransformOverlay: React.FC<DirectTransformOverlayProps> = ({
  onStartResize,
  onStartRadius,
  onStartPadding,
  borderRadius: _borderRadius,
  padding: _padding,
  nodeName: _nodeName,
}) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-30 select-none"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Outer bounding box glow outline */}
      <div className="absolute -inset-[2px] border-2 border-cyan-400/90 rounded-[inherit] shadow-[0_0_12px_rgba(6,182,212,0.4)] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. EDGE RESIZE HANDLES (Estirar / Encoger Caras con el Ratón)              */}
      {/* ========================================================================= */}

      {/* Top Edge */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('top', e); }}
        className="absolute -top-1.5 left-3 right-3 h-3 cursor-ns-resize pointer-events-auto flex items-center justify-center group"
        title="Arrastra para cambiar Alto (Arriba)"
      >
        <div className="w-8 h-1 rounded-full bg-cyan-400 group-hover:bg-cyan-200 group-hover:h-1.5 shadow-[0_0_8px_#22d3ee] transition-all" />
      </div>

      {/* Bottom Edge */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('bottom', e); }}
        className="absolute -bottom-1.5 left-3 right-3 h-3 cursor-ns-resize pointer-events-auto flex items-center justify-center group"
        title="Arrastra para cambiar Alto (Abajo)"
      >
        <div className="w-8 h-1 rounded-full bg-cyan-400 group-hover:bg-cyan-200 group-hover:h-1.5 shadow-[0_0_8px_#22d3ee] transition-all" />
      </div>

      {/* Left Edge */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('left', e); }}
        className="absolute top-3 bottom-3 -left-1.5 w-3 cursor-ew-resize pointer-events-auto flex items-center justify-center group"
        title="Arrastra para cambiar Ancho (Izquierda)"
      >
        <div className="h-8 w-1 rounded-full bg-cyan-400 group-hover:bg-cyan-200 group-hover:w-1.5 shadow-[0_0_8px_#22d3ee] transition-all" />
      </div>

      {/* Right Edge */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('right', e); }}
        className="absolute top-3 bottom-3 -right-1.5 w-3 cursor-ew-resize pointer-events-auto flex items-center justify-center group"
        title="Arrastra para cambiar Ancho (Derecha)"
      >
        <div className="h-8 w-1 rounded-full bg-cyan-400 group-hover:bg-cyan-200 group-hover:w-1.5 shadow-[0_0_8px_#22d3ee] transition-all" />
      </div>

      {/* ========================================================================= */}
      {/* 2. CORNER RESIZE HANDLES (Estirar Ancho y Alto Diagonalmente)            */}
      {/* ========================================================================= */}

      {/* Top-Left Corner */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('top-left', e); }}
        className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
        title="Estirar diagonal (Top-Left)"
      />

      {/* Top-Right Corner */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('top-right', e); }}
        className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
        title="Estirar diagonal (Top-Right)"
      />

      {/* Bottom-Left Corner */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('bottom-left', e); }}
        className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
        title="Estirar diagonal (Bottom-Left)"
      />

      {/* Bottom-Right Corner */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartResize('bottom-right', e); }}
        className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)] cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
        title="Estirar diagonal (Bottom-Right)"
      />

      {/* ========================================================================= */}
      {/* 3. FIGMA-STYLE CORNER RADIUS HANDLES (Tiradores Circulares de Esquinas)    */}
      {/* ========================================================================= */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartRadius('corner-tl', e); }}
        className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_6px_#22d3ee] cursor-crosshair pointer-events-auto hover:scale-150 transition-all flex items-center justify-center"
        title="Arrastra hacia adentro/afuera para cambiar Radio de Esquinas (Border Radius)"
      >
        <div className="w-1 h-1 rounded-full bg-slate-950" />
      </div>

      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartRadius('corner-tr', e); }}
        className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_6px_#22d3ee] cursor-crosshair pointer-events-auto hover:scale-150 transition-all flex items-center justify-center"
        title="Arrastra hacia adentro/afuera para cambiar Radio de Esquinas (Border Radius)"
      >
        <div className="w-1 h-1 rounded-full bg-slate-950" />
      </div>

      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartRadius('corner-bl', e); }}
        className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_6px_#22d3ee] cursor-crosshair pointer-events-auto hover:scale-150 transition-all flex items-center justify-center"
        title="Arrastra hacia adentro/afuera para cambiar Radio de Esquinas (Border Radius)"
      >
        <div className="w-1 h-1 rounded-full bg-slate-950" />
      </div>

      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartRadius('corner-br', e); }}
        className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_6px_#22d3ee] cursor-crosshair pointer-events-auto hover:scale-150 transition-all flex items-center justify-center"
        title="Arrastra hacia adentro/afuera para cambiar Radio de Esquinas (Border Radius)"
      >
        <div className="w-1 h-1 rounded-full bg-slate-950" />
      </div>

      {/* ========================================================================= */}
      {/* 4. INTERIOR PADDING ADJUSTMENT HANDLES (Tiradores Interiores de Relleno)  */}
      {/* ========================================================================= */}
      {onStartPadding && (
        <>
          {/* Top Padding Handle */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); onStartPadding('pad-top', e); }}
            className="absolute top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded bg-pink-600/80 hover:bg-pink-500 border border-pink-300/60 shadow-[0_0_8px_rgba(236,72,153,0.5)] cursor-row-resize pointer-events-auto text-[8px] font-mono text-white opacity-40 hover:opacity-100 transition-all flex items-center gap-0.5"
            title="Arrastra para ajustar Padding Arriba"
          >
            <span>↕ Pad T</span>
          </div>

          {/* Bottom Padding Handle */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); onStartPadding('pad-bottom', e); }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded bg-pink-600/80 hover:bg-pink-500 border border-pink-300/60 shadow-[0_0_8px_rgba(236,72,153,0.5)] cursor-row-resize pointer-events-auto text-[8px] font-mono text-white opacity-40 hover:opacity-100 transition-all flex items-center gap-0.5"
            title="Arrastra para ajustar Padding Abajo"
          >
            <span>↕ Pad B</span>
          </div>

          {/* Left Padding Handle */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); onStartPadding('pad-left', e); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-pink-600/80 hover:bg-pink-500 border border-pink-300/60 shadow-[0_0_8px_rgba(236,72,153,0.5)] cursor-col-resize pointer-events-auto text-[8px] font-mono text-white opacity-40 hover:opacity-100 transition-all flex items-center gap-0.5"
            title="Arrastra para ajustar Padding Izquierda"
          >
            <span>↔ Pad L</span>
          </div>

          {/* Right Padding Handle */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); onStartPadding('pad-right', e); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-pink-600/80 hover:bg-pink-500 border border-pink-300/60 shadow-[0_0_8px_rgba(236,72,153,0.5)] cursor-col-resize pointer-events-auto text-[8px] font-mono text-white opacity-40 hover:opacity-100 transition-all flex items-center gap-0.5"
            title="Arrastra para ajustar Padding Derecha"
          >
            <span>↔ Pad R</span>
          </div>
        </>
      )}
    </div>
  );
};
