import React, { useState } from 'react';
import { 
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
  Component,
  PenTool,
  CheckSquare,
  CircleDot,
  Calendar,
  Clock,
  PlusCircle,
  Pipette,
  UploadCloud,
  Tag,
  AppWindow,
  PanelRightOpen,
  ChevronsUpDown,
  GalleryHorizontalEnd,
  PanelLeft,
  Footprints,
  Compass,
  ListOrdered,
  RotateCw,
  BoxSelect,
  Bell,
  AlertTriangle,
  HelpCircle,
  Table,
  PlaySquare,
  Link,
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

type ComponentCategory = 'action' | 'forms' | 'containers' | 'nav' | 'feedback' | 'media' | 'masters';

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
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('action');

  const getNodeIcon = (type: DesignNode['type']) => {
    switch (type) {
      case 'button':
        return <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />;
      case 'icon_button':
        return <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />;
      case 'fab':
        return <PlusCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'toggle_button':
        return <SplitSquareVertical className="w-3.5 h-3.5 text-indigo-400" />;
      case 'hyperlink':
        return <Link className="w-3.5 h-3.5 text-blue-400" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-blue-400" />;
      case 'card':
        return <Square className="w-3.5 h-3.5 text-emerald-400" />;
      case 'input':
        return <TextCursorInput className="w-3.5 h-3.5 text-amber-400" />;
      case 'textarea':
        return <TextCursorInput className="w-3.5 h-3.5 text-amber-500" />;
      case 'checkbox':
        return <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'radio':
        return <CircleDot className="w-3.5 h-3.5 text-indigo-400" />;
      case 'select':
        return <ChevronsUpDown className="w-3.5 h-3.5 text-indigo-400" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-cyan-400" />;
      case 'counter':
        return <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />;
      case 'countdown':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'datepicker':
        return <Calendar className="w-3.5 h-3.5 text-indigo-400" />;
      case 'colorpicker':
        return <Pipette className="w-3.5 h-3.5 text-pink-400" />;
      case 'file_uploader':
        return <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />;
      case 'chips_input':
        return <Tag className="w-3.5 h-3.5 text-cyan-400" />;
      case 'switch':
        return <ToggleLeft className="w-3.5 h-3.5 text-cyan-400" />;
      case 'avatar':
        return <UserCircle className="w-3.5 h-3.5 text-purple-400" />;
      case 'badge':
        return <span className="w-2 h-2 rounded-full bg-pink-400" />;
      case 'modal':
        return <AppWindow className="w-3.5 h-3.5 text-purple-400" />;
      case 'sheet':
        return <PanelRightOpen className="w-3.5 h-3.5 text-teal-400" />;
      case 'accordion':
        return <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" />;
      case 'carousel':
        return <GalleryHorizontalEnd className="w-3.5 h-3.5 text-pink-400" />;
      case 'navbar':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-400" />;
      case 'tabbar':
        return <Layers className="w-3.5 h-3.5 text-pink-400" />;
      case 'sidebar':
        return <PanelLeft className="w-3.5 h-3.5 text-indigo-400" />;
      case 'footer':
        return <Footprints className="w-3.5 h-3.5 text-slate-400" />;
      case 'breadcrumbs':
        return <Compass className="w-3.5 h-3.5 text-blue-400" />;
      case 'pagination':
        return <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />;
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
      case 'spinner':
        return <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />;
      case 'skeleton':
        return <BoxSelect className="w-3.5 h-3.5 text-slate-500" />;
      case 'toast':
        return <Bell className="w-3.5 h-3.5 text-emerald-400" />;
      case 'banner':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'tooltip':
        return <HelpCircle className="w-3.5 h-3.5 text-sky-400" />;
      case 'table':
        return <Table className="w-3.5 h-3.5 text-indigo-400" />;
      case 'media_player':
        return <PlaySquare className="w-3.5 h-3.5 text-rose-400" />;
      case 'divider':
        return <Minus className="w-3.5 h-3.5 text-slate-500" />;
      case 'vector':
        return <PenTool className="w-3.5 h-3.5 text-indigo-400" />;
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
    if (!node || !node.id) return null;
    const isSelected = selectedNodeId === node.id;
    const isOver = dropTargetId === node.id;
    const isRoot = depth === 0 || node.id === 'app-root' || node.id === 'app-root-details';

    return (
      <div 
        key={node.id} 
        className="select-none group relative"
        draggable={!isRoot}
        onDragStart={(e) => handleLayerDragStart(e, node.id)}
        onDragOver={(e) => handleLayerDragOver(e, node.id)}
        onDrop={(e) => handleLayerDrop(e, node.id)}
      >
        {isOver && dropPosition === 'before' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 z-30 shadow-[0_0_10px_#22d3ee]" />
        )}
        {isOver && dropPosition === 'after' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 z-30 shadow-[0_0_10px_#22d3ee]" />
        )}

        <div
          onClick={() => onSelectNode(node)}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          className={`h-7 pr-2.5 flex items-center justify-between text-xs cursor-pointer rounded-lg mx-1.5 transition-all ${
            isSelected
              ? 'neo-glass-panel-subtle text-white font-medium border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border-l-2 border-transparent'
          } ${isOver && dropPosition === 'inside' ? 'ring-1 ring-inset ring-cyan-400/50 bg-cyan-900/20' : ''}`}
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
            {!isRoot && onConvertToMaster && (
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
            {!isRoot && (
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

  const PALETTE_CATEGORIES: Record<Exclude<ComponentCategory, 'masters'>, Array<{ type: DesignNode['type']; label: string; icon: React.ReactNode }>> = {
    action: [
      { type: 'button', label: 'Botón Estándar', icon: <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'icon_button', label: 'Botón de Icono', icon: <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'fab', label: 'FAB Flotante', icon: <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'toggle_button', label: 'Toggle Group', icon: <SplitSquareVertical className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'hyperlink', label: 'Enlace Web', icon: <Link className="w-3.5 h-3.5 text-blue-400" /> },
    ],
    forms: [
      { type: 'input', label: 'Input de Texto', icon: <TextCursorInput className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'textarea', label: 'Área de Texto', icon: <TextCursorInput className="w-3.5 h-3.5 text-amber-500" /> },
      { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'radio', label: 'Radio Button', icon: <CircleDot className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'switch', label: 'Switch Toggle', icon: <ToggleLeft className="w-3.5 h-3.5 text-cyan-400" /> },
      { type: 'select', label: 'Menú Dropdown', icon: <ChevronsUpDown className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'slider', label: 'Slider Rango', icon: <Sliders className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'calendar', label: 'Calendario Tareas', icon: <Calendar className="w-3.5 h-3.5 text-cyan-400" /> },
      { type: 'counter', label: 'Contador Stepper', icon: <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'countdown', label: 'Cuenta Regresiva', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'datepicker', label: 'Selector Fecha', icon: <Calendar className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'colorpicker', label: 'Selector Color', icon: <Pipette className="w-3.5 h-3.5 text-pink-400" /> },
      { type: 'file_uploader', label: 'Cargador Files', icon: <UploadCloud className="w-3.5 h-3.5 text-emerald-400" /> },
      { type: 'chips_input', label: 'Chips Tags', icon: <Tag className="w-3.5 h-3.5 text-cyan-400" /> },
    ],
    containers: [
      { type: 'card', label: 'Tarjeta Card', icon: <Square className="w-3.5 h-3.5 text-emerald-400" /> },
      { type: 'modal', label: 'Ventana Modal', icon: <AppWindow className="w-3.5 h-3.5 text-purple-400" /> },
      { type: 'sheet', label: 'Side Sheet', icon: <PanelRightOpen className="w-3.5 h-3.5 text-teal-400" /> },
      { type: 'accordion', label: 'Acordeón', icon: <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'segmented', label: 'Segmented Tabs', icon: <SplitSquareVertical className="w-3.5 h-3.5 text-teal-400" /> },
      { type: 'carousel', label: 'Carrusel Slider', icon: <GalleryHorizontalEnd className="w-3.5 h-3.5 text-pink-400" /> },
      { type: 'divider', label: 'Separador Línea', icon: <Minus className="w-3.5 h-3.5 text-slate-500" /> },
    ],
    nav: [
      { type: 'navbar', label: 'Header / Navbar', icon: <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'tabbar', label: 'TabBar Inferior', icon: <Layers className="w-3.5 h-3.5 text-pink-400" /> },
      { type: 'sidebar', label: 'Menú Sidebar', icon: <PanelLeft className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'breadcrumbs', label: 'Migas de Pan', icon: <Compass className="w-3.5 h-3.5 text-blue-400" /> },
      { type: 'pagination', label: 'Paginación', icon: <ListOrdered className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'footer', label: 'Pie de Página', icon: <Footprints className="w-3.5 h-3.5 text-slate-400" /> },
      { type: 'searchbar', label: 'Buscador', icon: <Search className="w-3.5 h-3.5 text-sky-400" /> },
    ],
    feedback: [
      { type: 'spinner', label: 'Spinner Carga', icon: <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> },
      { type: 'progress', label: 'Barra Progreso', icon: <BarChart3 className="w-3.5 h-3.5 text-violet-400" /> },
      { type: 'skeleton', label: 'Skeleton Shimmer', icon: <BoxSelect className="w-3.5 h-3.5 text-slate-500" /> },
      { type: 'toast', label: 'Toast Alerta', icon: <Bell className="w-3.5 h-3.5 text-emerald-400" /> },
      { type: 'banner', label: 'Banner Mensaje', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
      { type: 'badge', label: 'Insignia Badge', icon: <span className="w-2 h-2 rounded-full bg-pink-400" /> },
      { type: 'metric', label: 'Métrica KPI', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
    ],
    media: [
      { type: 'image', label: 'Imagen / Asset PNG', icon: <UploadCloud className="w-3.5 h-3.5 text-pink-400" /> },
      { type: 'avatar', label: 'Avatar Perfil', icon: <UserCircle className="w-3.5 h-3.5 text-purple-400" /> },
      { type: 'table', label: 'Tabla de Datos', icon: <Table className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'media_player', label: 'Media Player', icon: <PlaySquare className="w-3.5 h-3.5 text-rose-400" /> },
      { type: 'tooltip', label: 'Tooltip Ayuda', icon: <HelpCircle className="w-3.5 h-3.5 text-sky-400" /> },
      { type: 'vector', label: 'Vector Art', icon: <PenTool className="w-3.5 h-3.5 text-indigo-400" /> },
      { type: 'text', label: 'Texto Tipográfico', icon: <Type className="w-3.5 h-3.5 text-blue-400" /> },
    ]
  };

  return (
    <aside className="w-64 neo-glass-panel border-y-0 border-l-0 rounded-none flex flex-col h-full select-none text-slate-300 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      {/* Top Header - HUD Telemetry */}
      <div className="h-10 px-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="text-cyan-400 font-bold tracking-widest">HUD 01</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-sans font-semibold">Capas & Nodos</span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
          {nodes.length} NODOS
        </span>
      </div>

      {/* Design System Category Selector (Material & Carbon Standard) */}
      <div className="p-2.5 border-b border-white/[0.06] bg-white/[0.015] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1 font-mono">
          <span>CATÁLOGO MÓDULOS</span>
          <span className="text-[9px] text-cyan-400 font-mono bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">40+ MÓDULOS</span>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-4 gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06] text-[10px]">
          <button
            onClick={() => setActiveCategory('action')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'action' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="1. Elementos de Acción y Comando"
          >
            Acción
          </button>
          <button
            onClick={() => setActiveCategory('forms')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'forms' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="2. Formularios y Selección"
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveCategory('containers')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'containers' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="3. Contenedores y Estructura"
          >
            Cajas
          </button>
          <button
            onClick={() => setActiveCategory('nav')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'nav' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="4. Navegación y Ubicación"
          >
            Nav
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06] text-[10px]">
          <button
            onClick={() => setActiveCategory('feedback')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'feedback' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="5. Estado, Alerta y Feedback"
          >
            Feedback
          </button>
          <button
            onClick={() => setActiveCategory('media')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'media' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="6. Informativos y Multimedia"
          >
            Media
          </button>
          <button
            onClick={() => setActiveCategory('masters')}
            className={`py-1 rounded-lg font-medium text-center transition-all ${activeCategory === 'masters' ? 'bg-purple-500/25 text-purple-300 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-semibold' : 'text-purple-400 hover:text-purple-200 hover:bg-white/[0.03] border border-transparent'}`}
            title="Componentes Maestros Reutilizables"
          >
            ❖ Maestros
          </button>
        </div>

        {/* Master Components Library Tab */}
        {activeCategory === 'masters' && (
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
            {masterComponents.length > 0 ? (
              masterComponents.map((master) => (
                <div
                  key={master.id}
                  onClick={() => onInstantiateMaster?.(master)}
                  className="flex items-center justify-between p-2 neo-glass-card hover:border-purple-500/50 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-purple-400 text-xs">❖</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{master.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{master.type}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] bg-purple-600/80 hover:bg-purple-500 text-white px-2 py-0.5 rounded-md font-medium border border-purple-400/30 transition-colors"
                  >
                    + Insertar
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-500 text-[11px] font-mono">
                No hay componentes maestros. Pasa el cursor sobre una capa y haz clic en ❖ para guardarla.
              </div>
            )}
          </div>
        )}

        {/* Category Component Items Grid */}
        {activeCategory !== 'masters' && (
          <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-0.5">
            {PALETTE_CATEGORIES[activeCategory].map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => handlePaletteDragStart(e, comp.type)}
                onClick={() => onAddNode(comp.type, selectedNodeId || undefined)}
                className="flex items-center gap-2 p-2 neo-glass-card hover:border-cyan-400/40 text-slate-300 hover:text-white rounded-lg cursor-grab active:cursor-grabbing transition-all text-[11px] group"
                title={`Insertar ${comp.label}`}
              >
                <div className="p-1 rounded bg-white/[0.03] border border-white/[0.05] group-hover:border-cyan-400/30 group-hover:bg-cyan-500/10 transition-colors">
                  {comp.icon}
                </div>
                <span className="font-medium truncate">{comp.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer Hierarchy List */}
      <div className="flex-1 overflow-y-auto py-2">
        {nodes.map(node => renderLayerItem(node, 0))}
      </div>
    </aside>
  );
};
