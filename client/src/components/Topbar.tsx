import React from 'react';
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
  Code2
} from 'lucide-react';
import type { DeviceMode, ScreenDefinition } from '../lib/types';

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
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportZip(file);
    }
  };

  return (
    <header className="h-12 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 px-3 flex items-center justify-between text-slate-400 select-none z-30 transition-all">
      {/* Brand & Screens Tabs */}
      <div className="flex items-center gap-2.5">
        {/* Brand */}
        <div className="flex items-center gap-2 font-semibold text-white tracking-tight text-xs">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline font-bold">DesignForge</span>
        </div>

        <div className="h-4 w-px bg-slate-800/80 mx-0.5" />

        {/* Screen Switcher Pills */}
        <div className="flex items-center gap-0.5 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50">
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectScreen(s.id)}
              className={'px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ' + (
                activeScreenId === s.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              )}
            >
              <span>{s.name}</span>
            </button>
          ))}

          <button
            onClick={onAddScreen}
            className="p-1 px-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md text-xs transition-colors"
            title="Crear nueva ventana/pantalla"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Templates Button */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/60 transition-all"
          title="Abrir biblioteca de plantillas completas"
        >
          <LayoutTemplate className="w-3 h-3 text-indigo-400" />
          <span className="hidden xl:inline">Plantillas</span>
        </button>

        {/* Undo & Redo History Controls */}
        <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className={'p-1 rounded-md transition-colors ' + (
              canUndo ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 cursor-not-allowed'
            )}
            title="Deshacer cambio (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className={'p-1 rounded-md transition-colors ' + (
              canRedo ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 cursor-not-allowed'
            )}
            title="Rehacer cambio (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Viewport Toggle */}
        <div className="hidden lg:flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={'flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md transition-colors ' + (
              deviceMode === 'mobile'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            <Smartphone className="w-3 h-3" />
            <span>Móvil</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={'flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md transition-colors ' + (
              deviceMode === 'tablet'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            <Tablet className="w-3 h-3" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={'flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md transition-colors ' + (
              deviceMode === 'desktop'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            <Monitor className="w-3 h-3" />
            <span>Web</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport Zoom & Tools */}
      <div className="flex items-center gap-1.5">
        {/* Zoom */}
        <div className="flex items-center bg-slate-900/60 px-1.5 py-0.5 rounded-lg border border-slate-800/50 text-xs gap-1">
          <button 
            onClick={() => setZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded"
            title="Alejar Zoom"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-mono text-[11px] text-slate-300">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(z => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded"
            title="Acercar Zoom"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setZoom(1.0)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded"
            title="Restablecer (100%)"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Minimal Tool Icons Group */}
        <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/50">
          {/* Drawing Mode Toggle */}
          <button
            onClick={onToggleDrawing}
            className={'p-1.5 rounded-md transition-all ' + (
              isDrawingActive
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Modo Dibujo libre"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Design Tokens */}
          <button
            onClick={onToggleDesignTokens}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-md transition-all"
            title="Tokens Globales del Sistema de Diseño"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Comments Notes */}
          <button
            onClick={onToggleComments}
            className={'p-1.5 rounded-md transition-all ' + (
              isCommentsActive
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Modo Comentarios y Notas"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* 8px Alignment Grid */}
          <button
            onClick={onToggleGrid}
            className={'p-1.5 rounded-md transition-all ' + (
              isGridActive
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
            title="Alternar rejilla de alineación de 8px"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Capture PNG */}
          <button
            onClick={onExportPng}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/40 rounded-md transition-all"
            title="Capturar y exportar mockup como imagen PNG"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Flow View Overview Mode */}
          <button
            onClick={onToggleFlowView}
            className={'p-1.5 rounded-md transition-all ' + (
              isFlowViewOpen
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-purple-400 hover:bg-slate-800/40'
            )}
            title="Vista de Mapa de Flujo Multi-Pantalla (Flow View)"
          >
            <Network className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Interactive Testing Mode Toggle */}
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ' + (
            isPreviewMode
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
              : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/50'
          )}
          title="Alternar entre modo Edición e Interactivo"
        >
          <Play className={'w-3 h-3 ' + (isPreviewMode ? 'fill-emerald-400' : '')} />
          <span>{isPreviewMode ? 'Interactivo' : 'Diseño'}</span>
        </button>

        {/* Full Screen Presentation Mode */}
        {onOpenPresentation && (
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/50 transition-all"
            title="Modo Presentación a Pantalla Completa (Figma Presentation)"
          >
            <Maximize2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden lg:inline">Presentar</span>
          </button>
        )}
      </div>

      {/* Action Buttons: Sound Lab, AI Bridge, Export/Import */}
      <div className="flex items-center gap-1.5">
        {/* Sound Studio Toggle */}
        <button
          onClick={onToggleSoundLab}
          className={'p-1.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-lg transition-colors border ' + (
            isSoundLabOpen
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800/50'
          )}
          title="Estudio de Sonidos UI & Sintetizador"
        >
          <Volume2 className="w-3.5 h-3.5 sm:hidden" />
          <span className="hidden sm:inline">Sonido</span>
        </button>

        {/* Animation Studio Toggle */}
        {onToggleAnimationStudio && (
          <button
            onClick={onToggleAnimationStudio}
            className="p-1.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-lg transition-colors border bg-slate-900/60 text-pink-400 hover:text-pink-300 hover:bg-slate-800/60 border-slate-800/50 flex items-center gap-1"
            title="Estudio de Animaciones CSS & Profundidad"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Animación</span>
          </button>
        )}

        {/* AI Agent Bridge Toggle */}
        <button
          onClick={onToggleAiPanel}
          className={'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors border ' + (
            isAiPanelOpen
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/60 border-slate-800/50'
          )}
        >
          <Bot className="w-3 h-3 text-indigo-400" />
          <span className="hidden sm:inline">IA</span>
        </button>

        <div className="h-4 w-px bg-slate-800/80 mx-0.5" />

        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".zip" 
          className="hidden" 
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 sm:px-2.5 sm:py-1 text-xs font-medium bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800/50 transition-colors flex items-center gap-1"
          title="Importar Proyecto ZIP"
        >
          <Upload className="w-3 h-3" />
          <span className="hidden md:inline">Importar</span>
        </button>

        {/* Export React + Vite Project */}
        {onExportReactProject && (
          <button
            onClick={onExportReactProject}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-850 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg shadow-sm transition-colors"
            title="Exportar Proyecto React + Vite completo con Tailwind y componentes"
          >
            <Code2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">React + Vite</span>
          </button>
        )}

        <button
          onClick={onExportZip}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors"
          title="Descargar ZIP ejecutable offline con sonidos y código"
        >
          <Download className="w-3 h-3" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
