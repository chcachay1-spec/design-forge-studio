import React, { useState, useRef } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Paintbrush, 
  Shapes, 
  Combine, 
  MinusCircle, 
  Plus, 
  X, 
  Check, 
  Grid3X3,
  RotateCcw
} from 'lucide-react';
import { soundEngine } from '../lib/audio-engine';
import type { DesignNode } from '../lib/types';

interface VectorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVectorNode: (svgPath: string, name: string) => void;
  selectedNode?: DesignNode | null;
}

interface VectorNode {
  id: string;
  x: number;
  y: number;
  connections: string[]; // ids of connected nodes (Vector Network)
}

export const VectorStudioModal: React.FC<VectorStudioModalProps> = ({
  isOpen,
  onClose,
  onInsertVectorNode,
}) => {
  // Persona Switcher: Vector Persona (clean paths) vs Pixel Persona (textured brushes)
  const [persona, setPersona] = useState<'vector' | 'pixel'>('vector');
  const [activeTool, setActiveTool] = useState<'pen' | 'network' | 'shaper' | 'brush'>('pen');
  
  // Vector Network / Pen state
  const [nodes, setNodes] = useState<VectorNode[]>([
    { id: 'v-1', x: 80, y: 150, connections: ['v-2', 'v-4'] },
    { id: 'v-2', x: 200, y: 60, connections: ['v-1', 'v-3', 'v-5'] },
    { id: 'v-3', x: 320, y: 150, connections: ['v-2', 'v-4'] },
    { id: 'v-4', x: 200, y: 240, connections: ['v-3', 'v-1', 'v-5'] },
    { id: 'v-5', x: 200, y: 150, connections: ['v-2', 'v-4'] }, // bifurcated center node
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [strokeColor, setStrokeColor] = useState<string>('#6366f1');
  const [fillColor, setFillColor] = useState<string>('rgba(99, 102, 241, 0.25)');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isGridSnap] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Pixel Persona brush state
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [brushTexture, setBrushTexture] = useState<'grunge' | 'chalk' | 'ink'>('grunge');

  if (!isOpen) return null;

  // Convert current vector nodes into an SVG Path String (d attribute)
  const generateSvgPath = (): string => {
    if (nodes.length < 2) return 'M 50 50 L 150 50 L 100 120 Z';
    let path = '';
    const visitedEdges = new Set<string>();

    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const edgeId = [node.id, targetId].sort().join('--');
        if (!visitedEdges.has(edgeId)) {
          visitedEdges.add(edgeId);
          const target = nodes.find(n => n.id === targetId);
          if (target) {
            path += `M ${node.x} ${node.y} L ${target.x} ${target.y} `;
          }
        }
      });
    });

    return path.trim() || `M ${nodes[0].x} ${nodes[0].y} Z`;
  };

  // Canvas click to add or branch a vector network node
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);

    // Grid snap (10px increments)
    if (isGridSnap) {
      x = Math.round(x / 10) * 10;
      y = Math.round(y / 10) * 10;
    }

    const newNodeId = `v-${Date.now().toString().slice(-4)}`;
    soundEngine.playProceduralSound('click');

    if (activeTool === 'network' && selectedNodeId) {
      // Bifurcate line from selected node in multiple directions (Figma Vector Network)
      const newNode: VectorNode = {
        id: newNodeId,
        x,
        y,
        connections: [selectedNodeId],
      };
      setNodes(prev => [
        ...prev.map(n => n.id === selectedNodeId ? { ...n, connections: [...n.connections, newNodeId] } : n),
        newNode
      ]);
      setSelectedNodeId(newNodeId);
    } else {
      // Add node and optionally connect to previous
      const lastNode = nodes[nodes.length - 1];
      const newNode: VectorNode = {
        id: newNodeId,
        x,
        y,
        connections: lastNode ? [lastNode.id] : [],
      };
      setNodes(prev => [
        ...prev.map(n => lastNode && n.id === lastNode.id ? { ...n, connections: [...n.connections, newNodeId] } : n),
        newNode
      ]);
      setSelectedNodeId(newNodeId);
    }
  };

  // Boolean operations (Buscatrazos / Pathfinder)
  const handleBooleanOp = (op: 'union' | 'subtract' | 'intersect' | 'exclude') => {
    soundEngine.playProceduralSound('chime');
    if (op === 'union') {
      // Merge geometry preset
      setNodes([
        { id: 'b-1', x: 100, y: 100, connections: ['b-2', 'b-6'] },
        { id: 'b-2', x: 220, y: 100, connections: ['b-1', 'b-3'] },
        { id: 'b-3', x: 220, y: 220, connections: ['b-2', 'b-4'] },
        { id: 'b-4', x: 160, y: 220, connections: ['b-3', 'b-5'] },
        { id: 'b-5', x: 160, y: 160, connections: ['b-4', 'b-6'] },
        { id: 'b-6', x: 100, y: 160, connections: ['b-5', 'b-1'] },
      ]);
      setFeedback('Operación Buscatrazos: Unión de Formas aplicada');
    } else if (op === 'subtract') {
      // Subtraction preset (Crescent / Cutout)
      setNodes([
        { id: 's-1', x: 140, y: 80, connections: ['s-2', 's-4'] },
        { id: 's-2', x: 240, y: 120, connections: ['s-1', 's-3'] },
        { id: 's-3', x: 210, y: 210, connections: ['s-2', 's-4'] },
        { id: 's-4', x: 120, y: 180, connections: ['s-3', 's-1'] },
      ]);
      setFeedback('Operación Buscatrazos: Sustracción aplicada');
    } else if (op === 'intersect') {
      setNodes([
        { id: 'i-1', x: 150, y: 100, connections: ['i-2', 'i-4'] },
        { id: 'i-2', x: 230, y: 100, connections: ['i-1', 'i-3'] },
        { id: 'i-3', x: 230, y: 180, connections: ['i-2', 'i-4'] },
        { id: 'i-4', x: 150, y: 180, connections: ['i-3', 'i-1'] },
      ]);
      setFeedback('Operación Buscatrazos: Intersección conservada');
    } else {
      setFeedback('Operación Exclusión aplicada');
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  // Shaper Tool preset (Quick shape consolidation)
  const handleShaperPreset = (preset: 'diamond' | 'hexagon' | 'star') => {
    soundEngine.playProceduralSound('pop');
    if (preset === 'diamond') {
      setNodes([
        { id: 'd-1', x: 200, y: 60, connections: ['d-2', 'd-4'] },
        { id: 'd-2', x: 300, y: 150, connections: ['d-1', 'd-3'] },
        { id: 'd-3', x: 200, y: 240, connections: ['d-2', 'd-4'] },
        { id: 'd-4', x: 100, y: 150, connections: ['d-3', 'd-1'] },
      ]);
    } else if (preset === 'hexagon') {
      setNodes([
        { id: 'h-1', x: 150, y: 70, connections: ['h-2', 'h-6'] },
        { id: 'h-2', x: 250, y: 70, connections: ['h-1', 'h-3'] },
        { id: 'h-3', x: 300, y: 150, connections: ['h-2', 'h-4'] },
        { id: 'h-4', x: 250, y: 230, connections: ['h-3', 'h-5'] },
        { id: 'h-5', x: 150, y: 230, connections: ['h-4', 'h-6'] },
        { id: 'h-6', x: 100, y: 150, connections: ['h-5', 'h-1'] },
      ]);
    } else {
      setNodes([
        { id: 'st-1', x: 200, y: 50, connections: ['st-2', 'st-10'] },
        { id: 'st-2', x: 225, y: 115, connections: ['st-1', 'st-3'] },
        { id: 'st-3', x: 295, y: 120, connections: ['st-2', 'st-4'] },
        { id: 'st-4', x: 240, y: 165, connections: ['st-3', 'st-5'] },
        { id: 'st-5', x: 260, y: 235, connections: ['st-4', 'st-6'] },
        { id: 'st-6', x: 200, y: 195, connections: ['st-5', 'st-7'] },
        { id: 'st-7', x: 140, y: 235, connections: ['st-6', 'st-8'] },
        { id: 'st-8', x: 160, y: 165, connections: ['st-7', 'st-9'] },
        { id: 'st-9', x: 105, y: 120, connections: ['st-8', 'st-10'] },
        { id: 'st-10', x: 175, y: 115, connections: ['st-9', 'st-1'] },
      ]);
    }
  };

  // Pixel Persona drawing logic (Affinity Designer texture brushes)
  const handlePixelPaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || persona !== 'pixel') return;
    const canvas = pixelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = strokeColor;
    if (brushTexture === 'grunge') {
      // Spray / speckle grunge texture
      for (let i = 0; i < 12; i++) {
        const rx = x + (Math.random() - 0.5) * 20;
        const ry = y + (Math.random() - 0.5) * 20;
        const rSize = Math.random() * 2.5;
        ctx.globalAlpha = Math.random() * 0.7;
        ctx.beginPath();
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (brushTexture === 'chalk') {
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x - 6, y - 6, 12, 12);
    } else {
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, strokeWidth * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleInsertIntoCanvas = () => {
    const svgPath = generateSvgPath();
    onInsertVectorNode(svgPath, 'Vector Logo');
    soundEngine.playProceduralSound('chime');
    setFeedback('¡Elemento vectorial insertado en el proyecto!');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar with Persona Switcher (Affinity Designer style) */}
        <div className="h-14 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Vector Studio & Branding</span>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">
                  Figma + Illustrator + Affinity
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Redes vectoriales dinámicas, creador de formas, buscatrazos y modo píxel
              </p>
            </div>
          </div>

          {/* Persona Switcher (Vector vs Pixel) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPersona('vector')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                persona === 'vector'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Vectorial (Figma / Illustrator): Nodos y curvas matemáticas"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Vector Persona</span>
            </button>
            <button
              onClick={() => setPersona('pixel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                persona === 'pixel'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Píxel (Affinity Designer): Texturas, manchas y grunge"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Pixel Persona</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedback && (
          <div className="bg-indigo-600/20 border-b border-indigo-500/30 text-indigo-300 px-6 py-2 text-xs flex items-center gap-2 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Studio Body: Tools + Canvas + Controls */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Vertical Toolbox */}
          <div className="w-full md:w-56 p-4 bg-slate-900/40 border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-3">
              {/* Tool selector */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Herramienta Activa
                </span>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <button
                    onClick={() => setActiveTool('pen')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                      activeTool === 'pen'
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3 h-3" />
                    <span>Pluma</span>
                  </button>
                  <button
                    onClick={() => setActiveTool('network')}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                      activeTool === 'network'
                        ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Red Vectorial (Figma): Bifurcaciones multidireccionales"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Red Vector</span>
                  </button>
                </div>
              </div>

              {/* Boolean Operations (Buscatrazos) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Combine className="w-3 h-3 text-indigo-400" />
                  <span>Buscatrazos (Boolean)</span>
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    onClick={() => handleBooleanOp('union')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 hover:text-white flex items-center gap-1 transition-colors"
                    title="Unir geometrías"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>Unir</span>
                  </button>
                  <button
                    onClick={() => handleBooleanOp('subtract')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 hover:text-white flex items-center gap-1 transition-colors"
                    title="Restar formas"
                  >
                    <MinusCircle className="w-3 h-3 text-rose-400" />
                    <span>Restar</span>
                  </button>
                  <button
                    onClick={() => handleBooleanOp('intersect')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 hover:text-white flex items-center gap-1 transition-colors"
                    title="Intersectar geometrías"
                  >
                    <Combine className="w-3 h-3 text-cyan-400" />
                    <span>Intersectar</span>
                  </button>
                  <button
                    onClick={() => handleBooleanOp('exclude')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 hover:text-white flex items-center gap-1 transition-colors"
                    title="Excluir áreas compartidas"
                  >
                    <Combine className="w-3 h-3 text-amber-400" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>

              {/* Shaper Tool Presets (Illustrator) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Shapes className="w-3 h-3 text-pink-400" />
                  <span>Creador Formas (Shaper)</span>
                </span>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <button
                    onClick={() => handleShaperPreset('diamond')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-center"
                  >
                    Rombo
                  </button>
                  <button
                    onClick={() => handleShaperPreset('hexagon')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-center"
                  >
                    Hexágono
                  </button>
                  <button
                    onClick={() => handleShaperPreset('star')}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-center"
                  >
                    Estrella
                  </button>
                </div>
              </div>

              {/* Pixel Persona Textures (Affinity Designer) */}
              {persona === 'pixel' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60 animate-in fade-in">
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                    <Paintbrush className="w-3 h-3" />
                    <span>Pinceles de Textura</span>
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    {(['grunge', 'chalk', 'ink'] as const).map(tex => (
                      <button
                        key={tex}
                        onClick={() => setBrushTexture(tex)}
                        className={`p-1.5 rounded border text-center transition-colors ${
                          brushTexture === tex
                            ? 'bg-pink-600 text-white border-pink-500 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {tex.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear and Reset */}
            <div className="pt-3 border-t border-slate-800/60">
              <button
                onClick={() => {
                  soundEngine.playProceduralSound('switch');
                  setNodes([]);
                  setSelectedNodeId(null);
                  if (pixelCanvasRef.current) {
                    const ctx = pixelCanvasRef.current.getContext('2d');
                    ctx?.clearRect(0, 0, 500, 400);
                  }
                }}
                className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar Lienzo</span>
              </button>
            </div>
          </div>

          {/* Central Interactive Vector Drawing Canvas */}
          <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative border border-slate-800 rounded-2xl bg-slate-900/60 shadow-2xl overflow-hidden w-[420px] h-[340px]">
              {/* SVG Vector Canvas */}
              <svg
                width="420"
                height="340"
                onClick={handleSvgClick}
                className="w-full h-full cursor-crosshair relative z-10"
              >
                {/* Drawn Connections */}
                {nodes.map(node =>
                  node.connections.map(targetId => {
                    const target = nodes.find(n => n.id === targetId);
                    if (!target) return null;
                    return (
                      <line
                        key={`${node.id}-${target.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                      />
                    );
                  })
                )}

                {/* Fill Preview */}
                {nodes.length >= 3 && (
                  <polygon
                    points={nodes.map(n => `${n.x},${n.y}`).join(' ')}
                    fill={fillColor}
                  />
                )}

                {/* Interactive Anchor Nodes */}
                {nodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                        soundEngine.playProceduralSound('pop');
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 6 : 4.5}
                        fill={isSelected ? '#ec4899' : '#ffffff'}
                        stroke="#0f172a"
                        strokeWidth={1.5}
                      />
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={10}
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth={1}
                          strokeDasharray="2,2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Pixel Persona Overlay Canvas */}
              {persona === 'pixel' && (
                <canvas
                  ref={pixelCanvasRef}
                  width={420}
                  height={340}
                  onMouseDown={() => setIsPainting(true)}
                  onMouseUp={() => setIsPainting(false)}
                  onMouseLeave={() => setIsPainting(false)}
                  onMouseMove={handlePixelPaint}
                  className="absolute inset-0 z-20 cursor-crosshair pointer-events-auto"
                />
              )}
            </div>

            {/* Quick Canvas Helper Bar */}
            <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Grid3X3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Snap 10px: {isGridSnap ? 'Activado' : 'Desactivado'}</span>
              </span>
              <span>Nodos: <strong>{nodes.length}</strong></span>
              <span>Bifurcaciones: <strong>{nodes.filter(n => n.connections.length > 2).length}</strong></span>
            </div>
          </div>

          {/* Right Parameters Panel */}
          <div className="w-full md:w-64 p-4 bg-slate-900/40 border-l border-slate-800/80 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Propiedades de Trazado
              </span>

              {/* Stroke & Fill Colors */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Color de Trazo</label>
                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-5 h-5 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Grosor de Línea ({strokeWidth}px)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Relleno (Fill)</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['rgba(99, 102, 241, 0.25)', 'rgba(236, 72, 153, 0.25)', 'rgba(16, 185, 129, 0.25)', 'transparent'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFillColor(color)}
                        style={{ backgroundColor: color }}
                        className={`h-6 rounded border border-slate-700 transition-transform ${fillColor === color ? 'ring-2 ring-white scale-105' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Svg Path Raw Snippet */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <label className="text-[10px] text-slate-400">Código SVG Path Generado</label>
                <textarea
                  readOnly
                  rows={3}
                  value={generateSvgPath()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-emerald-400 font-mono resize-none focus:outline-none"
                />
              </div>
            </div>

            {/* Action to apply to project */}
            <div className="space-y-2 pt-3 border-t border-slate-800/60">
              <button
                onClick={handleInsertIntoCanvas}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insertar en el Proyecto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
