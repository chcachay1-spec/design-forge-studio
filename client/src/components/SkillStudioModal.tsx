import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Upload, 
  X, 
  Copy, 
  Check, 
  Sliders, 
  Download, 
  Trash2,
  FileCode,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import type { SkillDefinition, SkillReference, DesignNode, ScreenDefinition, DeviceMode } from '../lib/types';
import { 
  PRESET_SKILLS, 
  extractRichPaletteFromImage, 
  synthesizeSkillFromReferences, 
  generateScreenFromSkillAndPrompt,
  type ExtractedImageAnalysis,
  type BackgroundStyle,
  type ButtonShape,
  type MenuStyle
} from '../lib/skill-engine';
import { soundEngine } from '../lib/audio-engine';

interface SkillStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillDefinition[];
  activeSkill: SkillDefinition | null;
  onSelectSkill: (skill: SkillDefinition) => void;
  onSaveSkill: (skill: SkillDefinition) => void;
  onDeleteSkill: (skillId: string) => void;
  onApplySkill: (skill: SkillDefinition, scope: 'all' | 'screen' | 'selection') => void;
  onGenerateScreenFromSkill: (screen: ScreenDefinition, deviceMode: DeviceMode) => void;
  onMorphActiveScreenFromSkill: (rootNode: DesignNode, deviceMode: DeviceMode) => void;
  deviceMode: DeviceMode;
  selectedNode: DesignNode | null;
}

export const SkillStudioModal: React.FC<SkillStudioModalProps> = ({
  isOpen,
  onClose,
  skills,
  activeSkill,
  onSelectSkill,
  onSaveSkill,
  onDeleteSkill,
  onApplySkill,
  onGenerateScreenFromSkill,
  onMorphActiveScreenFromSkill,
  deviceMode,
  selectedNode,
}) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'library' | 'markdown'>('creator');
  const [skillName, setSkillName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<DeviceMode>(deviceMode || 'mobile');
  
  // Visual Styles State
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('aurora');
  const [buttonShape, setButtonShape] = useState<ButtonShape>('squircle');
  const [menuStyle, setMenuStyle] = useState<MenuStyle>('floating_dock');
  const [useUploadedImages, setUseUploadedImages] = useState(true);

  const [references, setReferences] = useState<SkillReference[]>([]);
  const [analysisList, setAnalysisList] = useState<ExtractedImageAnalysis[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedSkill, setGeneratedSkill] = useState<SkillDefinition | null>(activeSkill || PRESET_SKILLS[0]);
  const [copiedMd, setCopiedMd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (deviceMode) {
      setSelectedFormat(deviceMode);
      if (deviceMode === 'desktop') {
        setMenuStyle('classic_topbar');
      } else {
        setMenuStyle('floating_dock');
      }
    }
  }, [deviceMode]);

  if (!isOpen) return null;

  // Handle Multi-Image Upload (Screenshots & References)
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    soundEngine.playProceduralSound('pop');
    const newRefs: SkillReference[] = [];
    const newAnalyses: ExtractedImageAnalysis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const analysis = await extractRichPaletteFromImage(dataUrl);
      newAnalyses.push(analysis);

      newRefs.push({
        id: 'ref-' + Date.now() + '-' + i,
        type: 'image',
        name: file.name.slice(0, 24),
        content: dataUrl,
        extractedColors: analysis.palette,
        aspectRatio: analysis.aspectRatio,
        detectedFormat: analysis.detectedFormat,
      });

      if (i === 0 && analysis.detectedFormat) {
        setSelectedFormat(analysis.detectedFormat);
        if (analysis.detectedFormat === 'desktop') setMenuStyle('classic_topbar');
      }
    }

    const updatedRefs = [...references, ...newRefs];
    const updatedAnalyses = [...analysisList, ...newAnalyses];
    setReferences(updatedRefs);
    setAnalysisList(updatedAnalyses);

    const syn = synthesizeSkillFromReferences({
      name: skillName || 'Skill Extraída de Captura',
      userPrompt: promptText,
      references: updatedRefs,
      analysisList: updatedAnalyses,
    });
    setGeneratedSkill(syn);
  };

  // Clipboard Paste (Ctrl+V)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const f = items[i].getAsFile();
        if (f) imageFiles.push(f);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      const dt = new DataTransfer();
      imageFiles.forEach(f => dt.items.add(f));
      await handleFilesUpload(dt.files);
    }
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    soundEngine.playProceduralSound('chime');

    const pLow = promptText.toLowerCase();
    if (pLow.includes('dashboard') || pLow.includes('panel') || pLow.includes('web') || pLow.includes('landing') || pLow.includes('saas') || pLow.includes('escritorio')) {
      setSelectedFormat('desktop');
      setMenuStyle('classic_topbar');
    } else if (pLow.includes('app') || pLow.includes('móvil') || pLow.includes('celular') || pLow.includes('mobile')) {
      setSelectedFormat('mobile');
    }

    if (pLow.includes('píldora') || pLow.includes('pill') || pLow.includes('cápsula')) {
      setButtonShape('pill');
    } else if (pLow.includes('brutalis') || pLow.includes('sharp') || pLow.includes('cuadrado') || pLow.includes('afilado')) {
      setButtonShape('sharp');
    } else if (pLow.includes('glow') || pLow.includes('neón') || pLow.includes('resplandor')) {
      setButtonShape('glow');
    } else if (pLow.includes('cristal') || pLow.includes('glass') || pLow.includes('translúcido')) {
      setButtonShape('glass');
      setBackgroundStyle('glass');
    }

    setTimeout(() => {
      const synthesized = synthesizeSkillFromReferences({
        name: skillName || 'Habilidad Personalizada',
        userPrompt: promptText,
        references,
        analysisList,
      });
      setGeneratedSkill(synthesized);
      setIsSynthesizing(false);
    }, 300);
  };

  const handleDownloadSkillMd = (skillToDownload: SkillDefinition) => {
    soundEngine.playProceduralSound('pop');
    const blob = new Blob([skillToDownload.rawMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${skillToDownload.name.toLowerCase().replace(/\s+/g, '-')}.skill.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentPreviewSkill = generatedSkill || activeSkill || PRESET_SKILLS[0];

  const handleGenerateNewScreen = () => {
    soundEngine.playProceduralSound('chime');
    const newScreen = generateScreenFromSkillAndPrompt({
      skill: currentPreviewSkill,
      prompt: promptText || currentPreviewSkill.description,
      screenName: skillName || currentPreviewSkill.name,
      deviceMode: selectedFormat,
      backgroundStyle,
      buttonShape,
      menuStyle,
      useUploadedImages,
    });
    onGenerateScreenFromSkill(newScreen, selectedFormat);
    onClose();
  };

  const handleMorphCurrentScreen = () => {
    soundEngine.playProceduralSound('switch');
    const morphedScreen = generateScreenFromSkillAndPrompt({
      skill: currentPreviewSkill,
      prompt: promptText || currentPreviewSkill.description,
      screenName: skillName || currentPreviewSkill.name,
      deviceMode: selectedFormat,
      backgroundStyle,
      buttonShape,
      menuStyle,
      useUploadedImages,
    });
    onMorphActiveScreenFromSkill(morphedScreen.rootNode, selectedFormat);
    onClose();
  };

  const PROMPT_SUGGESTIONS = [
    { label: '💳 Dashboard Fintech Cripto', prompt: 'Dashboard fintech oscuro con balance numérico, tarjetas de criptoactivos, botones de transferir y transacciones recientes.' },
    { label: '📊 SaaS de Métricas y Analíticas', prompt: 'Panel SaaS administrativo con tarjetas KPI de rendimiento, gráfico de crecimiento y lista de usuarios activos.' },
    { label: '🛍️ Tienda E-Commerce & Catálogo', prompt: 'Tienda moderna con barra de búsqueda, banner promocional de ofertas y cuadrícula de productos con precios.' },
    { label: '👤 Perfil Social & Feed', prompt: 'Perfil social con avatar, contadores de seguidores, biografía, pestañas y publicaciones interactivas.' },
    { label: '🔐 Login & Autenticación', prompt: 'Pantalla de inicio de sesión minimalista con campos de email, contraseña, botón de acceso y enlace de registro.' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onPaste={handlePaste}
    >
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Maletín de Skills & ADN Visual
                </h3>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Claude Design Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sintetiza capturas, copia imágenes, elige formas de botones, fondos y menús para crear interfaces profesionales.
              </p>
            </div>
          </div>

          {/* Tabs Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setActiveTab('creator'); soundEngine.playProceduralSound('pop'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'creator'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sintetizador Multi-Ref
            </button>
            <button
              onClick={() => { setActiveTab('library'); soundEngine.playProceduralSound('pop'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Biblioteca ({PRESET_SKILLS.length + skills.length})
            </button>
            <button
              onClick={() => { setActiveTab('markdown'); soundEngine.playProceduralSound('pop'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'markdown'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SKILL.md</span>
            </button>
          </div>

          <button
            onClick={() => { onClose(); soundEngine.playProceduralSound('pop'); }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex">

          {/* TAB 1: SINTETIZADOR MULTIRREFERENCIAL */}
          {activeTab === 'creator' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Multi-Image Input, Prompt & Visual Styles */}
              <div className="w-[58%] p-5 overflow-y-auto border-r border-white/[0.08] space-y-4">
                
                {/* 1. Format / Device Window Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Formato de Ventana</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedFormat === 'mobile' ? '390 x 844 px' : selectedFormat === 'tablet' ? '768 x 1024 px' : '1200 x 800 px'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedFormat('mobile'); soundEngine.playProceduralSound('pop'); }}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        selectedFormat === 'mobile'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Móvil</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedFormat('tablet'); soundEngine.playProceduralSound('pop'); }}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        selectedFormat === 'tablet'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span>Tablet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { 
                        setSelectedFormat('desktop'); 
                        setMenuStyle('classic_topbar');
                        soundEngine.playProceduralSound('pop'); 
                      }}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        selectedFormat === 'desktop'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Escritorio</span>
                    </button>
                  </div>
                </div>

                {/* 2. Visual References Dropzone & Paste */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Imágenes & Capturas de Referencia</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Copia o presiona <strong className="text-cyan-400">Ctrl + V</strong>
                    </span>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 bg-white/[0.02] hover:bg-cyan-500/[0.03] rounded-2xl p-3.5 text-center cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFilesUpload(e.target.files)}
                    />
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-300 mx-auto mb-1 transition-colors" />
                    <p className="text-xs text-slate-300 font-medium">
                      Suelta aquí tus capturas o haz clic para subir
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Copia paletas exactas y puede inyectar estas imágenes como banners y productos
                    </p>
                  </div>

                  {/* Thumbnail List of Uploaded References */}
                  {references.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {references.map((ref) => (
                        <div
                          key={ref.id}
                          className="bg-black/50 border border-white/10 rounded-xl p-2 flex items-center gap-2 relative group"
                        >
                          <img
                            src={ref.content}
                            alt={ref.name}
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 bg-black/60"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-200 truncate block">
                              {ref.name}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                              {(ref.extractedColors || []).slice(0, 4).map((col, idx) => (
                                <span
                                  key={idx}
                                  style={{ backgroundColor: col }}
                                  className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                  title={col}
                                />
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReferences(prev => prev.filter(r => r.id !== ref.id));
                              soundEngine.playProceduralSound('pop');
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                            title="Eliminar referencia"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {references.length > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={useUploadedImages}
                        onChange={(e) => setUseUploadedImages(e.target.checked)}
                        className="rounded border-white/20 text-cyan-500 focus:ring-0 bg-black/40"
                      />
                      <span className="text-[11px] text-cyan-300 font-medium">
                        📸 Inyectar estas imágenes como Banners / Productos en el diseño generado
                      </span>
                    </label>
                  )}
                </div>

                {/* 3. Morphological Visual Style Pickers */}
                <div className="bg-black/30 border border-white/[0.08] rounded-xl p-3 space-y-2.5">
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                    MORFOLOGÍA & ESTILOS DE DISEÑO
                  </span>

                  {/* A. Estilo de Fondo */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Estilo de Fondo:</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'aurora', label: '🌌 Aurora' },
                        { id: 'glass', label: '🪟 Cristal' },
                        { id: 'tech_grid', label: '🏁 Grid' },
                        { id: 'editorial', label: '📄 Editorial' },
                        { id: 'solid', label: '⬛ Sólido' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => { setBackgroundStyle(item.id as BackgroundStyle); soundEngine.playProceduralSound('pop'); }}
                          className={`py-1 px-1.5 rounded-lg border text-[10px] font-medium transition-all text-center truncate ${
                            backgroundStyle === item.id
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                              : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* B. Forma de Botones */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Forma de Botones:</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'pill', label: '💊 Píldora' },
                        { id: 'squircle', label: '🔲 Pro' },
                        { id: 'sharp', label: '📐 Afilado' },
                        { id: 'glow', label: '💡 Neón' },
                        { id: 'glass', label: '🧊 Cristal' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => { setButtonShape(item.id as ButtonShape); soundEngine.playProceduralSound('pop'); }}
                          className={`py-1 px-1.5 rounded-lg border text-[10px] font-medium transition-all text-center truncate ${
                            buttonShape === item.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                              : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* C. Estilo de Menú */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Estilo de Menú / Navegación:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'floating_dock', label: '🏝️ Dock Flotante' },
                        { id: 'classic_topbar', label: '🏛️ Barra Superior' },
                        { id: 'bottom_tabbar', label: '📱 Tabbar Móvil' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => { setMenuStyle(item.id as MenuStyle); soundEngine.playProceduralSound('pop'); }}
                          className={`py-1 px-2 rounded-lg border text-[10px] font-medium transition-all text-center truncate ${
                            menuStyle === item.id
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Text Prompt Input & Suggestions */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Prompt de Diseño / Intención</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {PROMPT_SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPromptText(item.prompt);
                          soundEngine.playProceduralSound('pop');
                        }}
                        className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[10px] transition-all hover:border-cyan-400/40"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe módulos, ventanas o vibra (ej. 'Dashboard fintech con balance, portafolio de cripto, botones estilo píldora y menú flotante')..."
                    rows={2}
                    className="w-full bg-black/40 border border-white/15 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* 5. Name Input & Synthesize Button */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Nombre del diseño (ej. Neo Fintech Pro)..."
                    className="flex-1 bg-black/40 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />

                  <button
                    onClick={handleSynthesize}
                    disabled={isSynthesizing}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                    <span>Sintetizar</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Simulation & Generation Actions */}
              <div className="w-[42%] p-5 flex flex-col justify-between bg-black/20">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      SIMULADOR DE ADN & FORMAS
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      {selectedFormat.toUpperCase()} • {buttonShape.toUpperCase()}
                    </span>
                  </div>

                  {/* Colors Bar */}
                  <div className="grid grid-cols-5 gap-1.5">
                    <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block mb-0.5">FONDO</span>
                      <div style={{ backgroundColor: currentPreviewSkill.tokens.backgroundColor }} className="w-5 h-5 rounded-md border border-white/20 mx-auto" />
                    </div>
                    <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block mb-0.5">TARJETA</span>
                      <div style={{ backgroundColor: currentPreviewSkill.tokens.cardColor }} className="w-5 h-5 rounded-md border border-white/20 mx-auto" />
                    </div>
                    <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block mb-0.5">PRIMARIO</span>
                      <div style={{ backgroundColor: currentPreviewSkill.tokens.primaryColor }} className="w-5 h-5 rounded-md border border-white/20 mx-auto" />
                    </div>
                    <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block mb-0.5">ACENTO</span>
                      <div style={{ backgroundColor: currentPreviewSkill.tokens.secondaryColor }} className="w-5 h-5 rounded-md border border-white/20 mx-auto" />
                    </div>
                    <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 text-center">
                      <span className="text-[8px] text-slate-400 block mb-0.5">TEXTO</span>
                      <div style={{ backgroundColor: currentPreviewSkill.tokens.textColor }} className="w-5 h-5 rounded-md border border-white/20 mx-auto" />
                    </div>
                  </div>

                  {/* Mock Window Simulation Box with Button & Menu Shapes */}
                  <div 
                    style={{
                      backgroundColor: currentPreviewSkill.tokens.backgroundColor,
                      color: currentPreviewSkill.tokens.textColor,
                    }}
                    className="p-3.5 rounded-xl border border-white/10 shadow-2xl space-y-2.5 transition-all"
                  >
                    {/* Simulated Floating Dock or Topbar */}
                    <div 
                      style={{
                        backgroundColor: menuStyle === 'floating_dock' ? `${currentPreviewSkill.tokens.cardColor}ee` : 'transparent',
                        borderRadius: menuStyle === 'floating_dock' ? '9999px' : '0px',
                        border: menuStyle === 'floating_dock' ? `1px solid ${currentPreviewSkill.tokens.borderColor}` : undefined,
                        borderBottom: menuStyle === 'classic_topbar' ? `1px solid ${currentPreviewSkill.tokens.borderColor}` : undefined,
                      }}
                      className="px-3 py-1.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span style={{ backgroundColor: currentPreviewSkill.tokens.primaryColor }} className="w-2 h-2 rounded-full animate-pulse" />
                        <span className="font-bold text-[11px] truncate max-w-[120px]">{skillName || 'Navegación'}</span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400 font-semibold">{menuStyle.replace('_', ' ').toUpperCase()}</span>
                    </div>

                    {/* Simulated Content Card */}
                    <div 
                      style={{
                        backgroundColor: currentPreviewSkill.tokens.cardColor,
                        borderColor: currentPreviewSkill.tokens.borderColor,
                        borderWidth: currentPreviewSkill.tokens.borderWidth,
                        borderRadius: currentPreviewSkill.tokens.borderRadius,
                        boxShadow: currentPreviewSkill.tokens.boxShadow,
                      }}
                      className="p-3 space-y-2 border"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{skillName || 'Módulo Principal'}</span>
                        <span 
                          style={{
                            backgroundColor: `${currentPreviewSkill.tokens.primaryColor}33`,
                            color: currentPreviewSkill.tokens.primaryColor,
                          }}
                          className="px-2 py-0.5 rounded-full text-[9px]"
                        >
                          Activo
                        </span>
                      </div>
                      <p style={{ color: currentPreviewSkill.tokens.mutedColor }} className="text-[11px] leading-relaxed">
                        {promptText.slice(0, 85) || 'Contenido adaptado automáticamente con las reglas de formas, contraste y fondos.'}
                      </p>
                      
                      {/* Button Shape Preview */}
                      <button
                        style={{
                          backgroundColor: currentPreviewSkill.tokens.primaryColor,
                          borderRadius: buttonShape === 'pill' ? '9999px' : buttonShape === 'sharp' ? '2px' : '12px',
                          borderWidth: buttonShape === 'sharp' ? '2px' : '0px',
                          boxShadow: buttonShape === 'glow' ? `0 0 15px ${currentPreviewSkill.tokens.primaryColor}80` : currentPreviewSkill.tokens.boxShadow,
                        }}
                        className="w-full py-1.5 text-white text-xs font-semibold shadow transition-transform active:scale-95"
                      >
                        Botón ({buttonShape.toUpperCase()}) →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Generation Actions */}
                <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                  
                  {/* GENERAR NUEVO DISEÑO COMPLETO */}
                  <button
                    onClick={handleGenerateNewScreen}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>✨ Generar Nueva Pantalla desde este Prompt</span>
                  </button>

                  {/* REDISEÑAR PANTALLA ACTUAL */}
                  <button
                    onClick={handleMorphCurrentScreen}
                    className="w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold border border-indigo-400/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>⚡ Rediseñar y Reestructurar Pantalla Activa</span>
                  </button>

                  {/* Secondary Recoloring Actions */}
                  <div className="pt-1">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onApplySkill(currentPreviewSkill, 'screen');
                          soundEngine.playProceduralSound('switch');
                          onClose();
                        }}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-medium transition-all"
                      >
                        Color: Pantalla Activa
                      </button>
                      <button
                        onClick={() => {
                          onApplySkill(currentPreviewSkill, 'all');
                          soundEngine.playProceduralSound('chime');
                          onClose();
                        }}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-medium transition-all"
                      >
                        Color: Todo Proyecto
                      </button>
                    </div>

                    {selectedNode && (
                      <button
                        onClick={() => {
                          onApplySkill(currentPreviewSkill, 'selection');
                          soundEngine.playProceduralSound('pop');
                          onClose();
                        }}
                        className="w-full mt-1.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3 h-3" />
                        <span>Aplicar solo a #{selectedNode.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIBLIOTECA DE SKILLS */}
          {activeTab === 'library' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[...PRESET_SKILLS, ...skills].map((sk) => {
                  const isCurrent = activeSkill?.id === sk.id;
                  return (
                    <div
                      key={sk.id}
                      onClick={() => {
                        onSelectSkill(sk);
                        setGeneratedSkill(sk);
                        soundEngine.playProceduralSound('pop');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group ${
                        isCurrent
                          ? 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/20'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            style={{ backgroundColor: sk.tokens.primaryColor }}
                            className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_currentColor]"
                          />
                          <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          v{sk.version}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {sk.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <span
                            style={{ backgroundColor: sk.tokens.cardColor }}
                            className="w-3.5 h-3.5 rounded border border-white/20"
                            title="Tarjeta"
                          />
                          <span
                            style={{ backgroundColor: sk.tokens.backgroundColor }}
                            className="w-3.5 h-3.5 rounded border border-white/20"
                            title="Fondo"
                          />
                          <span className="text-[10px] font-mono text-slate-400 ml-1">
                            {sk.tokens.borderRadius}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!PRESET_SKILLS.some(p => p.id === sk.id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSkill(sk.id);
                                soundEngine.playProceduralSound('pop');
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Eliminar habilidad personalizada"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSkillMd(sk);
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-white/10 transition-colors"
                            title="Descargar archivo SKILL.md"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newScreen = generateScreenFromSkillAndPrompt({
                                skill: sk,
                                prompt: sk.description,
                                screenName: sk.name,
                                deviceMode: selectedFormat,
                                backgroundStyle,
                                buttonShape,
                                menuStyle,
                                useUploadedImages,
                              });
                              onGenerateScreenFromSkill(newScreen, selectedFormat);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Generar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VISOR & EXPORTACIÓN SKILL.MD */}
          {activeTab === 'markdown' && (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Especificación Oficial SKILL.md</h4>
                    <p className="text-xs text-slate-400">
                      Formato estandarizado de Claude Design con tokens, directrices y anti-patrones.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentPreviewSkill.rawMarkdown);
                        setCopiedMd(true);
                        soundEngine.playProceduralSound('chime');
                        setTimeout(() => setCopiedMd(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMd ? '¡Copiado!' : 'Copiar Markdown'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadSkillMd(currentPreviewSkill)}
                      className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .SKILL.md</span>
                    </button>
                  </div>
                </div>

                <pre className="bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                  {currentPreviewSkill.rawMarkdown}
                </pre>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs text-slate-300">
                    Puedes guardar esta Skill en tu maletín permanente para usarla en cualquier pantalla del proyecto.
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSaveSkill(currentPreviewSkill);
                    soundEngine.playProceduralSound('chime');
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Guardar en el Maletín
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
