import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  Upload, 
  Bot, 
  Volume2, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Pencil,
  Plus,
  Palette,
  MessageSquare,
  Undo2,
  Redo2,
  LayoutTemplate,
  Grid,
  Camera,
  Network,
  Maximize2,
  Code2,
  PenTool,
  Save,
  Sun,
  Moon,
  Wand2,
  Ruler,
  ChevronDown,
  FolderOpen,
  Eye,
  Sliders
} from 'lucide-react';
import type { DeviceMode, ScreenDefinition } from '../lib/types';
import { DesignForgeLogo } from './DesignForgeBrand';

interface TopbarProps {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onExportZip: () => void;
  onExportReactProject?: () => void;
  onImportZip: (file: File) => void;
  onToggleAiPanel: () => void;
  isAiPanelOpen: boolean;
  onToggleSoundLab: () => void;
  isSoundLabOpen: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  // Screens & Navigation
  screens: ScreenDefinition[];
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  onAddScreen: () => void;
  // Freehand Drawing Mode
  isDrawingActive: boolean;
  onToggleDrawing: () => void;
  // Design Tokens System
  onToggleDesignTokens: () => void;
  // Canvas Comments Mode
  isCommentsActive: boolean;
  onToggleComments: () => void;
  // History Undo & Redo
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // Templates Modal
  onOpenTemplates: () => void;
  // 8px Alignment Grid
  isGridActive: boolean;
  onToggleGrid: () => void;
  // PNG Snapshot Export
  onExportPng: () => void;
  // Flow View Mode
  isFlowViewOpen: boolean;
  onToggleFlowView: () => void;
  // Presentation Mode
  onOpenPresentation?: () => void;
  // Animation Studio
  onToggleAnimationStudio?: () => void;
  // Vector Studio (Figma / Illustrator / Affinity)
  onToggleVectorStudio?: () => void;
  // Pro Features: Persistence, AI Generator, Theme Swapping & Rulers
  onSaveSnapshot?: () => void;
  onExportForgeFile?: () => void;
  onImportForgeFile?: (file: File) => void;
  onOpenAiScreenGenerator?: () => void;
  onToggleThemeMode?: () => void;
  currentThemeMode?: 'dark' | 'light';
  showRulers?: boolean;
  onToggleRulers?: () => void;
  isSaving?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  deviceMode,
  setDeviceMode,
  zoom,
  setZoom,
  onExportZip,
  onImportZip,
  onToggleAiPanel,
  isAiPanelOpen,
  onToggleSoundLab,
  isSoundLabOpen,
  isPreviewMode,
  setIsPreviewMode,
  screens,
  activeScreenId,
  onSelectScreen,
  onAddScreen,
  isDrawingActive,
  onToggleDrawing,
  onToggleDesignTokens,
  isCommentsActive,
  onToggleComments,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenTemplates,
  isGridActive,
  onToggleGrid,
  onExportPng,
  isFlowViewOpen,
  onToggleFlowView,
  onOpenPresentation,
  onExportReactProject,
  onToggleAnimationStudio,
  onToggleVectorStudio,
  onSaveSnapshot,
  onExportForgeFile,
  onImportForgeFile,
  onOpenAiScreenGenerator,
  onToggleThemeMode,
  currentThemeMode = 'dark',
  showRulers = true,
  onToggleRulers,
  isSaving = false,
}) => {
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<'project' | 'view' | 'studios' | 'export' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const forgeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportZip(file);
      setOpenDropdown(null);
    }
  };

  const handleForgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportForgeFile) {
      onImportForgeFile(file);
      setOpenDropdown(null);
    }
  };

  return (
    <header ref={dropdownRef} className="neo-glass-panel border-x-0 border-t-0 rounded-none select-none z-30 transition-all flex flex-col">
      {/* Hidden File Inputs */}
      <input type="file" ref={fileInputRef} accept=".zip" className="hidden" onChange={handleFileChange} />
      <input type="file" ref={forgeInputRef} accept=".forge,.json" className="hidden" onChange={handleForgeChange} />

      {/* ========================================================================= */}
      {/* ROW 1: PRIMARY APP BAR (Brand, Dropdown Menus, Center Viewport, Run/Export) */}
      {/* ========================================================================= */}
      <div className="h-11 px-3.5 flex items-center justify-between border-b border-white/[0.06] text-slate-300">
        
        {/* Left: Brand + Professional Dropdown Menus (Figma style) */}
        <div className="flex items-center gap-2">
          {/* Official DesignForge Logo & Title */}
          <div className="mr-3 pl-0.5">
            <DesignForgeLogo showStudioBadge={false} />
          </div>

          {/* 1. Menú Proyecto / Archivo */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'project' ? null : 'project')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ' + (
                openDropdown === 'project' 
                  ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20' 
                  : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10'
              )}
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Proyecto</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {openDropdown === 'project' && (
              <div className="absolute left-0 top-full mt-1.5 w-60 neo-glass-panel rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border border-white/10">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Persistencia & Archivo</div>
                
                {onSaveSnapshot && (
                  <button
                    onClick={() => { onSaveSnapshot(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Guardar Snapshot</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Local</span>
                  </button>
                )}

                {onExportForgeFile && (
                  <button
                    onClick={() => { onExportForgeFile(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Descargar .forge</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">JSON</span>
                  </button>
                )}

                {onImportForgeFile && (
                  <button
                    onClick={() => { forgeInputRef.current?.click(); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Abrir archivo .forge</span>
                    </span>
                  </button>
                )}

                <div className="my-1 border-t border-slate-800/80" />

                <button
                  onClick={() => { onOpenTemplates(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LayoutTemplate className="w-3.5 h-3.5 text-pink-400" />
                    <span>Biblioteca de Plantillas</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Menú Vista & Lienzo */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'view' ? null : 'view')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ' + (
                openDropdown === 'view' 
                  ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20' 
                  : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10'
              )}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Lienzo</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {openDropdown === 'view' && (
              <div className="absolute left-0 top-full mt-1.5 w-60 neo-glass-panel rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border border-white/10">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Lienzo y Guías HUD</div>

                {onToggleRulers && (
                  <button
                    onClick={() => { onToggleRulers(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Reglas Graduadas (Rulers)</span>
                    </span>
                    <span className={'text-[10px] font-bold ' + (showRulers ? 'text-emerald-400' : 'text-slate-500')}>
                      {showRulers ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => { onToggleGrid(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Grid className="w-3.5 h-3.5 text-blue-400" />
                    <span>Rejilla de 8px</span>
                  </span>
                  <span className={'text-[10px] font-bold ' + (isGridActive ? 'text-emerald-400' : 'text-slate-500')}>
                    {isGridActive ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => { onToggleFlowView(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mapa de Flujo Multi-Pantalla</span>
                  </span>
                  <span className={'text-[10px] font-bold ' + (isFlowViewOpen ? 'text-emerald-400' : 'text-slate-500')}>
                    {isFlowViewOpen ? 'ON' : 'OFF'}
                  </span>
                </button>

                <div className="my-1 border-t border-white/[0.08]" />

                <button
                  onClick={() => { onToggleDrawing(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="w-3.5 h-3.5 text-pink-400" />
                    <span>Dibujo Libre sobre Canvas</span>
                  </span>
                  <span className={'text-[10px] font-bold ' + (isDrawingActive ? 'text-pink-400' : 'text-slate-500')}>
                    {isDrawingActive ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => { onToggleComments(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Notas y Comentarios</span>
                  </span>
                  <span className={'text-[10px] font-bold ' + (isCommentsActive ? 'text-amber-400' : 'text-slate-500')}>
                    {isCommentsActive ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => { onToggleDesignTokens(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tokens de Diseño Globales</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Menú Estudios Pro & IA */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'studios' ? null : 'studios')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ' + (
                openDropdown === 'studios' 
                  ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20' 
                  : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10'
              )}
            >
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              <span>Estudios Pro</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {openDropdown === 'studios' && (
              <div className="absolute left-0 top-full mt-1.5 w-60 neo-glass-panel rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border border-white/10">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Suites Especializadas</div>

                <button
                  onClick={() => { onToggleSoundLab(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sound Design Studio</span>
                    {isSoundLabOpen && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse" />}
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                    {isSoundLabOpen ? 'OPEN' : 'WebAudio'}
                  </span>
                </button>

                {onToggleVectorStudio && (
                  <button
                    onClick={() => { onToggleVectorStudio(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <PenTool className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vector & Shaper Studio</span>
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 rounded font-mono">Bézier</span>
                  </button>
                )}

                {onToggleAnimationStudio && (
                  <button
                    onClick={() => { onToggleAnimationStudio(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Animaciones & Profundidad</span>
                    </span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1 rounded font-mono">Keyframes</span>
                  </button>
                )}

                <div className="my-1 border-t border-white/[0.08]" />

                <button
                  onClick={() => { onToggleAiPanel(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Panel Asistente IA (Bridge)</span>
                  </span>
                  <span className={'text-[10px] px-1.5 py-0.5 rounded ' + (isAiPanelOpen ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-cyan-500/20 text-cyan-300')}>
                    {isAiPanelOpen ? 'Abierto' : 'Prompt'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Device Breakpoints & Quick Zoom */}
        <div className="flex items-center gap-2">
          {/* Breakpoints Selector */}
          <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-white/10 shadow-inner">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ' + (
                deviceMode === 'mobile' 
                  ? 'bg-gradient-to-b from-indigo-500/30 to-indigo-600/40 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)] border border-indigo-400/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}
              title="Breakpoint Móvil (390px)"
            >
              <Smartphone className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline font-mono text-[11px]">390px</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ' + (
                deviceMode === 'tablet' 
                  ? 'bg-gradient-to-b from-indigo-500/30 to-indigo-600/40 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)] border border-indigo-400/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}
              title="Breakpoint Tablet (768px)"
            >
              <Tablet className="w-3 h-3 text-indigo-400" />
              <span className="hidden md:inline font-mono text-[11px]">768px</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ' + (
                deviceMode === 'desktop' 
                  ? 'bg-gradient-to-b from-indigo-500/30 to-indigo-600/40 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)] border border-indigo-400/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}
              title="Breakpoint Escritorio (1200px)"
            >
              <Monitor className="w-3 h-3 text-pink-400" />
              <span className="hidden md:inline font-mono text-[11px]">1200px</span>
            </button>
          </div>

          {/* Quick Zoom & Reset */}
          <div className="hidden sm:flex items-center bg-black/50 px-2 py-0.5 rounded-lg border border-white/10 text-xs gap-1 shadow-inner">
            <button 
              onClick={() => setZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Alejar Zoom"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="w-9 text-center font-mono text-[11px] text-cyan-300 font-semibold">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(z => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Acercar Zoom"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setZoom(1.0)}
              className="p-1 text-slate-500 hover:text-cyan-300 rounded hover:bg-white/10 transition-colors"
              title="Restablecer (100%)"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Mode, Present, Export) */}
        <div className="flex items-center gap-2">
          {/* Global Theme Toggle */}
          {onToggleThemeMode && (
            <button
              onClick={onToggleThemeMode}
              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
              title={currentThemeMode === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {currentThemeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          )}

          {/* Interactive Mode Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ' + (
              isPreviewMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'neo-glass-btn text-slate-300 hover:text-white'
            )}
            title="Alternar entre modo Edición e Interactivo"
          >
            <Play className={'w-3 h-3 ' + (isPreviewMode ? 'fill-cyan-400 text-cyan-400' : '')} />
            <span className="hidden sm:inline">{isPreviewMode ? 'Interactivo' : 'Diseño'}</span>
          </button>

          {/* Full-Screen Presentation */}
          {onOpenPresentation && (
            <button
              onClick={onOpenPresentation}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg neo-glass-btn text-slate-300 hover:text-white transition-colors"
              title="Presentación a Pantalla Completa"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>Presentar</span>
            </button>
          )}

          {/* Menú Desplegable de Exportación */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'export' ? null : 'export')}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30 transition-all active:scale-95"
            >
              <Download className="w-3 h-3" />
              <span>Exportar</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {openDropdown === 'export' && (
              <div className="absolute right-0 top-full mt-1.5 w-64 neo-glass-panel rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border border-white/10">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Handoff & Producción</div>

                {onExportReactProject && (
                  <button
                    onClick={() => { onExportReactProject(); setOpenDropdown(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Proyecto React + Vite + Tailwind</span>
                    </span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1 rounded font-mono">ZIP</span>
                  </button>
                )}

                <button
                  onClick={() => { onExportZip(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Bundle HTML Offline Ejecutable</span>
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 rounded font-mono">ZIP</span>
                </button>

                <button
                  onClick={() => { onExportPng(); setOpenDropdown(null); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Captura Completa del Mockup</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">PNG</span>
                </button>

                <div className="my-1 border-t border-white/[0.08]" />

                <button
                  onClick={() => { fileInputRef.current?.click(); }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Importar Proyecto desde ZIP</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: WORKSPACE TABS & SCREEN BAR (Pestañas de Pantallas, IA Gen, Undo/Redo) */}
      {/* ========================================================================= */}
      <div className="h-9 px-3.5 flex items-center justify-between bg-black/40 backdrop-blur-md border-t border-white/[0.04] text-xs">
        
        {/* Left: Screen Tabs + Create New Screen */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-0.5 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1 hidden sm:inline font-mono">PANTALLAS:</span>

          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectScreen(s.id)}
              className={'px-3 py-1 rounded-md transition-all flex items-center gap-1.5 shrink-0 text-xs font-medium ' + (
                activeScreenId === s.id
                  ? 'bg-indigo-600/25 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.25)] border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}
            >
              <span>{s.name}</span>
            </button>
          ))}

          <button
            onClick={onAddScreen}
            className="p-1 px-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0 border border-transparent hover:border-white/10"
            title="Crear nueva pantalla vacía"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: AI Generator Button + Undo/Redo + Auto-save indicator */}
        <div className="flex items-center gap-2">
          {/* AI Generator Button in Secondary Bar */}
          {onOpenAiScreenGenerator && (
            <button
              onClick={onOpenAiScreenGenerator}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-pink-600/30 hover:from-cyan-600/50 hover:to-pink-600/50 text-white border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all"
              title="Generar pantalla completa con IA"
            >
              <Wand2 className="w-3 h-3 text-cyan-300" />
              <span>Generar Pantalla IA</span>
            </button>
          )}

          {/* Undo & Redo History */}
          <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-white/10">
            <button
              disabled={!canUndo}
              onClick={onUndo}
              className={'p-1 rounded transition-colors ' + (
                canUndo ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'
              )}
              title="Deshacer (Ctrl+Z)"
            >
              <Undo2 className="w-3 h-3" />
            </button>
            <button
              disabled={!canRedo}
              onClick={onRedo}
              className={'p-1 rounded transition-colors ' + (
                canRedo ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'
              )}
              title="Rehacer (Ctrl+Y)"
            >
              <Redo2 className="w-3 h-3" />
            </button>
          </div>

          {/* Auto-save status dot (Aerospace HUD telemetry) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className={'neo-hud-dot ' + (isSaving ? 'bg-amber-400 text-amber-400' : 'bg-emerald-400 text-emerald-400')} />
            <span>{isSaving ? 'GUARDANDO...' : 'SYNC READY'}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
