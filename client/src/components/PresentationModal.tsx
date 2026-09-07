import React, { useEffect } from 'react';
import type { ScreenDefinition, DeviceMode } from '../lib/types';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';
import { soundEngine } from '../lib/audio-engine';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  screens: ScreenDefinition[];
  activeScreenId: string;
  onSelectScreen: (id: string) => void;
  deviceMode: DeviceMode;
  onExecuteAction: (action: any) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  screens,
  activeScreenId,
  onSelectScreen,
  deviceMode,
  onExecuteAction,
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentScreen = screens.find((s) => s.id === activeScreenId) || screens[0];

  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: '380px', minHeight: '740px', maxHeight: '88vh' };
      case 'tablet':
        return { width: '680px', minHeight: '800px', maxHeight: '90vh' };
      case 'desktop':
        return { width: '1020px', minHeight: '660px', maxHeight: '90vh' };
    }
  };

  const dims = getDeviceDimensions();

  // Recursive element renderer for live presentation
  const renderInteractiveNode = (node: any): React.ReactNode => {
    const inlineStyles: React.CSSProperties = {
      backgroundColor: node.styles?.backgroundColor,
      backgroundImage: node.styles?.backgroundGradient || undefined,
      color: node.styles?.color,
      borderRadius: node.styles?.borderRadius,
      padding: node.styles?.padding,
      margin: node.styles?.margin,
      fontSize: node.styles?.fontSize,
      fontWeight: node.styles?.fontWeight,
      fontFamily: node.styles?.fontFamily ? `'${node.styles.fontFamily}', sans-serif` : undefined,
      letterSpacing: node.styles?.letterSpacing,
      lineHeight: node.styles?.lineHeight,
      textAlign: node.styles?.textAlign,
      textTransform: node.styles?.textTransform,
      borderWidth: node.styles?.borderWidth,
      borderColor: node.styles?.borderColor,
      borderStyle: (node.styles?.borderStyle as any) || (node.styles?.borderWidth ? 'solid' : undefined),
      boxShadow: node.styles?.boxShadow,
      backdropFilter: node.styles?.backdropFilter,
      display: node.styles?.display || 'block',
      flexDirection: (node.styles?.flexDirection as any) || 'row',
      alignItems: (node.styles?.alignItems as any) || 'stretch',
      justifyContent: (node.styles?.justifyContent as any) || 'flex-start',
      gap: node.styles?.gap,
      width: node.styles?.width,
      height: node.styles?.height,
      minWidth: node.styles?.minWidth,
      maxWidth: node.styles?.maxWidth,
      minHeight: node.styles?.minHeight,
      maxHeight: node.styles?.maxHeight,
      opacity: node.styles?.opacity ? Number(node.styles.opacity) : 1,
      zIndex: node.styles?.zIndex !== undefined ? Number(node.styles.zIndex) : undefined,
      position: (node.styles?.position as any) || (node.styles?.zIndex ? 'relative' : undefined),
      top: node.styles?.top,
      left: node.styles?.left,
      right: node.styles?.right,
      bottom: node.styles?.bottom,
      transition: 'all 0.15s ease-in-out',
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.sounds?.onClick) {
        soundEngine.playProceduralSound(node.sounds.onClick);
      }
      if (node.action && node.action.type !== 'none') {
        onExecuteAction(node.action);
      }
    };

    const handleMouseEnter = () => {
      if (node.sounds?.onHover) {
        soundEngine.playProceduralSound(node.sounds.onHover);
      }
    };

    if (node.type === 'button') {
      const IconComp = node.iconName && (LucideIcons as any)[node.iconName] ? (LucideIcons as any)[node.iconName] : null;
      return (
        <button
          key={node.id}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          style={inlineStyles}
          className="select-none active:scale-95 transition-transform inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          {IconComp && <IconComp size={16} />}
          <span>{node.content}</span>
        </button>
      );
    }

    if (node.type === 'badge') {
      const IconComp = node.iconName && (LucideIcons as any)[node.iconName] ? (LucideIcons as any)[node.iconName] : null;
      return (
        <span
          key={node.id}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          style={inlineStyles}
          className="select-none inline-flex items-center gap-1.5 cursor-pointer"
        >
          {IconComp && <IconComp size={12} />}
          <span>{node.content}</span>
        </span>
      );
    }

    if (node.type === 'text') {
      return (
        <div key={node.id} onClick={handleClick} onMouseEnter={handleMouseEnter} style={inlineStyles}>
          {node.content}
        </div>
      );
    }

    if (node.type === 'input') {
      return (
        <div key={node.id} style={inlineStyles}>
          <input
            type="text"
            placeholder={node.placeholder || 'Escribe aquí...'}
            className="w-full bg-transparent outline-none border-none text-inherit placeholder-slate-500 text-sm font-inherit"
          />
        </div>
      );
    }

    if (node.type === 'image') {
      return (
        <div key={node.id} onClick={handleClick} onMouseEnter={handleMouseEnter} style={{ ...inlineStyles, overflow: 'hidden' }}>
          <img
            src={node.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
            alt={node.name || 'Image'}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>
      );
    }

    if (node.type === 'avatar') {
      return (
        <div key={node.id} onClick={handleClick} onMouseEnter={handleMouseEnter} style={inlineStyles} className="inline-flex items-center gap-3 cursor-pointer">
          <img
            src={node.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-tight">{node.content || 'Usuario'}</span>
            <span className="text-[10px] text-slate-400 leading-tight">En línea</span>
          </div>
        </div>
      );
    }

    const children = node.children?.map(renderInteractiveNode);

    return (
      <div key={node.id} onClick={handleClick} onMouseEnter={handleMouseEnter} style={inlineStyles}>
        {node.content}
        {children}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center animate-fade-in select-none">
      {/* Discreet Presentation Floating Top Control Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-slate-300">Modo Presentación</span>
        <div className="h-3 w-px bg-slate-700" />
        <span className="text-[11px] text-slate-400 font-mono">{currentScreen.name}</span>

        {/* Screen Switcher */}
        {screens.length > 1 && (
          <div className="flex items-center gap-1 ml-2">
            {screens.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectScreen(sc.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  sc.id === activeScreenId ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        )}

        <div className="h-3 w-px bg-slate-700" />

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1 hover:bg-slate-800 px-2 py-0.5 rounded-full transition-colors"
          title="Salir (Esc)"
        >
          <X className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>
      </div>

      {/* Centered Device Simulation Frame */}
      <div
        className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300 relative"
        style={{
          width: dims.width,
          minHeight: dims.minHeight,
          maxHeight: dims.maxHeight,
        }}
      >
        {/* Device Status Bar */}
        <div className="h-7 bg-slate-900/90 border-b border-slate-800/60 px-5 flex items-center justify-between text-[10px] text-slate-400 select-none">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full" />
          <div className="flex items-center gap-1.5">
            <span className="text-[9px]">5G</span>
            <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Interactive Screen Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative flex flex-col">
          {renderInteractiveNode(currentScreen.rootNode)}
        </div>
      </div>
    </div>
  );
};
