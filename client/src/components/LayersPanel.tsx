import React, { useState } from 'react';
import { 
  FolderTree, 
  Layers, 
  Square, 
  Type, 
  MousePointerClick, 
  Volume2, 
  Trash2,
  GripVertical,
  TextCursorInput,
  ToggleLeft,
  UserCircle,
  Smartphone,
  Sliders,
  Search,
  TrendingUp,
  BarChart3,
  SplitSquareVertical,
  Minus,
  Component
} from 'lucide-react';
import type { DesignNode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface LayersPanelProps {
  nodes: DesignNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: DesignNode) => void;
  onAddNode: (type: DesignNode['type'], parentId?: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onReorderNodes?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onConvertToMaster?: (nodeId: string) => void;
  masterComponents?: DesignNode[];
  onInstantiateMaster?: (master: DesignNode) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  onReorderNodes,
  onConvertToMaster,
  masterComponents = [],
  onInstantiateMaster,
}) => {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside'>('after');
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'data' | 'components'>('all');

  const getNodeIcon = (type: DesignNode['type']) => {
    switch (type) {
      case 'button':
        return <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-blue-400" />;
      case 'card':
        return <Square className="w-3.5 h-3.5 text-emerald-400" />;
      case 'input':
        return <TextCursorInput className="w-3.5 h-3.5 text-amber-400" />;
      case 'switch':
        return <ToggleLeft className="w-3.5 h-3.5 text-cyan-400" />;
      case 'avatar':
        return <UserCircle className="w-3.5 h-3.5 text-purple-400" />;
      case 'badge':
        return <span className="w-2 h-2 rounded-full bg-pink-400" />;
      case 'navbar':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-400" />;
      case 'tabbar':
        return <Layers className="w-3.5 h-3.5 text-pink-400" />;
      case 'searchbar':
        return <Search className="w-3.5 h-3.5 text-sky-400" />;
      case 'slider':
        return <Sliders className="w-3.5 h-3.5 text-amber-400" />;
      case 'segmented':
        return <SplitSquareVertical className="w-3.5 h-3.5 text-teal-400" />;
      case 'metric':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'progress':
        return <BarChart3 className="w-3.5 h-3.5 text-violet-400" />;
      case 'divider':
        return <Minus className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handlePaletteDragStart = (e: React.DragEvent, type: DesignNode['type']) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, source: 'palette' }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayerDragStart = (e: React.DragEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    e.dataTransfer.setData('text/plain', JSON.stringify({ nodeId, source: 'layer' }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayerDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedNodeId === targetId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    let pos: 'before' | 'after' | 'inside' = 'after';
    if (relY < rect.height * 0.28) {
      pos = 'before';
    } else if (relY > rect.height * 0.72) {
      pos = 'after';
    } else {
      pos = 'inside';
    }

    setDropTargetId(targetId);
    setDropPosition(pos);
  };

  const handleLayerDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.source === 'layer' && data.nodeId && onReorderNodes) {
        onReorderNodes(data.nodeId, targetId, dropPosition);
      } else if (data.source === 'palette' && data.type) {
        onAddNode(data.type, targetId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDraggedNodeId(null);
      setDropTargetId(null);
    }
  };

  const renderLayerItem = (node: DesignNode, depth = 0): React.ReactNode => {
    const isSelected = selectedNodeId === node.id;
    const isOver = dropTargetId === node.id;

    return (
      <div 
        key={node.id} 
        className="select-none group relative"
        draggable={node.id !== 'app-root' && node.id !== 'app-root-details'}
        onDragStart={(e) => handleLayerDragStart(e, node.id)}
        onDragOver={(e) => handleLayerDragOver(e, node.id)}
        onDrop={(e) => handleLayerDrop(e, node.id)}
      >
        {isOver && dropPosition === 'before' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 z-30 shadow-[0_0_8px_#6366f1]" />
        )}
        {isOver && dropPosition === 'after' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 z-30 shadow-[0_0_8px_#6366f1]" />
        )}

        <div
          onClick={() => onSelectNode(node)}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          className={`h-7 pr-2.5 flex items-center justify-between text-xs cursor-pointer rounded-md mx-1 transition-all ${
            isSelected
              ? 'bg-indigo-600/15 text-white font-medium border-l-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-2 border-transparent'
          } ${isOver && dropPosition === 'inside' ? 'ring-1 ring-inset ring-indigo-400/50 bg-indigo-900/20' : ''}`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <GripVertical className="w-2.5 h-2.5 text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab" />
            {getNodeIcon(node.type)}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {node.action && node.action.type !== 'none' && (
              <span className="text-[9px] bg-indigo-900/80 text-indigo-300 px-1 rounded font-mono">
                {node.action.type === 'navigate' ? '🔀' : node.action.type === 'modal' ? '🪟' : node.action.type === 'confetti' ? '🎉' : node.action.type === 'copy_clipboard' ? '📋' : '⚡'}
              </span>
            )}
            {node.styles.animation && node.styles.animation !== 'none' && (
              <span className="text-[9px] text-pink-400 font-mono" title={`Animación: ${node.styles.animation}`}>
                ✦
              </span>
            )}
            {node.sounds?.onClick && (
              <span title={`Sound: ${node.sounds.onClick}`}>
                <Volume2 className="w-3 h-3 text-amber-400" />
              </span>
            )}
            {node.isMasterComponent && (
              <span className="text-[9px] bg-purple-900/80 text-purple-300 px-1 rounded font-mono" title="Componente Maestro">
                ❖
              </span>
            )}
            {node.id !== 'app-root' && node.id !== 'app-root-details' && onConvertToMaster && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConvertToMaster(node.id);
                  soundEngine.playProceduralSound('chime');
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-purple-400 p-1 rounded transition-opacity"
                title="Convertir en Componente Maestro Reutilizable"
              >
                <Component className="w-3 h-3" />
              </button>
            )}
            {node.id !== 'app-root' && node.id !== 'app-root-details' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 rounded transition-opacity"
                title="Eliminar elemento"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {node.children && node.children.map(child => renderLayerItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-md border-r border-slate-800/60 flex flex-col h-full select-none text-slate-300">
      {/* Top Header */}
      <div className="h-10 px-3 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <FolderTree className="w-3 h-3 text-indigo-400" />
          <span>Capas</span>
        </div>
      </div>

      {/* Pro Component Palette (Drag & Drop) with Categories */}
      <div className="p-2 border-b border-slate-800/50 bg-slate-900/20 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 uppercase tracking-wider px-1">
          <span>Componentes</span>
          <span className="text-[9px] text-slate-500 lowercase">arrastra al lienzo</span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50 text-[10px]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-0.5 rounded-md font-medium transition-all ${activeTab === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-0.5 rounded-md font-medium transition-all ${activeTab === 'mobile' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Móvil
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-0.5 rounded-md font-medium transition-all ${activeTab === 'data' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Datos
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 py-0.5 rounded-md font-medium transition-all ${activeTab === 'components' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
            title="Componentes Maestros del Proyecto"
          >
            ❖ Maestros
          </button>
        </div>

        {/* Master Components Library Tab */}
        {activeTab === 'components' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {masterComponents.length > 0 ? (
              masterComponents.map((master) => (
                <div
                  key={master.id}
                  onClick={() => onInstantiateMaster?.(master)}
                  className="flex items-center justify-between p-2 bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-purple-400 text-xs">❖</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{master.name}</div>
                      <div className="text-[10px] text-slate-500">{master.type}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 rounded-md font-medium transition-colors"
                  >
                    + Insertar
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-500 text-[11px]">
                No hay componentes maestros. Pasa el cursor sobre una capa y haz clic en el icono ❖ para crear uno.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-0.5">
          {/* Mobile TabBar */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'tabbar')}
              onClick={() => onAddNode('tabbar', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-pink-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-pink-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-medium truncate">TabBar Inferior</span>
            </div>
          )}

          {/* Mobile NavBar */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'navbar')}
              onClick={() => onAddNode('navbar', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium truncate">NavBar Cabecera</span>
            </div>
          )}

          {/* SearchBar */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'searchbar')}
              onClick={() => onAddNode('searchbar', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-sky-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-sky-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-medium truncate">Buscador</span>
            </div>
          )}

          {/* Segmented Control */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'segmented')}
              onClick={() => onAddNode('segmented', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-teal-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-teal-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-medium truncate">Segmented Tabs</span>
            </div>
          )}

          {/* Metric KPI Card */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'metric')}
              onClick={() => onAddNode('metric', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-emerald-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium truncate">Card Métrica / KPI</span>
            </div>
          )}

          {/* Progress Bar */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'progress')}
              onClick={() => onAddNode('progress', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-violet-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-violet-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-medium truncate">Barra Progreso</span>
            </div>
          )}

          {/* Slider Range */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'slider')}
              onClick={() => onAddNode('slider', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-amber-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-amber-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium truncate">Slider Rango</span>
            </div>
          )}

          {/* Divider */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'divider')}
              onClick={() => onAddNode('divider', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-600 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Minus className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium truncate">Separador</span>
            </div>
          )}

          {/* Draggable Button */}
          {(activeTab === 'all') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'button')}
              onClick={() => onAddNode('button', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium truncate">Botón</span>
            </div>
          )}

          {/* Draggable Card */}
          {(activeTab === 'all') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'card')}
              onClick={() => onAddNode('card', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-emerald-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Square className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium truncate">Tarjeta Box</span>
            </div>
          )}

          {/* Draggable Text */}
          {(activeTab === 'all') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'text')}
              onClick={() => onAddNode('text', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-blue-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium truncate">Texto</span>
            </div>
          )}

          {/* Draggable Input */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'input')}
              onClick={() => onAddNode('input', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-amber-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-amber-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <TextCursorInput className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium truncate">Input Texto</span>
            </div>
          )}

          {/* Draggable Switch */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'switch')}
              onClick={() => onAddNode('switch', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-cyan-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-cyan-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <ToggleLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium truncate">Switch</span>
            </div>
          )}

          {/* Draggable Avatar */}
          {(activeTab === 'all') && (
            <div
              draggable
              onDragStart={(e) => handlePaletteDragStart(e, 'avatar')}
              onClick={() => onAddNode('avatar', selectedNodeId || undefined)}
              className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-purple-600/20 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-purple-500/40 cursor-grab active:cursor-grabbing transition-all text-[11px]"
            >
              <UserCircle className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-medium truncate">Avatar</span>
            </div>
          )}
        </div>
      </div>

      {/* Layer Hierarchy List */}
      <div className="flex-1 overflow-y-auto py-2">
        {nodes.map(node => renderLayerItem(node, 0))}
      </div>
    </aside>
  );
};
