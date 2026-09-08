import React, { useRef, useEffect, useState } from 'react';
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  Highlighter, 
  X,
  Maximize2
} from 'lucide-react';
import type { DrawingStroke } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface DrawingLayerProps {
  isActive: boolean;
  onClose: () => void;
  strokes: DrawingStroke[];
  onUpdateStrokes: (strokes: DrawingStroke[]) => void;
  isTransformActive?: boolean;
  onToggleTransform?: () => void;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  isActive,
  onClose,
  strokes,
  onUpdateStrokes,
  isTransformActive = false,
  onToggleTransform,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [brushColor, setBrushColor] = useState<string>('#6366f1');
  const [brushWidth, setBrushWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isHighlighter, setIsHighlighter] = useState(false);

  const colors = [
    '#6366f1',
    '#ec4899',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ffffff',
  ];

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    if (currentStroke.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = isEraser 
        ? 'rgba(0,0,0,1)' 
        : isHighlighter 
          ? brushColor + '77'
          : brushColor;
      ctx.lineWidth = isEraser ? brushWidth * 3 : brushWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redrawCanvas();
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isActive]);

  useEffect(() => {
    redrawCanvas();
  }, [strokes, currentStroke, isEraser, isHighlighter, brushColor, brushWidth]);

  if (!isActive) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
    soundEngine.playProceduralSound('pop');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      if (isEraser) {
        const threshold = brushWidth * 4;
        const remaining = strokes.filter(s => {
          return !s.points.some(p1 => 
            currentStroke.some(p2 => Math.hypot(p1.x - p2.x, p1.y - p2.y) < threshold)
          );
        });
        onUpdateStrokes(remaining);
      } else {
        const strokeColor = isHighlighter ? brushColor + '88' : brushColor;
        const newStroke: DrawingStroke = {
          id: 'stroke-' + Date.now(),
          points: currentStroke,
          color: strokeColor,
          width: isHighlighter ? brushWidth * 2.5 : brushWidth,
        };
        onUpdateStrokes([...strokes, newStroke]);
      }
    }
    setCurrentStroke([]);
  };

  const handleClear = () => {
    soundEngine.playProceduralSound('switch');
    onUpdateStrokes([]);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-auto select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={'w-full h-full ' + (isTransformActive ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair ' + (isEraser ? 'cursor-cell' : ''))}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-1.5 px-2.5 shadow-2xl flex items-center gap-2 z-50">
        <div className="flex items-center gap-0.5 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50">
          {onToggleTransform && (
            <button
              onClick={() => {
                onToggleTransform();
                soundEngine.playProceduralSound('switch');
              }}
              className={'px-2 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ' + (
                isTransformActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              )}
              title="Modo Estirar / Encoger: ajusta bordes, esquinas y padding directamente con el ratón"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estirar Caras</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsEraser(false);
              setIsHighlighter(false);
            }}
            className={'px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-all ' + (
              !isEraser && !isHighlighter
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Lápiz de bocetos"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Lápiz</span>
          </button>

          <button
            onClick={() => {
              setIsEraser(false);
              setIsHighlighter(true);
            }}
            className={'px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-all ' + (
              isHighlighter
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Marcador Fluorescente"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Resaltador</span>
          </button>

          <button
            onClick={() => {
              setIsEraser(true);
              setIsHighlighter(false);
            }}
            className={'px-2 py-1 rounded-md text-xs flex items-center gap-1 transition-all ' + (
              isEraser
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Goma de Borrar"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Goma</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800/60" />

        {!isEraser && (
          <div className="flex items-center gap-1">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setBrushColor(c)}
                style={{ backgroundColor: c }}
                className={'w-4 h-4 rounded-full transition-transform border border-slate-700/60 ' + (
                  brushColor === c ? 'scale-125 ring-1 ring-white ring-offset-1 ring-offset-slate-900' : 'hover:scale-110 opacity-80 hover:opacity-100'
                )}
              />
            ))}
          </div>
        )}

        <div className="h-4 w-px bg-slate-800/60" />

        <div className="flex items-center gap-0.5 text-slate-400 text-xs">
          <button
            onClick={() => setBrushWidth(2)}
            className={'px-1.5 py-0.5 rounded text-[10px] ' + (brushWidth === 2 ? 'bg-slate-800 text-white font-medium' : 'hover:text-slate-200')}
          >
            1x
          </button>
          <button
            onClick={() => setBrushWidth(4)}
            className={'px-1.5 py-0.5 rounded text-[10px] ' + (brushWidth === 4 ? 'bg-slate-800 text-white font-medium' : 'hover:text-slate-200')}
          >
            2x
          </button>
          <button
            onClick={() => setBrushWidth(8)}
            className={'px-1.5 py-0.5 rounded text-[10px] ' + (brushWidth === 8 ? 'bg-slate-800 text-white font-medium' : 'hover:text-slate-200')}
          >
            3x
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800/60" />

        <button
          onClick={handleClear}
          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          title="Borrar todos los trazos"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
          title="Salir del Modo Dibujo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
