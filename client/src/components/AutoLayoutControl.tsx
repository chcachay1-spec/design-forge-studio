import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Columns, 
  Grid,
  Minus,
  Plus,
  SlidersHorizontal
} from 'lucide-react';
import type { DesignNode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface AutoLayoutControlProps {
  node: DesignNode;
  onUpdateStyle: (nodeId: string, property: string, value: any) => void;
}

export const AutoLayoutControl: React.FC<AutoLayoutControlProps> = ({ node, onUpdateStyle }) => {
  const styles = node.styles || {};
  const isFlex = styles.display === 'flex' || !styles.display || styles.display === 'inline-flex';
  const direction = styles.flexDirection || 'column';
  const justifyContent = styles.justifyContent || 'flex-start';
  const alignItems = styles.alignItems || 'stretch';
  const gap = styles.gap || '0px';

  // Parse padding for independent sides (top, right, bottom, left)
  const parsePadding = () => {
    const p = (styles.padding || '0px').trim();
    const parts = p.split(/\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    if (parts.length === 4) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  };

  const [paddingMode, setPaddingMode] = useState<'uniform' | 'independent'>('uniform');
  const currentPadding = parsePadding();

  // 3x3 Matrix coordinates mapping
  // [row, col] -> alignItems and justifyContent depending on direction
  const matrixPoints = [
    { row: 'start', col: 'start', label: 'Top-Left' },
    { row: 'start', col: 'center', label: 'Top-Center' },
    { row: 'start', col: 'end', label: 'Top-Right' },
    { row: 'center', col: 'start', label: 'Middle-Left' },
    { row: 'center', col: 'center', label: 'Center' },
    { row: 'center', col: 'end', label: 'Middle-Right' },
    { row: 'end', col: 'start', label: 'Bottom-Left' },
    { row: 'end', col: 'center', label: 'Bottom-Center' },
    { row: 'end', col: 'end', label: 'Bottom-Right' },
  ];

  // Helper to check if a 3x3 matrix point is active
  const isPointActive = (row: string, col: string) => {
    if (direction === 'row') {
      const activeJustify = justifyContent === 'flex-start' ? 'start' : justifyContent === 'flex-end' ? 'end' : justifyContent === 'center' ? 'center' : 'start';
      const activeAlign = alignItems === 'flex-start' ? 'start' : alignItems === 'flex-end' ? 'end' : alignItems === 'center' ? 'center' : 'start';
      return activeAlign === row && activeJustify === col;
    } else {
      const activeJustify = justifyContent === 'flex-start' ? 'start' : justifyContent === 'flex-end' ? 'end' : justifyContent === 'center' ? 'center' : 'start';
      const activeAlign = alignItems === 'flex-start' ? 'start' : alignItems === 'flex-end' ? 'end' : alignItems === 'center' ? 'center' : 'start';
      return activeJustify === row && activeAlign === col;
    }
  };

  const handlePointSelect = (row: string, col: string) => {
    soundEngine.playProceduralSound('click');
    if (direction === 'row') {
      const justifyVal = col === 'start' ? 'flex-start' : col === 'end' ? 'flex-end' : 'center';
      const alignVal = row === 'start' ? 'flex-start' : row === 'end' ? 'flex-end' : 'center';
      onUpdateStyle(node.id, 'justifyContent', justifyVal);
      onUpdateStyle(node.id, 'alignItems', alignVal);
    } else {
      const justifyVal = row === 'start' ? 'flex-start' : row === 'end' ? 'flex-end' : 'center';
      const alignVal = col === 'start' ? 'flex-start' : col === 'end' ? 'flex-end' : 'center';
      onUpdateStyle(node.id, 'justifyContent', justifyVal);
      onUpdateStyle(node.id, 'alignItems', alignVal);
    }
  };

  const handleSidePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    const formattedVal = val.trim() === '' ? '0px' : isNaN(Number(val)) ? val : `${val}px`;
    const updated = { ...currentPadding, [side]: formattedVal };
    const newPaddingStr = `${updated.top} ${updated.right} ${updated.bottom} ${updated.left}`;
    onUpdateStyle(node.id, 'padding', newPaddingStr);
  };

  return (
    <div className="space-y-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
          <Columns className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto Layout Pro (Figma Style)</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextDisplay = isFlex ? 'block' : 'flex';
            onUpdateStyle(node.id, 'display', nextDisplay);
            soundEngine.playProceduralSound('switch');
          }}
          className={'text-[10px] px-2 py-0.5 rounded font-medium transition-colors ' + (
            isFlex ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'
          )}
        >
          {isFlex ? 'Activo (Flex)' : 'Inactivo'}
        </button>
      </div>

      {/* Direction & Wrap */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-medium">Dirección</label>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                onUpdateStyle(node.id, 'flexDirection', 'row');
                soundEngine.playProceduralSound('pop');
              }}
              className={'flex-1 py-1 text-[11px] rounded flex items-center justify-center gap-1 transition-all ' + (
                direction === 'row' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              )}
              title="Fila Horizontal (Row)"
            >
              <ArrowRight className="w-3 h-3" />
              <span>Fila</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateStyle(node.id, 'flexDirection', 'column');
                soundEngine.playProceduralSound('pop');
              }}
              className={'flex-1 py-1 text-[11px] rounded flex items-center justify-center gap-1 transition-all ' + (
                direction === 'column' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              )}
              title="Columna Vertical (Column)"
            >
              <ArrowDown className="w-3 h-3" />
              <span>Col</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-medium">Distribución</label>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                onUpdateStyle(node.id, 'justifyContent', 'flex-start');
                soundEngine.playProceduralSound('pop');
              }}
              className={'flex-1 py-1 text-[11px] rounded transition-all ' + (
                justifyContent !== 'space-between' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              )}
              title="Empaquetado (Packed)"
            >
              Packed
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateStyle(node.id, 'justifyContent', 'space-between');
                soundEngine.playProceduralSound('pop');
              }}
              className={'flex-1 py-1 text-[11px] rounded transition-all ' + (
                justifyContent === 'space-between' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              )}
              title="Separación Equitativa (Space Between)"
            >
              Espaciar
            </button>
          </div>
        </div>
      </div>

      {/* 3x3 Alignment Matrix + Gap */}
      <div className="grid grid-cols-2 gap-3 items-center pt-1">
        {/* Visual 3x3 Matrix */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Grid className="w-3 h-3 text-indigo-400" />
            <span>Alineación (3×3)</span>
          </label>
          <div className="w-24 h-24 bg-slate-950 p-1.5 rounded-xl border border-slate-800 grid grid-cols-3 gap-1 shadow-inner">
            {matrixPoints.map((pt, idx) => {
              const active = isPointActive(pt.row, pt.col);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePointSelect(pt.row, pt.col)}
                  className={'w-full h-full rounded-md flex items-center justify-center transition-all ' + (
                    active 
                      ? 'bg-indigo-500 shadow-md ring-2 ring-indigo-400/50' 
                      : 'bg-slate-900/80 hover:bg-slate-800'
                  )}
                  title={pt.label}
                >
                  <div className={'w-1.5 h-1.5 rounded-full transition-all ' + (
                    active ? 'bg-white scale-125' : 'bg-slate-600 group-hover:bg-slate-400'
                  )} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Gap & Wrap */}
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-medium">Espaciado (Gap)</label>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <input
                type="text"
                value={gap}
                onChange={(e) => onUpdateStyle(node.id, 'gap', e.target.value)}
                placeholder="12px"
                className="w-full bg-transparent text-xs text-indigo-200 font-mono focus:outline-none"
              />
            </div>
            {/* Quick Gap Chips */}
            <div className="flex items-center gap-1">
              {['0px', '8px', '16px', '24px'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    onUpdateStyle(node.id, 'gap', g);
                    soundEngine.playProceduralSound('pop');
                  }}
                  className={'text-[9px] px-1.5 py-0.5 rounded font-mono ' + (
                    gap === g ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  )}
                >
                  {g.replace('px', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Stretch Fill toggle */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                const nextAlign = alignItems === 'stretch' ? 'center' : 'stretch';
                onUpdateStyle(node.id, 'alignItems', nextAlign);
                soundEngine.playProceduralSound('switch');
              }}
              className={'w-full py-1 text-[10px] rounded border font-medium transition-colors ' + (
                alignItems === 'stretch'
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              )}
            >
              {alignItems === 'stretch' ? '↔ Estirar Hijos (Stretch ON)' : '↔ Estirar Hijos (Stretch OFF)'}
            </button>
          </div>
        </div>
      </div>

      {/* Padding Controls: Uniform vs Independent Quadrants */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-medium">Padding (Relleno)</label>
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[9px]">
            <button
              type="button"
              onClick={() => setPaddingMode('uniform')}
              className={'px-1.5 py-0.5 rounded ' + (paddingMode === 'uniform' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400')}
            >
              Uniforme
            </button>
            <button
              type="button"
              onClick={() => setPaddingMode('independent')}
              className={'px-1.5 py-0.5 rounded ' + (paddingMode === 'independent' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400')}
            >
              Lados (T-R-B-L)
            </button>
          </div>
        </div>

        {paddingMode === 'uniform' ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={styles.padding || '0px'}
              onChange={(e) => onUpdateStyle(node.id, 'padding', e.target.value)}
              placeholder="16px"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
            />
            {/* Quick Padding presets */}
            <div className="flex items-center gap-1">
              {['8px', '16px', '24px', '32px'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    onUpdateStyle(node.id, 'padding', p);
                    soundEngine.playProceduralSound('pop');
                  }}
                  className={'text-[9px] px-1.5 py-0.5 rounded font-mono ' + (
                    styles.padding === p ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  )}
                >
                  {p.replace('px', '')}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 font-mono">Arriba (T)</span>
              <input
                type="text"
                value={currentPadding.top}
                onChange={(e) => handleSidePaddingChange('top', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-center font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 font-mono">Derecha (R)</span>
              <input
                type="text"
                value={currentPadding.right}
                onChange={(e) => handleSidePaddingChange('right', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-center font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 font-mono">Abajo (B)</span>
              <input
                type="text"
                value={currentPadding.bottom}
                onChange={(e) => handleSidePaddingChange('bottom', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-center font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 font-mono">Izquierda (L)</span>
              <input
                type="text"
                value={currentPadding.left}
                onChange={(e) => handleSidePaddingChange('left', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-center font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Herramienta de Estirar y Encoger Caras (Ancho y Alto) */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Ajuste Rápido de Caras (Estirar / Encoger)</span>
          </label>
          <span className="text-[9px] text-slate-500 font-mono">±10px</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Ancho */}
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono font-medium">Ancho:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const cur = parseFloat(String(styles.width || '100')) || 100;
                  const next = Math.max(20, Math.round(cur - 10));
                  onUpdateStyle(node.id, 'width', `${next}px`);
                  soundEngine.playProceduralSound('pop');
                }}
                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs border border-slate-800"
                title="Encoger ancho (-10px)"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-[10px] text-cyan-300 font-mono min-w-[36px] text-center">
                {styles.width || 'auto'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const cur = parseFloat(String(styles.width || '100')) || 100;
                  const next = Math.round(cur + 10);
                  onUpdateStyle(node.id, 'width', `${next}px`);
                  soundEngine.playProceduralSound('pop');
                }}
                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs border border-slate-800"
                title="Estirar ancho (+10px)"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Alto */}
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono font-medium">Alto:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const cur = parseFloat(String(styles.height || '40')) || 40;
                  const next = Math.max(16, Math.round(cur - 10));
                  onUpdateStyle(node.id, 'height', `${next}px`);
                  soundEngine.playProceduralSound('pop');
                }}
                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs border border-slate-800"
                title="Encoger alto (-10px)"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-[10px] text-cyan-300 font-mono min-w-[36px] text-center">
                {styles.height || 'auto'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const cur = parseFloat(String(styles.height || '40')) || 40;
                  const next = Math.round(cur + 10);
                  onUpdateStyle(node.id, 'height', `${next}px`);
                  soundEngine.playProceduralSound('pop');
                }}
                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs border border-slate-800"
                title="Estirar alto (+10px)"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
