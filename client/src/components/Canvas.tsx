import React, { useState } from 'react';
import type { DesignNode, DeviceMode, DrawingStroke, CanvasComment } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';
import { DrawingLayer } from './DrawingLayer';
import { CommentsLayer } from './CommentsLayer';
import * as LucideIcons from 'lucide-react';
import { ChevronLeft, MoreVertical, Home, Search, Compass, User, TrendingUp } from 'lucide-react';

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
}) => {
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);

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

    const handleNodeMouseEnter = () => {
      if (node.sounds?.onHover) {
        soundEngine.playProceduralSound(node.sounds.onHover);
      }
    };

    const inlineStyles: React.CSSProperties = {
      backgroundColor: node.styles.backgroundColor,
      backgroundImage: node.styles.backgroundGradient || undefined,
      color: node.styles.color,
      borderRadius: node.styles.borderRadius,
      padding: node.styles.padding,
      margin: node.styles.margin,
      fontSize: node.styles.fontSize,
      fontWeight: node.styles.fontWeight,
      fontFamily: node.styles.fontFamily ? `'${node.styles.fontFamily}', sans-serif` : undefined,
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
      <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow z-20 flex items-center gap-1.5 pointer-events-none whitespace-nowrap">
        <span>{node.name}</span>
        {node.action && node.action.type !== 'none' && (
          <span className="bg-indigo-900 px-1 rounded text-[9px] text-indigo-200">
            {node.action.type === 'navigate' ? '🔀 ' + node.action.targetScreenId : node.action.type === 'modal' ? '🪟 Modal' : node.action.type === 'confetti' ? '🎉 Confeti' : node.action.type === 'copy_clipboard' ? '📋 Copiar' : '⚡ Acción'}
          </span>
        )}
        {node.sounds?.onClick && <span className="text-amber-300">🔊 {node.sounds.onClick}</span>}
      </div>
    );

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
          className={baseClass + ' select-none active:scale-[0.98] inline-flex items-center justify-center gap-2'}
        >
          {selectionBadge}
          {IconComponent && <IconComponent size={16} />}
          <span>{node.content}</span>
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

    if (node.type === 'vector') {
      return (
        <div
          key={node.id}
          id={node.id}
          onClick={handleNodeClick}
          onMouseEnter={handleNodeMouseEnter}
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
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
        style={inlineStyles}
        className={baseClass}
      >
        {selectionBadge}
        {node.content}
        {node.children && node.children.map(child => renderNode(child))}
      </div>
    );
  };

  return (
    <div 
      className="flex-1 bg-slate-950 relative overflow-auto flex items-center justify-center p-12 select-none"
      onClick={() => onSelectNode(null)}
      style={{
        backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
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
        {/* Device Header label */}
        <div className="mb-2 text-xs font-mono text-slate-500 font-medium tracking-wide">
          {currentDevice.name}
        </div>

        {/* Device Frame */}
        <div
          id="device-mockup-frame"
          style={{
            width: currentDevice.width,
            height: currentDevice.height,
            borderRadius: currentDevice.radius,
          }}
          className="bg-slate-950 border-[5px] border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-white/5"
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
