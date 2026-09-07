import React, { useState } from 'react';
import type { DesignNode, DeviceMode, DrawingStroke, CanvasComment } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';
import { DrawingLayer } from './DrawingLayer';
import { CommentsLayer } from './CommentsLayer';
import { CanvasRulers } from './CanvasRulers';
import * as LucideIcons from 'lucide-react';
import { 
  ChevronLeft, 
  MoreVertical, 
  Home, 
  Search, 
  Compass, 
  User, 
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  Calendar,
  UploadCloud,
  AlertTriangle,
  Play,
  RotateCw,
  X,
  ExternalLink
} from 'lucide-react';

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

interface CanvasProps {
  nodes: DesignNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: DesignNode | null) => void;
  deviceMode: DeviceMode;
  zoom: number;
  isPreviewMode: boolean;
  onExecuteAction?: (action: DesignNode['action']) => void;
  onAddNode: (type: DesignNode['type'], parentId?: string) => void;
  isDrawingActive: boolean;
  onCloseDrawing: () => void;
  strokes: DrawingStroke[];
  onUpdateStrokes: (strokes: DrawingStroke[]) => void;
  // Screen Transition Animation
  screenTransitionClass?: string;
  // Canvas Comments
  isCommentsActive: boolean;
  comments: CanvasComment[];
  onAddComment: (comment: CanvasComment) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  // 8px Alignment Grid
  isGridActive?: boolean;
  // Graduated Rulers
  showRulers?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  deviceMode,
  zoom,
  isPreviewMode,
  onExecuteAction,
  onAddNode,
  isDrawingActive,
  onCloseDrawing,
  strokes,
  onUpdateStrokes,
  screenTransitionClass,
  isCommentsActive,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  isGridActive,
  showRulers = true,
}) => {
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | undefined>(undefined);

  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: '390px', height: '844px', radius: '48px', name: 'iPhone 16 Pro (390 x 844)' };
      case 'tablet':
        return { width: '768px', height: '1024px', radius: '32px', name: 'iPad Pro (768 x 1024)' };
      case 'desktop':
        return { width: '1200px', height: '800px', radius: '16px', name: 'Web Desktop (1200 x 800)' };
    }
  };

  const currentDevice = getDeviceDimensions();

  // Drop Handler for Drag-and-Drop Creation
  const handleDrop = (e: React.DragEvent, targetParentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverNodeId(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data.source === 'palette' && data.type) {
        onAddNode(data.type, targetParentId);
      }
    } catch (err) {
      console.error('Failed to parse dropped element data', err);
    }
  };

  const handleDragOver = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverNodeId !== nodeId) {
      setDragOverNodeId(nodeId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverNodeId(null);
  };

  // Recursive Element Renderer with Selection, Actions, and Droppable Zones
  const renderNode = (node: DesignNode): React.ReactNode => {
    const isSelected = selectedNodeId === node.id;
    const isDragTarget = dragOverNodeId === node.id;

    const handleNodeClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Play sound trigger
      if (node.sounds?.onClick) {
        soundEngine.playProceduralSound(node.sounds.onClick);
      }

      // If testing mode and node has an interactive action, execute it!
      if (isPreviewMode) {
        if (node.action && node.action.type !== 'none' && onExecuteAction) {
          onExecuteAction(node.action);
        }
      } else {
        onSelectNode(node);
      }
    };

    const handleNodeMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      if (node.sounds?.onHover) {
        soundEngine.playProceduralSound(node.sounds.onHover);
      }
      if (node.styles.backgroundVideo && node.styles.videoHoverBehavior && node.styles.videoHoverBehavior !== 'none') {
        const vid = e.currentTarget.querySelector('video');
        if (vid) {
          vid.muted = false;
          vid.play().catch(() => {});
        }
      }
    };

    const handleNodeMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      if (node.styles.backgroundVideo && node.styles.videoHoverBehavior && node.styles.videoHoverBehavior !== 'none') {
        const vid = e.currentTarget.querySelector('video');
        if (vid) {
          if (node.styles.videoHoverBehavior === 'unmute_on_hover') {
            vid.muted = true;
          } else if (node.styles.videoHoverBehavior === 'play_pause_on_hover') {
            vid.pause();
            vid.muted = true;
          }
        }
      }
    };

    const bgImageVal = node.styles.backgroundImage 
      ? (node.styles.backgroundImage.startsWith('url(') || node.styles.backgroundImage.startsWith('linear-gradient(') 
          ? node.styles.backgroundImage 
          : `url("${node.styles.backgroundImage}")`)
      : (node.styles.backgroundGradient || undefined);

    const hasTextGradient = !!node.styles.textGradient && node.styles.textGradient !== 'none';

    const inlineStyles: React.CSSProperties = {
      backgroundColor: node.styles.backgroundColor,
      backgroundImage: hasTextGradient ? node.styles.textGradient : bgImageVal,
      backgroundSize: (node.styles.backgroundSize as any) || (node.styles.backgroundImage ? 'cover' : undefined),
      backgroundPosition: (node.styles.backgroundPosition as any) || (node.styles.backgroundImage ? 'center' : undefined),
      backgroundRepeat: (node.styles.backgroundRepeat as any) || 'no-repeat',
      WebkitBackgroundClip: hasTextGradient ? 'text' : undefined,
      WebkitTextFillColor: hasTextGradient ? 'transparent' : undefined,
      color: hasTextGradient ? undefined : node.styles.color,
      borderRadius: node.styles.borderRadius,
      padding: node.styles.padding,
      margin: node.styles.margin,
      fontSize: node.styles.fontSize,
      fontWeight: node.styles.fontWeight,
      fontFamily: node.styles.fontFamily ? `'${node.styles.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif` : undefined,
      fontStyle: node.styles.fontStyle,
      textDecoration: node.styles.textDecoration,
      textShadow: node.styles.textShadow,
      letterSpacing: node.styles.letterSpacing,
      lineHeight: node.styles.lineHeight,
      textAlign: node.styles.textAlign,
      textTransform: node.styles.textTransform,
      borderWidth: node.styles.borderWidth,
      borderColor: node.styles.borderColor,
      borderStyle: (node.styles.borderStyle as any) || (node.styles.borderWidth ? 'solid' : undefined),
      boxShadow: node.styles.boxShadow,
      backdropFilter: node.styles.backdropFilter,
      display: node.styles.display || 'block',
      flexDirection: (node.styles.flexDirection as React.CSSProperties['flexDirection']) || 'row',
      alignItems: (node.styles.alignItems as React.CSSProperties['alignItems']) || 'stretch',
      justifyContent: (node.styles.justifyContent as React.CSSProperties['justifyContent']) || 'flex-start',
      gap: node.styles.gap,
      width: node.styles.width,
      height: node.styles.height,
      minWidth: node.styles.minWidth,
      maxWidth: node.styles.maxWidth,
      minHeight: node.styles.minHeight,
      maxHeight: node.styles.maxHeight,
      opacity: node.styles.opacity ? Number(node.styles.opacity) : 1,
      zIndex: node.styles.zIndex !== undefined ? Number(node.styles.zIndex) : undefined,
      position: (node.styles.position as any) || (node.styles.zIndex ? 'relative' : undefined),
      top: node.styles.top,
      left: node.styles.left,
      right: node.styles.right,
      bottom: node.styles.bottom,
      transition: 'all 0.15s ease-in-out',
    };

    // Animation classes
    let animClass = '';
    if (node.styles.animation === 'pulse') animClass = 'animate-pulse ';
    else if (node.styles.animation === 'bounce') animClass = 'animate-bounce ';
    else if (node.styles.animation === 'glow') animClass = 'anim-glow ';
    else if (node.styles.animation === 'float') animClass = 'anim-float ';
    else if (node.styles.animation === 'shake') animClass = 'anim-shake ';
    else if (node.styles.animation && node.styles.animation !== 'none') animClass = `${node.styles.animation} `;

    if (node.styles.customAnimation) {
      animClass += `${node.styles.customAnimation} `;
    }

    const hoverClass = node.styles.hoverScale ? 'hover:scale-[1.04] ' : '';

    const baseClass = 'relative group cursor-pointer ' + 
      animClass + hoverClass +
      (!isPreviewMode && isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 ' : '') + 
      (!isPreviewMode && !isSelected ? 'hover:outline hover:outline-1 hover:outline-indigo-400/50 ' : '') +
      (isDragTarget ? 'ring-2 ring-dashed ring-emerald-400 bg-emerald-500/10 ' : '');

    // Tag badge showing node name, action badge, and sound in edit mode
    const selectionBadge = !isPreviewMode && isSelected && (
      <div className="absolute -top-6 left-0 bg-indigo-600/90 backdrop-blur-md border border-indigo-400/50 text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-[0_0_12px_rgba(99,102,241,0.5)] z-20 flex items-center gap-1.5 pointer-events-none whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
        <span className="font-semibold tracking-wide">{node.name}</span>
        {node.action && node.action.type !== 'none' && (
          <span className="bg-indigo-950/80 border border-indigo-400/40 px-1 rounded text-[9px] text-cyan-300 font-mono">
            {node.action.type === 'navigate' ? '🔀 ' + node.action.targetScreenId : node.action.type === 'modal' ? '🪟 Modal' : node.action.type === 'confetti' ? '🎉 Confeti' : node.action.type === 'copy_clipboard' ? '📋 Copiar' : '⚡ Acción'}
          </span>
        )}
        {node.sounds?.onClick && <span className="text-amber-300">🔊 {node.sounds.onClick}</span>}
      </div>
    );

    // Animated Background Video Overlay
    const isPlayOnHover = node.styles.videoHoverBehavior === 'play_pause_on_hover';
    const videoBackgroundOverlay = node.styles.backgroundVideo ? (
      <video
        src={node.styles.backgroundVideo}
        autoPlay={!isPlayOnHover}
        loop
        muted
        playsInline
        style={{
          opacity: node.styles.backgroundVideoOpacity ? Number(node.styles.backgroundVideoOpacity) : 1,
          filter: node.styles.backgroundVideoBlur ? `blur(${node.styles.backgroundVideoBlur})` : undefined,
        }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[inherit] z-0"
      />
    ) : null;

    // YouTube Embed Component
    const youtubeId = extractYouTubeId(node.styles.youtubeUrl);
    const youtubeEmbed = youtubeId ? (
      <div className="relative w-full h-full min-h-[160px] rounded-[inherit] overflow-hidden z-10">
        <iframe
          className="w-full h-full min-h-[160px] border-0 rounded-[inherit]"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    ) : null;

    if (node.type === 'button') {
      // Dynamic Lucide Icon
      const IconComponent = node.iconName && (LucideIcons as any)[node.iconName]
        ? (LucideIcons as any)[node.iconName]
        : null;

      return (
        <button
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' select-none active:scale-[0.98] inline-flex items-center justify-center gap-2 overflow-hidden'}
        >
          {selectionBadge}
          {videoBackgroundOverlay}
          <span className="relative z-10 flex items-center gap-2">
            {IconComponent && <IconComponent size={16} />}
            <span>{node.content}</span>
          </span>
        </button>
      );
    }

    if (node.type === 'badge') {
      const IconComponent = node.iconName && (LucideIcons as any)[node.iconName]
        ? (LucideIcons as any)[node.iconName]
        : null;

      return (
        <span
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' select-none inline-flex items-center gap-1.5'}
        >
          {selectionBadge}
          {IconComponent && <IconComponent size={12} />}
          <span>{node.content}</span>
        </span>
      );
    }

    if (node.type === 'text') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' select-none'}
        >
          {selectionBadge}
          {node.content}
        </div>
      );
    }

    if (node.type === 'input') {
      return (
        <div key={node.id} className={baseClass} onClick={handleNodeClick}>
          {selectionBadge}
          <input
            type="text"
            readOnly={!isPreviewMode}
            placeholder={node.placeholder || 'Escribe aquí...'}
            defaultValue={node.content}
            style={inlineStyles}
            className="w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      );
    }

    if (node.type === 'switch') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center justify-between gap-3 select-none'}
        >
          {selectionBadge}
          <span className="text-xs font-medium">{node.content || 'Activar opción'}</span>
          <div className={'w-10 h-5 rounded-full transition-colors relative p-0.5 ' + (node.checked ? 'bg-indigo-600' : 'bg-slate-700')}>
            <div className={'w-4 h-4 rounded-full bg-white transition-transform ' + (node.checked ? 'translate-x-5' : 'translate-x-0')} />
          </div>
        </div>
      );
    }

    if (node.type === 'image') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' overflow-hidden flex items-center justify-center bg-slate-900'}
        >
          {selectionBadge}
          {node.imageUrl ? (
            <img
              src={node.imageUrl}
              alt={node.name}
              className="w-full h-full object-cover rounded-[inherit]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-1.5 p-4">
              <LucideIcons.Image size={24} className="text-slate-600" />
              <span className="text-[11px]">Selecciona una foto</span>
            </div>
          )}
        </div>
      );
    }

    if (node.type === 'avatar') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center gap-3 select-none'}
        >
          {selectionBadge}
          {node.avatarUrl ? (
            <img
              src={node.avatarUrl}
              alt={node.content || 'Avatar'}
              className="w-10 h-10 rounded-full object-cover shadow border border-slate-700/80"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow">
              {node.content ? node.content.slice(0, 2).toUpperCase() : 'US'}
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-white">{node.content || 'Alex Morgan'}</div>
            <div className="text-[10px] text-slate-400">{node.secondaryContent || 'alex@designforge.io'}</div>
          </div>
        </div>
      );
    }

    if (node.type === 'navbar') {
      return (
        <header
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-between shadow-md'}
        >
          {selectionBadge}
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-sm tracking-tight">{node.content || 'Pantalla'}</span>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors">
            <MoreVertical size={16} />
          </button>
        </header>
      );
    }

    if (node.type === 'tabbar') {
      return (
        <nav
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-around shadow-lg'}
        >
          {selectionBadge}
          <div className="flex flex-col items-center gap-0.5 text-indigo-400">
            <Home size={18} />
            <span className="text-[10px] font-medium">Inicio</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200 transition-colors">
            <Search size={18} />
            <span className="text-[10px] font-medium">Buscar</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200 transition-colors">
            <Compass size={18} />
            <span className="text-[10px] font-medium">Explorar</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200 transition-colors">
            <User size={18} />
            <span className="text-[10px] font-medium">Perfil</span>
          </div>
        </nav>
      );
    }

    if (node.type === 'searchbar') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center gap-2 shadow-inner'}
        >
          {selectionBadge}
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            readOnly={!isPreviewMode}
            placeholder={node.placeholder || 'Buscar elementos, pantallas...'}
            defaultValue={node.content}
            className="w-full bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-500"
          />
        </div>
      );
    }

    if (node.type === 'slider') {
      const sliderVal = node.value ?? 65;
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex flex-col gap-2 select-none'}
        >
          {selectionBadge}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">{node.content || 'Nivel de Volumen'}</span>
            <span className="text-indigo-400 font-mono font-bold text-[11px]">{sliderVal}%</span>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              style={{ width: `${sliderVal}%` }}
            />
          </div>
        </div>
      );
    }

    if (node.type === 'segmented') {
      const options = node.options || ['Día', 'Semana', 'Mes'];
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center p-1 select-none shadow-inner'}
        >
          {selectionBadge}
          {options.map((opt, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center text-xs font-semibold py-1.5 rounded-lg transition-all ${
                idx === 0
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      );
    }

    if (node.type === 'metric') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' flex flex-col gap-1 shadow'}
        >
          {selectionBadge}
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{node.content || 'Ventas Totales'}</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-medium text-[11px] bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
              <TrendingUp size={11} />
              +14.2%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight mt-1">
            {node.secondaryContent || '$48,250.00'}
          </div>
        </div>
      );
    }

    if (node.type === 'progress') {
      const progVal = node.value ?? 72;
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex flex-col gap-1.5 select-none'}
        >
          {selectionBadge}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">{node.content || 'Carga del Proyecto'}</span>
            <span className="text-emerald-400 font-mono font-semibold text-[11px]">{progVal}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progVal}%` }}
            />
          </div>
        </div>
      );
    }

    if (node.type === 'divider') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-center my-2'}
        >
          {selectionBadge}
          <div className="w-full border-t border-slate-700/80 relative flex items-center justify-center">
            {node.content && (
              <span className="bg-slate-900 px-3 text-[11px] text-slate-400 -translate-y-1/2 absolute">
                {node.content}
              </span>
            )}
          </div>
        </div>
      );
    }

// Chunk 1: Action & Command
    if (node.type === 'icon_button') {
      const IconComponent = node.iconName && (LucideIcons as any)[node.iconName]
        ? (LucideIcons as any)[node.iconName]
        : LucideIcons.Sparkles;

      return (
        <button
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' select-none active:scale-95 inline-flex items-center justify-center p-2 rounded-xl transition-transform'}
          title={node.content || 'Botón de Icono'}
        >
          {selectionBadge}
          <IconComponent size={18} />
        </button>
      );
    }

    if (node.type === 'fab') {
      const IconComponent = node.iconName && (LucideIcons as any)[node.iconName]
        ? (LucideIcons as any)[node.iconName]
        : LucideIcons.Plus;

      return (
        <button
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' select-none active:scale-95 flex items-center justify-center gap-2 shadow-2xl rounded-full transition-transform'}
        >
          {selectionBadge}
          <IconComponent size={20} />
          {node.content && <span className="font-semibold text-xs pr-1">{node.content}</span>}
        </button>
      );
    }

    if (node.type === 'toggle_button') {
      const opts = node.options || ['Lista', 'Cuadrícula', 'Detalles'];
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 select-none'}
        >
          {selectionBadge}
          {opts.map((opt, i) => (
            <button
              key={i}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                i === 0 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    if (node.type === 'hyperlink') {
      return (
        <a
          key={node.id}
          id={node.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNodeClick(e);
          }}
          onMouseEnter={handleNodeMouseEnter}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center gap-1 underline underline-offset-4 hover:opacity-80 transition-opacity select-none'}
        >
          {selectionBadge}
          <span>{node.content || 'Visitar enlace'}</span>
          <ExternalLink size={12} className="opacity-70" />
        </a>
      );
    }

    // Chunk 2: Forms & Selection
    if (node.type === 'textarea') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex flex-col gap-1.5 select-none'}
        >
          {selectionBadge}
          {node.content && <span className="text-xs font-medium text-slate-300">{node.content}</span>}
          <textarea
            readOnly={!isPreviewMode}
            placeholder={node.placeholder || 'Escribe tus comentarios o descripción extensa...'}
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none focus:border-indigo-500 transition-colors"
          />
        </div>
      );
    }

    if (node.type === 'checkbox') {
      const isChecked = node.checked ?? true;
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center gap-2.5 cursor-pointer select-none'}
        >
          {selectionBadge}
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 bg-slate-900'
          }`}>
            {isChecked && <Check size={12} strokeWidth={3} />}
          </div>
          <span className="text-xs text-slate-200 font-medium">{node.content || 'Acepto los términos y condiciones'}</span>
        </div>
      );
    }

    if (node.type === 'radio') {
      const isChecked = node.checked ?? true;
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center gap-2.5 cursor-pointer select-none'}
        >
          {selectionBadge}
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            isChecked ? 'border-indigo-500' : 'border-slate-600'
          }`}>
            {isChecked && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
          </div>
          <span className="text-xs text-slate-200 font-medium">{node.content || 'Opción seleccionada'}</span>
        </div>
      );
    }

    if (node.type === 'select') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-between p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 select-none shadow-sm'}
        >
          {selectionBadge}
          <span>{node.content || 'Seleccionar categoría...'}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      );
    }

    if (node.type === 'datepicker') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-between p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 select-none shadow-sm'}
        >
          {selectionBadge}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            <span>{node.content || '07 Sep 2026, 14:30'}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">📅 Elegir</span>
        </div>
      );
    }

    if (node.type === 'colorpicker') {
      const colorVal = node.styles.backgroundColor || '#6366f1';
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center gap-2.5 p-2 bg-slate-900 border border-slate-800 rounded-xl select-none'}
        >
          {selectionBadge}
          <div className="w-6 h-6 rounded-lg shadow-inner border border-white/20" style={{ backgroundColor: colorVal }} />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">{node.content || 'Color Primario'}</span>
            <span className="text-xs font-mono text-white uppercase font-bold">{colorVal}</span>
          </div>
        </div>
      );
    }

    if (node.type === 'file_uploader') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' border-2 border-dashed border-slate-700 hover:border-indigo-500/70 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-colors select-none'}
        >
          {selectionBadge}
          <UploadCloud size={24} className="text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">{node.content || 'Arrastra archivos aquí o examina'}</span>
          <span className="text-[10px] text-slate-500">Soporta PNG, JPG, PDF (máx. 15MB)</span>
        </div>
      );
    }

    if (node.type === 'chips_input') {
      const chips = node.options || ['Diseño UI', 'Sistemas', 'Vercel', 'Next.js'];
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex flex-wrap gap-1.5 p-2 bg-slate-900 border border-slate-800 rounded-xl select-none'}
        >
          {selectionBadge}
          {chips.map((chip, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 text-[11px] font-medium border border-indigo-500/30">
              {chip}
              <X size={10} className="hover:text-rose-400 cursor-pointer" />
            </span>
          ))}
        </div>
      );
    }

    // Chunk 3: Containers & Structure
    if (node.type === 'modal') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl space-y-3 select-none'}
        >
          {selectionBadge}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white">{node.content || 'Título del Modal'}</span>
            <button className="text-slate-500 hover:text-white p-1">✕</button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {node.secondaryContent || 'Este diálogo emergente interrumpe la navegación para requerir atención inmediata o confirmación.'}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800">Cancelar</button>
            <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow">Confirmar</button>
          </div>
        </div>
      );
    }

    if (node.type === 'sheet') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-3.5 bg-slate-900 border-l border-indigo-500/40 rounded-xl shadow-xl space-y-2 select-none'}
        >
          {selectionBadge}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">{node.content || 'Panel Lateral / Sheet'}</span>
            <span className="text-[10px] font-mono text-indigo-400">SIDE SHEET</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {node.secondaryContent || 'Panel de opciones que se desliza desde los bordes para filtros o configuración.'}
          </p>
        </div>
      );
    }

    if (node.type === 'accordion') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' bg-slate-900 border border-slate-800 rounded-xl overflow-hidden select-none shadow-sm'}
        >
          {selectionBadge}
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <span className="text-xs font-semibold text-white">{node.content || '¿Cómo funciona la exportación?'}</span>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
          <div className="p-3 pt-0 text-[11px] text-slate-400 border-t border-slate-800/60 leading-relaxed">
            {node.secondaryContent || 'Haz clic para expandir o colapsar secciones de contenido verticalmente.'}
          </div>
        </div>
      );
    }

    if (node.type === 'carousel') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex flex-col gap-2 select-none overflow-hidden'}
        >
          {selectionBadge}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {[1, 2, 3].map(item => (
              <div key={item} className="min-w-[140px] h-24 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-2.5 flex flex-col justify-end">
                <span className="text-[10px] text-indigo-300 font-mono">SLIDE 0{item}</span>
                <span className="text-xs font-bold text-white">Item Destacado</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            <div className="w-4 h-1 rounded-full bg-indigo-500" />
            <div className="w-1.5 h-1 rounded-full bg-slate-700" />
            <div className="w-1.5 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      );
    }

    // Chunk 4: Navigation & Location
    if (node.type === 'sidebar') {
      return (
        <aside
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-1 select-none shadow-md'}
        >
          {selectionBadge}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
            {node.content || 'Menú Navegación'}
          </div>
          {[
            { label: 'Dashboard', icon: Home, active: true },
            { label: 'Analíticas', icon: TrendingUp },
            { label: 'Configuración', icon: User }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                item.active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </div>
          ))}
        </aside>
      );
    }

    if (node.type === 'footer') {
      return (
        <footer
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-2 text-center select-none'}
        >
          {selectionBadge}
          <div className="flex justify-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Contacto</a>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {node.content || '© 2026 DesignForge Studio. Todos los derechos reservados.'}
          </span>
        </footer>
      );
    }

    if (node.type === 'breadcrumbs') {
      return (
        <nav
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' flex items-center gap-1.5 text-xs select-none'}
        >
          {selectionBadge}
          <span className="text-slate-400 hover:text-white cursor-pointer">Inicio</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 hover:text-white cursor-pointer">Componentes</span>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400 font-semibold">{node.content || 'Navegación'}</span>
        </nav>
      );
    }

    if (node.type === 'pagination') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center gap-1 select-none'}
        >
          {selectionBadge}
          <button className="px-2 py-1 rounded bg-slate-900 text-slate-400 text-xs border border-slate-800">‹</button>
          <button className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-xs">1</button>
          <button className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 text-xs hover:bg-slate-800">2</button>
          <button className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 text-xs hover:bg-slate-800">3</button>
          <button className="px-2 py-1 rounded bg-slate-900 text-slate-400 text-xs border border-slate-800">›</button>
        </div>
      );
    }

    // Chunk 5: Feedback & Status
    if (node.type === 'spinner') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' inline-flex items-center justify-center p-3 select-none'}
        >
          {selectionBadge}
          <RotateCw size={24} className="text-indigo-500 animate-spin" />
        </div>
      );
    }

    if (node.type === 'skeleton') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' space-y-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl select-none'}
        >
          {selectionBadge}
          <div className="w-1/3 h-3 bg-slate-700/60 rounded animate-pulse" />
          <div className="w-full h-8 bg-slate-800/80 rounded-lg animate-pulse" />
          <div className="w-4/5 h-3 bg-slate-700/40 rounded animate-pulse" />
        </div>
      );
    }

    if (node.type === 'toast') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-3 bg-slate-900/95 border border-emerald-500/50 rounded-xl shadow-2xl flex items-center justify-between gap-3 select-none'}
        >
          {selectionBadge}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check size={12} />
            </div>
            <span className="text-xs font-semibold text-white">{node.content || 'Enlace copiado al portapapeles'}</span>
          </div>
          <span className="text-[10px] text-slate-500">Hace 2s</span>
        </div>
      );
    }

    if (node.type === 'banner') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between select-none'}
        >
          {selectionBadge}
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-amber-200 leading-snug">
              {node.content || 'Modo de mantenimiento activo. Algunas funciones pueden estar limitadas.'}
            </span>
          </div>
          <button className="text-amber-400 hover:text-white p-1 text-xs">✕</button>
        </div>
      );
    }

    // Chunk 6: Information & Multimedia
    if (node.type === 'tooltip') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' relative inline-block select-none'}
        >
          {selectionBadge}
          <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl inline-flex items-center gap-1">
            <span>{node.content || 'Explicación del elemento'}</span>
          </div>
        </div>
      );
    }

    if (node.type === 'table') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          style={inlineStyles}
          className={baseClass + ' border border-slate-800 rounded-xl overflow-hidden select-none shadow-sm'}
        >
          {selectionBadge}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <th className="p-2 font-semibold">Elemento</th>
                <th className="p-2 font-semibold">Estado</th>
                <th className="p-2 font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="p-2">Material Design</td>
                <td className="p-2"><span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Activo</span></td>
                <td className="p-2 font-mono text-indigo-300">100%</td>
              </tr>
              <tr>
                <td className="p-2">Carbon System</td>
                <td className="p-2"><span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">Listo</span></td>
                <td className="p-2 font-mono text-indigo-300">40 comp</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (node.type === 'media_player') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          onMouseLeave={handleNodeMouseLeave}
          style={inlineStyles}
          className={baseClass + ' p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-2.5 select-none shadow-lg'}
        >
          {selectionBadge}
          {youtubeId ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full h-24 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 relative overflow-hidden">
              {videoBackgroundOverlay}
              <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 relative z-10">
                <Play size={18} className="fill-current ml-0.5" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold truncate">{node.content || (youtubeId ? 'Video de YouTube' : 'Pista de Sonido / Audio UI')}</span>
            <span className="text-[10px] font-mono text-indigo-400">{youtubeId ? 'En vivo' : '01:24 / 03:40'}</span>
          </div>
          {!youtubeId && (
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-indigo-500 rounded-full" />
            </div>
          )}
        </div>
      );
    }


    if (node.type === 'vector') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          onMouseLeave={handleNodeMouseLeave}
          style={inlineStyles}
          className={baseClass + ' flex items-center justify-center overflow-hidden'}
        >
          {selectionBadge}
          <svg
            viewBox="0 0 420 340"
            className="w-full h-full drop-shadow-md"
            style={{ overflow: 'visible' }}
          >
            <path
              d={node.svgPath || 'M 50 50 L 150 50 L 100 120 Z'}
              fill={node.styles.backgroundColor && node.styles.backgroundColor !== 'transparent' ? node.styles.backgroundColor : 'rgba(99, 102, 241, 0.25)'}
              stroke={node.styles.borderColor || '#6366f1'}
              strokeWidth={node.styles.borderWidth ? parseInt(node.styles.borderWidth) : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
          onMouseLeave={handleNodeMouseLeave}
          onDragOver={(e) => handleDragOver(e, node.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node.id)}
          style={inlineStyles}
          className={baseClass + (node.styles.backgroundVideo || youtubeEmbed ? ' overflow-hidden' : '')}
        >
          {selectionBadge}
          {videoBackgroundOverlay}
          {youtubeEmbed}
          {node.content && !youtubeEmbed && <span className="relative z-10">{node.content}</span>}
          {node.children && node.children.map(child => renderNode(child))}
        </div>
      );
  };

  return (
    <div 
      className="flex-1 neo-canvas-grid relative overflow-auto flex items-center justify-center p-12 select-none"
      onClick={() => onSelectNode(null)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setCursorPos(undefined)}
    >
      {/* Precision Graduated Rulers & Guides */}
      {showRulers && <CanvasRulers zoom={zoom} cursorPos={cursorPos} />}

      {/* Freehand Drawing Canvas Overlay */}
      <DrawingLayer
        isActive={isDrawingActive}
        onClose={onCloseDrawing}
        strokes={strokes}
        onUpdateStrokes={onUpdateStrokes}
      />

      {/* Interactive Collaboration & Design Comments Overlay */}
      <CommentsLayer
        isActive={isCommentsActive}
        comments={comments}
        onAddComment={onAddComment}
        onResolveComment={onResolveComment}
        onDeleteComment={onDeleteComment}
      />

      {/* Device Frame Wrapper with Zoom Scale */}
      <div
        style={{
          transform: 'scale(' + zoom + ')',
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Device Header label with HUD Telemetry */}
        <div className="mb-2 neo-hud-badge flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          <span className="neo-hud-dot bg-cyan-400 text-cyan-400" />
          <span className="font-bold tracking-wider">{currentDevice.name.toUpperCase()}</span>
          <span className="opacity-50">•</span>
          <span className="opacity-80 font-mono">{currentDevice.width} × {currentDevice.height}</span>
        </div>

        {/* Device Frame with Chiseled Titanium Edge & Atmospheric Glow */}
        <div
          id="device-mockup-frame"
          style={{
            width: currentDevice.width,
            height: currentDevice.height,
            borderRadius: currentDevice.radius,
          }}
          className="bg-[#030712] border-[5px] border-slate-800/90 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_35px_rgba(99,102,241,0.14)] relative overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-white/15"
        >
          {/* 8px Alignment Grid Overlay */}
          {isGridActive && (
            <div
              className="absolute inset-0 pointer-events-none z-20 opacity-30"
              style={{
                backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
          )}

          {/* Mock Notch for mobile frame */}
          {deviceMode === 'mobile' && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>
          )}

          {/* Render Active Mockup Node Hierarchy with Transition Effect */}
          <div className={'w-full h-full overflow-y-auto pt-6 relative z-10 ' + (screenTransitionClass || '')}>
            {nodes.map(node => renderNode(node))}
          </div>
        </div>
      </div>
    </div>
  );
};
