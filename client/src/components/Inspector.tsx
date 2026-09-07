import React, { useState } from 'react';
import { 
  Volume2, 
  Type, 
  Square, 
  Palette, 
  Maximize2, 
  Layers,
  Trash2,
  Zap,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Code2,
  Sliders,
  MessageSquare,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Layers2,
  Download,
  SunMoon,
  Wand2,
  Image as ImageIcon,
  Smile,
  PenTool,
  Upload,
  Camera,
  Film
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { DesignNode, ScreenDefinition, CustomAnimationDefinition } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';
import { generateCssCode, generateTailwindClasses, generateReactJsx } from '../lib/code-generator';
import { LUCIDE_ICONS_LIST, STOCK_PHOTOS } from '../lib/assets-library';
import { AutoLayoutControl } from './AutoLayoutControl';
import { A11yContrastChecker } from './A11yContrastChecker';
import { 
  FONT_FAMILIES_CATALOG, 
  FONT_CATEGORIES, 
  TEXT_EFFECTS_PRESETS, 
  TEXT_GRADIENTS_PRESETS 
} from '../lib/typography-library';

interface InspectorProps {
  selectedNode: DesignNode | null;
  screens: ScreenDefinition[];
  onUpdateStyle: (nodeId: string, styleKey: string, value: string) => void;
  onUpdateSound: (nodeId: string, trigger: 'onClick' | 'onHover', soundType: string | undefined) => void;
  onUpdateContent: (nodeId: string, content: string) => void;
  onUpdateAction: (nodeId: string, action: DesignNode['action']) => void;
  onUpdateProperty?: (nodeId: string, key: keyof DesignNode, value: any) => void;
  onDeleteNode: (nodeId: string) => void;
  customAnimations?: CustomAnimationDefinition[];
  onMoveDepth?: (direction: 'front' | 'back' | 'forward' | 'backward') => void;
  onOpenAnimationStudio?: () => void;
  onOpenSoundLab?: () => void;
  onOpenVectorStudio?: () => void;
  onExportNodePng?: (nodeId: string, nodeName: string) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedNode,
  screens,
  onUpdateStyle,
  onUpdateSound,
  onUpdateContent,
  onUpdateAction,
  onUpdateProperty,
  onDeleteNode,
  customAnimations = [],
  onMoveDepth,
  onOpenAnimationStudio,
  onOpenSoundLab,
  onOpenVectorStudio,
  onExportNodePng,
}) => {
  if (!selectedNode) {
    return (
      <aside className="w-80 bg-slate-950/80 backdrop-blur-md border-l border-slate-800/60 p-6 flex flex-col items-center justify-center text-center text-slate-500 select-none">
        <Layers className="w-8 h-8 text-slate-700 mb-2.5 opacity-60" />
        <h3 className="text-xs font-semibold text-slate-400">Sin selección</h3>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
          Haz clic en cualquier elemento en el lienzo para ajustar sus propiedades.
        </p>
      </aside>
    );
  }

  const [activeTab, setActiveTab] = useState<'design' | 'dev'>('design');
  const [codeFormat, setCodeFormat] = useState<'tailwind' | 'css' | 'jsx'>('tailwind');
  const [copied, setCopied] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [photoCategory, setPhotoCategory] = useState<'avatars' | 'products' | 'tech' | 'abstract'>('avatars');
  const [fontCategoryFilter, setFontCategoryFilter] = useState<string>('all');

  const filteredFontFamilies = fontCategoryFilter === 'all'
    ? FONT_FAMILIES_CATALOG
    : FONT_FAMILIES_CATALOG.filter(f => f.category === fontCategoryFilter);

  const filteredIcons = LUCIDE_ICONS_LIST.filter(icon => 
    icon.name.toLowerCase().includes(iconSearch.toLowerCase())
  ).slice(0, 36);

  const filteredPhotos = STOCK_PHOTOS.filter(photo => photo.category === photoCategory);

  const { styles, sounds, action } = selectedNode;

  const handleCopyCode = () => {
    let text = '';
    if (codeFormat === 'tailwind') text = generateTailwindClasses(selectedNode);
    else if (codeFormat === 'css') text = generateCssCode(selectedNode);
    else if (codeFormat === 'jsx') text = generateReactJsx(selectedNode);

    navigator.clipboard.writeText(text);
    soundEngine.playProceduralSound('chime');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    if (codeFormat === 'tailwind') return generateTailwindClasses(selectedNode);
    if (codeFormat === 'css') return generateCssCode(selectedNode);
    return generateReactJsx(selectedNode);
  };

  return (
    <aside className="w-80 bg-slate-950/80 backdrop-blur-md border-l border-slate-800/60 flex flex-col h-full text-slate-300 select-none overflow-y-auto">
      {/* Element Header */}
      <div className="h-11 px-3.5 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/40 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800 uppercase">
            {selectedNode.type}
          </span>
          <h2 className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
            {selectedNode.name}
          </h2>
        </div>
        
        {/* Action Controls: Export PNG & Delete */}
        <div className="flex items-center gap-1">
          {onExportNodePng && (
            <button
              onClick={() => onExportNodePng(selectedNode.id, selectedNode.name)}
              className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
              title="Exportar este elemento como asset PNG aislado"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
          {selectedNode.id !== 'app-root' && selectedNode.id !== 'app-root-details' && (
            <button
              onClick={() => onDeleteNode(selectedNode.id)}
              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              title="Eliminar elemento"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher: Design vs Dev Mode (Handoff) */}
      <div className="flex border-b border-slate-800/50 bg-slate-900/30 p-1">
        <button
          onClick={() => setActiveTab('design')}
          className={'flex-1 py-1 text-[11px] font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ' + (
            activeTab === 'design' 
              ? 'bg-slate-800 text-white shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Sliders className="w-3 h-3" />
          <span>Diseño</span>
        </button>
        <button
          onClick={() => setActiveTab('dev')}
          className={'flex-1 py-1 text-[11px] font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ' + (
            activeTab === 'dev' 
              ? 'bg-slate-800 text-white shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Code2 className="w-3 h-3" />
          <span>Dev Mode</span>
        </button>
      </div>

      {/* DEV MODE (CODE INSPECTION & HANDOFF) */}
      {activeTab === 'dev' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Formato:</span>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setCodeFormat('tailwind')}
                className={'px-2 py-1 rounded-md transition-colors ' + (codeFormat === 'tailwind' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white')}
              >
                Tailwind
              </button>
              <button
                onClick={() => setCodeFormat('css')}
                className={'px-2 py-1 rounded-md transition-colors ' + (codeFormat === 'css' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white')}
              >
                CSS
              </button>
              <button
                onClick={() => setCodeFormat('jsx')}
                className={'px-2 py-1 rounded-md transition-colors ' + (codeFormat === 'jsx' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white')}
              >
                React JSX
              </button>
            </div>
          </div>

          <div className="relative group">
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-72 leading-relaxed selection:bg-emerald-900 selection:text-white">
              {getCodeSnippet()}
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1 text-[11px] shadow"
              title="Copiar código al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">ID del elemento:</span>
              <span className="font-mono text-slate-300">{selectedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tipo de nodo:</span>
              <span className="font-mono text-indigo-400">{selectedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dimensiones calculadas:</span>
              <span className="font-mono text-slate-300">{styles.width || 'auto'} × {styles.height || 'auto'}</span>
            </div>
          </div>
        </div>
      )}

      {/* DESIGN MODE PANEL */}
      {activeTab === 'design' && (

      <div className="p-4 space-y-5">
        {/* Vector Studio Direct Launch & SVG Path Editor */}
        {selectedNode.type === 'vector' && (
          <div className="space-y-3 p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-indigo-400" />
                <span>Geometría Vectorial</span>
              </span>
              {onOpenVectorStudio && (
                <button
                  type="button"
                  onClick={onOpenVectorStudio}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg shadow flex items-center gap-1 transition-colors"
                >
                  <PenTool className="w-2.5 h-2.5" />
                  <span>Abrir Estudio</span>
                </button>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Trazado SVG Path (d):</label>
              <textarea
                rows={3}
                value={selectedNode.svgPath || ''}
                onChange={(e) => onUpdateProperty?.(selectedNode.id, 'svgPath', e.target.value)}
                placeholder="M 50 50 L 150 50 L 100 120 Z"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-indigo-200 font-mono resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Global Vector Studio Access shortcut button for ANY element in Edit mode */}
        {onOpenVectorStudio && (
          <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-[11px] text-slate-300 font-medium">Herramientas Vectoriales</div>
            </div>
            <button
              type="button"
              onClick={onOpenVectorStudio}
              className="text-[10px] bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-2 py-1 rounded-md transition-colors font-medium"
            >
              Figma & Illustrator ↗
            </button>
          </div>
        )}

        {(selectedNode.type === 'text' || 
          selectedNode.type === 'button' || 
          selectedNode.type === 'badge' || 
          selectedNode.type === 'navbar' || 
          selectedNode.type === 'metric' || 
          selectedNode.type === 'progress' || 
          selectedNode.type === 'slider' || 
          selectedNode.type === 'switch' || 
          selectedNode.type === 'avatar' || 
          selectedNode.type === 'divider') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                <span>Texto / Título del Componente</span>
              </label>
              {/* AI Smart Content Filler */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const samples = ['Iniciar Sesión', 'Confirmar Pago', 'Explorar Catálogo', 'Crear Cuenta Gratis', 'Descargar Factura', 'Actualizar a PRO'];
                    const picked = samples[Math.floor(Math.random() * samples.length)];
                    onUpdateContent(selectedNode.id, picked);
                    soundEngine.playProceduralSound('pop');
                  }}
                  className="px-1.5 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900 text-[10px] text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition-colors"
                  title="Generar copy interactivo al azar"
                >
                  <Wand2 className="w-2.5 h-2.5 text-indigo-400" />
                  <span>IA Copy</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={selectedNode.content || ''}
              onChange={(e) => onUpdateContent(selectedNode.id, e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {/* Lucide Icon Picker for Buttons & Badges */}
        {(selectedNode.type === 'button' || selectedNode.type === 'badge') && (
          <div className="space-y-1.5 p-2.5 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-indigo-400" />
                <span>Icono de Lucide</span>
              </label>
              {selectedNode.iconName && (
                <button
                  type="button"
                  onClick={() => onUpdateProperty?.(selectedNode.id, 'iconName', undefined)}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Quitar icono
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                className="flex-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2 text-white">
                  {selectedNode.iconName && (LucideIcons as any)[selectedNode.iconName] ? (
                    <>
                      {React.createElement((LucideIcons as any)[selectedNode.iconName], { size: 14, className: 'text-indigo-400' })}
                      <span className="font-mono text-[11px]">{selectedNode.iconName}</span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Seleccionar icono...</span>
                  )}
                </div>
                <span className="text-[10px] text-indigo-400">Buscar ▾</span>
              </button>
            </div>

            {/* Dropdown Icon Search & Grid */}
            {isIconPickerOpen && (
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl space-y-2 animate-in fade-in duration-100">
                <input
                  type="text"
                  placeholder="Buscar icono (ej: star, heart, cart)..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                />
                <div className="grid grid-cols-6 gap-1 max-h-36 overflow-y-auto pr-1">
                  {filteredIcons.map((item) => {
                    const IconComp = (LucideIcons as any)[item.name];
                    if (!IconComp) return null;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          onUpdateProperty?.(selectedNode.id, 'iconName', item.name);
                          setIsIconPickerOpen(false);
                          soundEngine.playProceduralSound('pop');
                        }}
                        className={'p-1.5 rounded-lg flex items-center justify-center transition-colors ' + (
                          selectedNode.iconName === item.name
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        )}
                        title={item.name}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unsplash Stock Photo Picker for Images & Avatars */}
        {(selectedNode.type === 'image' || selectedNode.type === 'avatar') && (
          <div className="space-y-1.5 p-2.5 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Biblioteca de Fotos (Unsplash)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300"
              >
                {isPhotoPickerOpen ? 'Cerrar' : 'Elegir foto'}
              </button>
            </div>

            {/* Custom URL or Local File Upload */}
            <div className="space-y-1">
              <input
                type="text"
                placeholder="URL de imagen externa..."
                value={selectedNode.type === 'avatar' ? (selectedNode.avatarUrl || '') : (selectedNode.imageUrl || '')}
                onChange={(e) => {
                  const key = selectedNode.type === 'avatar' ? 'avatarUrl' : 'imageUrl';
                  onUpdateProperty?.(selectedNode.id, key, e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
              />
              <label className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white text-[10px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3 h-3 text-indigo-400" />
                <span>Subir Asset PNG / JPG Local</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      const key = selectedNode.type === 'avatar' ? 'avatarUrl' : 'imageUrl';
                      onUpdateProperty?.(selectedNode.id, key, dataUrl);
                      soundEngine.playProceduralSound('chime');
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {/* Curated Unsplash Gallery */}
            {isPhotoPickerOpen && (
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl space-y-2 animate-in fade-in duration-100">
                <div className="flex gap-1 text-[10px]">
                  {(['avatars', 'products', 'tech', 'abstract'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPhotoCategory(cat)}
                      className={'px-2 py-0.5 rounded capitalize ' + (
                        photoCategory === cat ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        const key = selectedNode.type === 'avatar' ? 'avatarUrl' : 'imageUrl';
                        onUpdateProperty?.(selectedNode.id, key, photo.url);
                        soundEngine.playProceduralSound('pop');
                      }}
                      className="group relative h-16 rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all shadow"
                    >
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-1 transition-opacity">
                        <span className="text-[9px] text-white truncate">{photo.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action & Navigation Flow (Escalera / Interacciones) */}
        <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/60 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Acción / Flujo de Navegación</span>
            </div>
            <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              Interactivo
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Al hacer clic ejecutar:</label>
            <select
              value={action?.type || 'none'}
              onChange={(e) => {
                const actType = e.target.value as any;
                onUpdateAction(selectedNode.id, {
                  type: actType,
                  targetScreenId: actType === 'navigate' ? (action?.targetScreenId || screens[0]?.id) : undefined,
                  transition: action?.transition || 'fade',
                  alertMessage: actType === 'alert' ? (action?.alertMessage || '¡Acción ejecutada!') : undefined,
                  url: actType === 'link' ? (action?.url || 'https://') : undefined,
                  clipboardText: actType === 'copy_clipboard' ? (action?.clipboardText || selectedNode.content || 'Texto copiado') : undefined,
                  modalTitle: actType === 'modal' ? (action?.modalTitle || 'Ventana Emergente') : undefined,
                  modalContent: actType === 'modal' ? (action?.modalContent || 'Contenido o formulario interactivo del diálogo.') : undefined,
                  soundEffect: actType === 'sound_fx' ? (action?.soundEffect || 'chime') : undefined,
                  fileName: actType === 'download_file' ? (action?.fileName || 'documento.txt') : undefined,
                  fileContent: actType === 'download_file' ? (action?.fileContent || 'Datos exportados desde DesignForge.') : undefined,
                });
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="none">Sin acción (Solo diseño)</option>
              <option value="navigate">🔀 Ir a otra Ventana / Pantalla</option>
              <option value="back">⬅️ Volver a la Pantalla Anterior (Back)</option>
              <option value="scroll_to_top">⬆️ Desplazar al Inicio (Scroll to Top)</option>
              <option value="modal">🪟 Abrir Diálogo / Modal</option>
              <option value="confetti">🎉 Disparar Lluvia de Confeti</option>
              <option value="copy_clipboard">📋 Copiar al Portapapeles</option>
              <option value="toggle_state">⚡ Alternar Estado (Toggle)</option>
              <option value="sound_fx">🔊 Reproducir Efecto de Sonido</option>
              <option value="download_file">💾 Descargar Archivo / Recurso</option>
              <option value="toggle_theme">🌓 Alternar Modo Claro / Oscuro</option>
              <option value="alert">🔔 Mostrar Notificación / Alerta</option>
              <option value="link">🌐 Abrir Enlace URL</option>
            </select>
          </div>

          {/* Navigation Target Screen Selector & Transition */}
          {action?.type === 'navigate' && (
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="space-y-1">
                <label className="text-[11px] text-indigo-300 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>Ventana destino:</span>
                </label>
                <select
                  value={action.targetScreenId || ''}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    targetScreenId: e.target.value
                  })}
                  className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  {screens.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (#{s.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Efecto de Transición:</label>
                <select
                  value={action.transition || 'fade'}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    transition: e.target.value as any
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="fade">Fade (Desvanecimiento Suave)</option>
                  <option value="slide">Slide (Desplazamiento Lateral)</option>
                  <option value="instant">Instantánea (Sin transición)</option>
                </select>
              </div>
            </div>
          )}

          {/* Modal Configuration */}
          {action?.type === 'modal' && (
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="space-y-1">
                <label className="text-[11px] text-indigo-300 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Título del Modal:</span>
                </label>
                <input
                  type="text"
                  value={action.modalTitle || ''}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    modalTitle: e.target.value
                  })}
                  placeholder="Ej: Confirmación de Pago"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Contenido o Mensaje:</label>
                <textarea
                  rows={2}
                  value={action.modalContent || ''}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    modalContent: e.target.value
                  })}
                  placeholder="Detalles del diálogo..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Copy to Clipboard */}
          {action?.type === 'copy_clipboard' && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <label className="text-[11px] text-indigo-300 flex items-center gap-1">
                <Copy className="w-3 h-3" />
                <span>Texto a copiar al portapapeles:</span>
              </label>
              <input
                type="text"
                value={action.clipboardText || ''}
                onChange={(e) => onUpdateAction(selectedNode.id, {
                  ...action,
                  clipboardText: e.target.value
                })}
                placeholder="Ej: 0x71C...9B4 o cupón PRO2026"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Alert Message input */}
          {action?.type === 'alert' && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <label className="text-[11px] text-slate-400">Mensaje emergente:</label>
              <input
                type="text"
                value={action.alertMessage || ''}
                onChange={(e) => onUpdateAction(selectedNode.id, {
                  ...action,
                  alertMessage: e.target.value
                })}
                placeholder="Ej: Pago confirmado con éxito"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          )}

          {/* External Link input */}
          {action?.type === 'link' && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span>URL destino:</span>
              </label>
              <input
                type="text"
                value={action.url || ''}
                onChange={(e) => onUpdateAction(selectedNode.id, {
                  ...action,
                  url: e.target.value
                })}
                placeholder="https://google.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          )}
          {/* Sound FX Action Configuration */}
          {action?.type === 'sound_fx' && (
            <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
              <label className="text-[11px] text-amber-300 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Efecto de audio a reproducir:</span>
              </label>
              <select
                value={action.soundEffect || 'chime'}
                onChange={(e) => onUpdateAction(selectedNode.id, {
                  ...action,
                  soundEffect: e.target.value as any
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="chime">Harmonic Chime</option>
                <option value="bell">Notification Bell</option>
                <option value="pop">Bubble Pop</option>
                <option value="switch">Crisp Switch</option>
                <option value="whoosh">Air Whoosh</option>
                <option value="alert">Gentle Alert</option>
                <option value="click">Snappy Click</option>
              </select>
            </div>
          )}

          {/* Download File Action Configuration */}
          {action?.type === 'download_file' && (
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="space-y-1">
                <label className="text-[11px] text-indigo-300 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>Nombre del archivo:</span>
                </label>
                <input
                  type="text"
                  value={action.fileName || ''}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    fileName: e.target.value
                  })}
                  placeholder="ej: reporte.csv o factura.json"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Contenido a descargar:</label>
                <textarea
                  rows={2}
                  value={action.fileContent || ''}
                  onChange={(e) => onUpdateAction(selectedNode.id, {
                    ...action,
                    fileContent: e.target.value
                  })}
                  placeholder="Texto o datos..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono resize-none"
                />
              </div>
            </div>
          )}

          {/* Back Action Helper Note */}
          {action?.type === 'back' && (
            <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Navegará a la pantalla visitada anteriormente en el historial.</span>
            </div>
          )}

          {/* Scroll to Top Helper Note */}
          {action?.type === 'scroll_to_top' && (
            <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Desplazará suavemente la pantalla hasta la parte superior.</span>
            </div>
          )}

          {/* Toggle Theme Helper Note */}
          {action?.type === 'toggle_theme' && (
            <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <SunMoon className="w-3.5 h-3.5 text-amber-400" />
              <span>Alternará en vivo entre la paleta oscura y la paleta clara.</span>
            </div>
          )}
        </div>

        {/* Auto-Layout Inteligente (Hug & Fill) */}
        <div className="space-y-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Auto-Layout & Dimensiones</span>
            </div>
            <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-mono">
              Figma Style
            </span>
          </div>

          {/* Sizing Quick Presets: Hug / Fill */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Modo de Ancho (Width Sizing)</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'width', 'auto')}
                className={'py-1.5 px-2 text-xs rounded-lg border text-center transition-all ' + (
                  !styles.width || styles.width === 'auto'
                    ? 'bg-blue-600 text-white border-blue-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                )}
              >
                Hug (Abrazar)
              </button>
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'width', '100%')}
                className={'py-1.5 px-2 text-xs rounded-lg border text-center transition-all ' + (
                  styles.width === '100%'
                    ? 'bg-blue-600 text-white border-blue-500 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                )}
              >
                Fill (Llenar 100%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Ancho Manual</label>
              <input
                type="text"
                value={styles.width || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'width', e.target.value)}
                placeholder="auto / 100% / 280px"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Alto Manual</label>
              <input
                type="text"
                value={styles.height || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'height', e.target.value)}
                placeholder="auto / 50px / 100%"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Auto Layout Pro (Figma 3x3 Matrix + Independent Quadrant Padding) */}
          <AutoLayoutControl 
            node={selectedNode} 
            onUpdateStyle={onUpdateStyle} 
          />

          {/* Accesibilidad & Contraste WCAG AA/AAA */}
          <A11yContrastChecker 
            node={selectedNode} 
            onUpdateStyle={onUpdateStyle} 
          />

          {/* Depth & Z-Index: Poner sobre algo o detrás de algo */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                <Layers2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Profundidad & Capas (Z-Index)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                Z: {styles.zIndex ?? '0'}
              </span>
            </div>

            {/* Quick depth actions */}
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => {
                  onMoveDepth?.('front');
                  onUpdateStyle(selectedNode.id, 'zIndex', '30');
                  soundEngine.playProceduralSound('pop');
                }}
                className="py-1 px-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded text-[10px] font-medium border border-slate-800 flex items-center justify-center gap-0.5 transition-colors"
                title="Poner al frente de todos los elementos (Top)"
              >
                <ArrowUp className="w-3 h-3 text-emerald-400" />
                <span>Al Frente</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onMoveDepth?.('forward');
                  const currentZ = parseInt(String(styles.zIndex || '0'), 10);
                  onUpdateStyle(selectedNode.id, 'zIndex', String(currentZ + 1));
                  soundEngine.playProceduralSound('pop');
                }}
                className="py-1 px-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded text-[10px] font-medium border border-slate-800 flex items-center justify-center gap-0.5 transition-colors"
                title="Subir un nivel de capa"
              >
                <ChevronUp className="w-3 h-3 text-cyan-400" />
                <span>Subir 1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onMoveDepth?.('backward');
                  const currentZ = parseInt(String(styles.zIndex || '0'), 10);
                  onUpdateStyle(selectedNode.id, 'zIndex', String(Math.max(0, currentZ - 1)));
                  soundEngine.playProceduralSound('pop');
                }}
                className="py-1 px-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded text-[10px] font-medium border border-slate-800 flex items-center justify-center gap-0.5 transition-colors"
                title="Bajar un nivel de capa"
              >
                <ChevronDown className="w-3 h-3 text-amber-400" />
                <span>Bajar 1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onMoveDepth?.('back');
                  onUpdateStyle(selectedNode.id, 'zIndex', '0');
                  soundEngine.playProceduralSound('pop');
                }}
                className="py-1 px-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded text-[10px] font-medium border border-slate-800 flex items-center justify-center gap-0.5 transition-colors"
                title="Poner detrás de todos los elementos (Bottom)"
              >
                <ArrowDown className="w-3 h-3 text-rose-400" />
                <span>Al Fondo</span>
              </button>
            </div>

            {/* Manual Z-Index input & Position type */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Z-Index Numérico</label>
                <input
                  type="number"
                  value={styles.zIndex ?? ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'zIndex', e.target.value)}
                  placeholder="0, 10, 50..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500">Posicionamiento</label>
                <select
                  value={styles.position || 'relative'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'position', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="relative">Relativo</option>
                  <option value="absolute">Absoluto (Flotante)</option>
                  <option value="static">Estático</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palettes Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Colores & Apariencia</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Background Color */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Fondo</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={styles.backgroundColor && styles.backgroundColor.startsWith('#') ? styles.backgroundColor : '#1e293b'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundColor', e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={styles.backgroundColor || ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundColor', e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none font-mono"
                  placeholder="#hex / rgba"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Texto</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={styles.color && styles.color.startsWith('#') ? styles.color : '#ffffff'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'color', e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={styles.color || ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'color', e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none font-mono"
                  placeholder="#hex"
                />
              </div>
            </div>
          </div>

          {/* Background Image / Asset Importer for ANY Box, Card, Container or Button */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Asset / Imagen de Fondo</span>
              </label>
              {styles.backgroundImage && (
                <button
                  type="button"
                  onClick={() => onUpdateStyle(selectedNode.id, 'backgroundImage', '')}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Quitar imagen
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="URL de imagen externa o pega data:..."
                  value={styles.backgroundImage || ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundImage', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
                />
                <label className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow">
                  <Upload className="w-3 h-3" />
                  <span>Cargar PNG / JPG</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        onUpdateStyle(selectedNode.id, 'backgroundImage', dataUrl);
                        soundEngine.playProceduralSound('chime');
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Background Fit Controls */}
              {styles.backgroundImage && (
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'backgroundSize', 'cover')}
                    className={'py-1 text-[10px] rounded border font-medium ' + (
                      styles.backgroundSize === 'cover' || !styles.backgroundSize ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    )}
                  >
                    Cover (Cubrir)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'backgroundSize', 'contain')}
                    className={'py-1 text-[10px] rounded border font-medium ' + (
                      styles.backgroundSize === 'contain' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    )}
                  >
                    Contain (Ajustar)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'backgroundSize', 'auto')}
                    className={'py-1 text-[10px] rounded border font-medium ' + (
                      styles.backgroundSize === 'auto' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    )}
                  >
                    Auto (Real)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Animated Background Video (WebM / MP4) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>Video de Fondo Animado</span>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 py-0.2 rounded font-mono">WebM/MP4</span>
              </label>
              {styles.backgroundVideo && (
                <button
                  type="button"
                  onClick={() => onUpdateStyle(selectedNode.id, 'backgroundVideo', '')}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Quitar video
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="URL video (ej: https://...video.mp4 o .webm)"
                  value={styles.backgroundVideo || ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundVideo', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
                />
                <label className="py-1 px-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow">
                  <Upload className="w-3 h-3" />
                  <span>Subir Video</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        onUpdateStyle(selectedNode.id, 'backgroundVideo', dataUrl);
                        soundEngine.playProceduralSound('chime');
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Sample background video clips button */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500">Presets:</span>
                {[
                  { name: 'Ondas Cyber', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4' },
                  { name: 'Partículas', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-animation-of-bright-cyan-lights-42526-large.mp4' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateStyle(selectedNode.id, 'backgroundVideo', sample.url);
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>

              {/* Video Opacity, Blur & Hover Controls */}
              {styles.backgroundVideo && (
                <>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Opacidad Video</span>
                        <span className="font-mono text-cyan-400">{Math.round((Number(styles.backgroundVideoOpacity ?? '1')) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={styles.backgroundVideoOpacity ?? '1'}
                        onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundVideoOpacity', e.target.value)}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Desenfoque (Blur)</span>
                        <span className="font-mono text-cyan-400">{styles.backgroundVideoBlur || '0px'}</span>
                      </div>
                      <select
                        value={styles.backgroundVideoBlur || '0px'}
                        onChange={(e) => onUpdateStyle(selectedNode.id, 'backgroundVideoBlur', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-white focus:outline-none"
                      >
                        <option value="0px">Sin desenfoque (Nítido)</option>
                        <option value="2px">Suave (2px)</option>
                        <option value="6px">Medio (6px)</option>
                        <option value="12px">Fuerte (12px)</option>
                      </select>
                    </div>
                  </div>

                  {/* Hover / Proximity Behavior for Video */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Interacción Hover / Proximidad:</span>
                    </div>
                    <select
                      value={styles.videoHoverBehavior || 'none'}
                      onChange={(e) => onUpdateStyle(selectedNode.id, 'videoHoverBehavior', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-cyan-300 focus:outline-none"
                    >
                      <option value="none">Silencioso continuo (Normal)</option>
                      <option value="unmute_on_hover">🔊 Activar audio al pasar mouse (Silenciar al salir)</option>
                      <option value="play_pause_on_hover">⏯️ Pausar animación/audio al salir (Play al pasar mouse)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* YouTube Video Player Embed */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-rose-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Video de YouTube (Embed)</span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono">IFrame</span>
              </label>
              {styles.youtubeUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateStyle(selectedNode.id, 'youtubeUrl', '')}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Quitar video
                </button>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="URL YouTube (ej: https://www.youtube.com/watch?v=...)"
                value={styles.youtubeUrl || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'youtubeUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
              />

              {/* Sample YouTube presets */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-slate-500">Demos:</span>
                {[
                  { name: 'Lofi Beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
                  { name: 'UI Demo', url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4' },
                  { name: 'Chill Music', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateStyle(selectedNode.id, 'youtubeUrl', sample.url);
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Pega cualquier enlace de YouTube para reproducir el video dentro de este elemento en el lienzo o modo prueba.
              </p>
            </div>
          </div>
        </div>

        {/* Geometry, Border Radius & Borders */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Square className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bordes, Esquinas & Padding</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Corner Radius */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Radio Esquinas</label>
              <input
                type="text"
                value={styles.borderRadius || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'borderRadius', e.target.value)}
                placeholder="16px / 9999px"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Padding */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Padding Interno</label>
              <input
                type="text"
                value={styles.padding || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'padding', e.target.value)}
                placeholder="16px 20px"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Border Style & Width */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Estilo de Borde</label>
              <select
                value={styles.borderStyle || 'solid'}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'borderStyle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="solid">Sólido</option>
                <option value="dashed">Discontinuo (Dashed)</option>
                <option value="dotted">Punteado (Dotted)</option>
                <option value="none">Sin borde</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Grosor de Borde</label>
              <input
                type="text"
                value={styles.borderWidth || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'borderWidth', e.target.value)}
                placeholder="1px / 2px"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-500">Color de Borde</label>
            <input
              type="text"
              value={styles.borderColor || ''}
              onChange={(e) => onUpdateStyle(selectedNode.id, 'borderColor', e.target.value)}
              placeholder="#334155"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Professional Typography & Text Styles Studio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Type className="w-3.5 h-3.5" />
              <span>Tipografía & Estilos de Letra</span>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded-full">
              32 Fuentes
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {FONT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFontCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    fontCategoryFilter === cat.id
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Font Family Selector */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400 font-medium">Familia Tipográfica</label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {filteredFontFamilies.length} disponibles
                </span>
              </div>
              <select
                value={styles.fontFamily || 'Inter'}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'fontFamily', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
              >
                {filteredFontFamilies.map(font => (
                  <option 
                    key={font.family} 
                    value={font.family}
                    style={{ fontFamily: font.family }}
                  >
                    {font.name} — {font.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Typography Preview Card */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between overflow-hidden">
              <div className="flex flex-col truncate">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Muestra Tipográfica</span>
                <span 
                  className="text-sm text-slate-200 truncate mt-0.5"
                  style={{ 
                    fontFamily: styles.fontFamily || 'Inter',
                    fontWeight: styles.fontWeight || '400',
                    fontStyle: styles.fontStyle || 'normal',
                    textDecoration: styles.textDecoration || 'none',
                    letterSpacing: styles.letterSpacing || 'normal',
                    textShadow: styles.textShadow || undefined
                  }}
                >
                  Aa Bb Gg 123 • {styles.fontFamily || 'Inter'}
                </span>
              </div>
              <span 
                className="text-xl px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400 font-bold shrink-0 ml-2"
                style={{ fontFamily: styles.fontFamily || 'Inter' }}
              >
                Ag
              </span>
            </div>

            {/* Quick Style Format Buttons (Bold, Italic, Underline, Strikethrough, Uppercase) */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Estilos Rápidos de Formato</label>
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  title="Negrita (Bold)"
                  onClick={() => onUpdateStyle(selectedNode.id, 'fontWeight', styles.fontWeight === '700' ? '400' : '700')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    styles.fontWeight === '700' || styles.fontWeight === '800' || styles.fontWeight === '900'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  B
                </button>
                <button
                  type="button"
                  title="Cursiva (Italic)"
                  onClick={() => onUpdateStyle(selectedNode.id, 'fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`py-1.5 rounded-lg text-xs italic font-serif transition-all border ${
                    styles.fontStyle === 'italic'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  I
                </button>
                <button
                  type="button"
                  title="Subrayado (Underline)"
                  onClick={() => onUpdateStyle(selectedNode.id, 'textDecoration', styles.textDecoration === 'underline' ? 'none' : 'underline')}
                  className={`py-1.5 rounded-lg text-xs underline font-medium transition-all border ${
                    styles.textDecoration === 'underline'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  U
                </button>
                <button
                  type="button"
                  title="Tachado (Strikethrough)"
                  onClick={() => onUpdateStyle(selectedNode.id, 'textDecoration', styles.textDecoration === 'line-through' ? 'none' : 'line-through')}
                  className={`py-1.5 rounded-lg text-xs line-through font-medium transition-all border ${
                    styles.textDecoration === 'line-through'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  S
                </button>
                <button
                  type="button"
                  title="MAYÚSCULAS"
                  onClick={() => onUpdateStyle(selectedNode.id, 'textTransform', styles.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                  className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                    styles.textTransform === 'uppercase'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  TT
                </button>
              </div>
            </div>

            {/* Typography Metrics (Size & Weight) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Tamaño Fuente</label>
                <input
                  type="text"
                  value={styles.fontSize || ''}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'fontSize', e.target.value)}
                  placeholder="16px / 1.25rem"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Grosor (Weight)</label>
                <select
                  value={styles.fontWeight || '400'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'fontWeight', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extrabold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* Letter Spacing & Line Height */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Interletrado (Tracking)</label>
                <select
                  value={styles.letterSpacing || 'normal'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'letterSpacing', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="normal">Normal (0)</option>
                  <option value="-0.04em">Apretado (-0.04em)</option>
                  <option value="0.04em">Espaciado (0.04em)</option>
                  <option value="0.1em">Amplio (0.1em)</option>
                  <option value="0.2em">Titular (0.2em)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Interlineado (Leading)</label>
                <select
                  value={styles.lineHeight || 'normal'}
                  onChange={(e) => onUpdateStyle(selectedNode.id, 'lineHeight', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="normal">Normal (Auto)</option>
                  <option value="1">Ajustado (1.0)</option>
                  <option value="1.25">Compacto (1.25)</option>
                  <option value="1.5">Estándar (1.5)</option>
                  <option value="1.75">Relajado (1.75)</option>
                  <option value="2">Doble (2.0)</option>
                </select>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Alineación de Texto</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'left', label: 'Izquierda', symbol: '⇤' },
                  { id: 'center', label: 'Centro', symbol: '↔' },
                  { id: 'right', label: 'Derecha', symbol: '⇥' },
                  { id: 'justify', label: 'Justificar', symbol: '≡' }
                ].map(align => (
                  <button
                    key={align.id}
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'textAlign', align.id)}
                    className={`py-1 rounded-lg text-xs transition-colors border ${
                      styles.textAlign === align.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {align.symbol} {align.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Text Effects & Neon Glows */}
            <div className="space-y-1 pt-1 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400 font-medium">Efecto Especial / Neón</label>
                {styles.textShadow && (
                  <button
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'textShadow', '')}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Quitar efecto
                  </button>
                )}
              </div>
              <select
                value={styles.textShadow || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'textShadow', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 focus:outline-none"
              >
                {TEXT_EFFECTS_PRESETS.map(fx => (
                  <option key={fx.id} value={fx.cssShadow || ''}>
                    {fx.name} — {fx.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Gradient Fill */}
            <div className="space-y-1 pt-1 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400 font-medium">Degradado de Color (Texto)</label>
                {styles.textGradient && styles.textGradient !== 'none' && (
                  <button
                    type="button"
                    onClick={() => onUpdateStyle(selectedNode.id, 'textGradient', '')}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Color sólido
                  </button>
                )}
              </div>
              <select
                value={styles.textGradient || ''}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'textGradient', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-pink-300 focus:outline-none"
              >
                {TEXT_GRADIENTS_PRESETS.map(grad => (
                  <option key={grad.id} value={grad.cssGradient || ''}>
                    {grad.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Micro-Interactions & CSS Animations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animaciones & Efectos Dinámicos</span>
            </div>
            {onOpenAnimationStudio && (
              <button
                type="button"
                onClick={onOpenAnimationStudio}
                className="text-[10px] text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 bg-pink-950/40 border border-pink-500/30 px-2 py-0.5 rounded-full transition-colors"
                title="Abrir Diseñador de Animaciones & Keyframes"
              >
                <span>+ Diseñar / Importar</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Animación Continua</label>
              <select
                value={styles.animation || 'none'}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'animation', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <optgroup label="Presets Básicos">
                  <option value="none">Ninguna</option>
                  <option value="pulse">Pulse (Latido)</option>
                  <option value="bounce">Bounce (Rebote)</option>
                  <option value="glow">Glow (Resplandor Neón)</option>
                  <option value="float">Float (Flotación)</option>
                  <option value="shake">Shake (Vibración)</option>
                </optgroup>
                {customAnimations.length > 0 && (
                  <optgroup label="★ Animaciones del Estudio">
                    {customAnimations.map((ca) => (
                      <option key={ca.id} value={ca.animationClass}>
                        {ca.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Efecto Hover (Escala)</label>
              <select
                value={styles.hoverScale ? 'true' : 'false'}
                onChange={(e) => onUpdateStyle(selectedNode.id, 'hoverScale', e.target.value === 'true' ? ('true' as any) : ('' as any))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="false">Desactivado</option>
                <option value="true">Activar Scale (1.05x)</option>
              </select>
            </div>
          </div>

          {/* Preset Gradients */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-slate-500">Degradado Rápido (Preset)</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'backgroundGradient', 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)')}
                className="h-6 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 hover:ring-2 hover:ring-white text-[9px] font-bold text-white shadow"
                title="Cyberpunk"
              />
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'backgroundGradient', 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)')}
                className="h-6 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 hover:ring-2 hover:ring-white text-[9px] font-bold text-white shadow"
                title="Emerald Wave"
              />
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'backgroundGradient', 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)')}
                className="h-6 rounded-md bg-gradient-to-r from-amber-500 to-red-500 hover:ring-2 hover:ring-white text-[9px] font-bold text-white shadow"
                title="Sunset Fire"
              />
              <button
                type="button"
                onClick={() => onUpdateStyle(selectedNode.id, 'backgroundGradient', '')}
                className="h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700"
                title="Limpiar gradiente"
              >
                Normal
              </button>
            </div>
          </div>
        </div>

        {/* UI Sound Effects Section */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Efectos de Sonido Interactivos</span>
            </div>
            {onOpenSoundLab && (
              <button
                type="button"
                onClick={onOpenSoundLab}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full transition-colors"
                title="Abrir Laboratorio de Sonido & Sintetizador"
              >
                <span>+ Sintetizar / Importar</span>
              </button>
            )}
          </div>

          {/* Click Sound Trigger */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Sonido al Clic</span>
              {sounds?.onClick && (
                <button
                  onClick={() => soundEngine.playProceduralSound(sounds.onClick!)}
                  className="text-amber-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1"
                >
                  ▶ Probar
                </button>
              )}
            </div>
            <select
              value={sounds?.onClick || ''}
              onChange={(e) => onUpdateSound(selectedNode.id, 'onClick', (e.target.value || undefined) as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Ninguno (Silencio)</option>
              <option value="click">Snappy Click</option>
              <option value="pop">Bubble Pop</option>
              <option value="switch">Crisp Switch</option>
              <option value="chime">Harmonic Chime</option>
              <option value="bell">Notification Bell</option>
              <option value="whoosh">Air Whoosh</option>
              <option value="alert">Gentle Alert</option>
            </select>
          </div>

          {/* Hover Sound Trigger */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Sonido al Pasar el Ratón (Hover)</span>
              {sounds?.onHover && (
                <button
                  onClick={() => soundEngine.playProceduralSound(sounds.onHover!)}
                  className="text-amber-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1"
                >
                  ▶ Probar
                </button>
              )}
            </div>
            <select
              value={sounds?.onHover || ''}
              onChange={(e) => onUpdateSound(selectedNode.id, 'onHover', (e.target.value || undefined) as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Ninguno (Silencio)</option>
              <option value="pop">Bubble Pop</option>
              <option value="whoosh">Air Whoosh</option>
              <option value="click">Subtle Click</option>
              <option value="switch">Crisp Switch</option>
            </select>
          </div>
        </div>
      </div>
      )}
    </aside>
  );
};
