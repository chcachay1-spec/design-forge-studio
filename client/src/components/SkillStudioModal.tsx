import React, { useState, useRef } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Upload, 
  X, 
  Copy, 
  Check, 
  Layers, 
  Download, 
  Trash2,
  FileCode
} from 'lucide-react';
import type { SkillDefinition, SkillReference, DesignNode } from '../lib/types';
import { PRESET_SKILLS, extractPaletteFromImage, synthesizeSkillFromReferences } from '../lib/skill-engine';
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
  selectedNode,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'creator' | 'markdown'>('creator');
  const [skillName, setSkillName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [references, setReferences] = useState<SkillReference[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedSkill, setGeneratedSkill] = useState<SkillDefinition | null>(activeSkill || PRESET_SKILLS[0]);
  const [copiedMd, setCopiedMd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Multi-Image Upload (Screenshots & References)
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    soundEngine.playProceduralSound('pop');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const extractedColors = await extractPaletteFromImage(dataUrl, 5);
        const newRef: SkillReference = {
          id: `ref-img-${Date.now()}-${i}`,
          type: 'image',
          name: file.name,
          content: dataUrl,
          extractedColors,
          role: references.length === 0 ? 'Paleta principal & Fondo' : 'Acentos & Componentes',
        };

        setReferences(prev => [...prev, newRef]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Clipboard Paste (Ctrl+V Screenshots)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const fileList = new DataTransfer();
          fileList.items.add(file);
          handleFilesUpload(fileList.files);
        }
      }
    }
  };

  // Remove Reference
  const handleRemoveRef = (id: string) => {
    soundEngine.playProceduralSound('switch');
    setReferences(prev => prev.filter(r => r.id !== id));
  };

  // Synthesize Skill from All Multi-references (Images + Prompts)
  const handleSynthesize = () => {
    if (!promptText.trim() && references.length === 0) return;

    soundEngine.playProceduralSound('whoosh');
    setIsSynthesizing(true);

    setTimeout(() => {
      // Add prompt as text reference if provided
      const finalRefs = [...references];
      if (promptText.trim()) {
        finalRefs.push({
          id: `ref-text-${Date.now()}`,
          type: 'text',
          name: 'Directriz Textual',
          content: promptText.trim(),
        });
      }

      const synthesized = synthesizeSkillFromReferences({
        name: skillName.trim() || 'Nueva Skill Multimodal',
        userPrompt: promptText.trim(),
        references: finalRefs,
      });

      setGeneratedSkill(synthesized);
      onSaveSkill(synthesized);
      onSelectSkill(synthesized);
      setIsSynthesizing(false);
      soundEngine.playProceduralSound('chime');
    }, 600);
  };

  const handleCopyMarkdown = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMd(true);
    soundEngine.playProceduralSound('chime');
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadSkillMd = (skill: SkillDefinition) => {
    const blob = new Blob([skill.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${skill.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.SKILL.md`;
    link.click();
    URL.revokeObjectURL(url);
    soundEngine.playProceduralSound('chime');
  };

  const currentPreviewSkill = generatedSkill || activeSkill || PRESET_SKILLS[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onPaste={handlePaste}
    >
      <div className="neo-glass-panel border-white/10 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(99,102,241,0.2)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">MALETÍN DE SKILLS & ADN VISUAL</h2>
                <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Claude Design Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sintetiza tokens, criterios estéticos y reglas a partir de múltiples capturas de pantalla y directrices textuales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'creator'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sintetizador Multi-Ref
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'library'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Biblioteca ({PRESET_SKILLS.length + skills.length})
              </button>
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'markdown'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Código SKILL.md
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* TAB 1: SINTETIZADOR MULTIRREFERENCIAL */}
          {activeTab === 'creator' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Multi-Reference Inputs */}
              <div className="w-7/12 p-6 border-r border-white/[0.08] overflow-y-auto space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                    1. Nombre de la Habilidad / Sistema de Diseño
                  </label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder='Ej: "Linear Glass Hybrid", "Stripe Horizon Fintech", "Airbnb Warm"'
                    className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/60 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                {/* Multi-Drop Screenshot Zone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      2. Referencias Visuales (Capturas de Pantalla / UI Screenshots)
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {references.filter(r => r.type === 'image').length} cargadas • Puedes pegar con Ctrl+V
                    </span>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFilesUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 bg-black/30 hover:bg-cyan-950/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFilesUpload(e.target.files)}
                    />
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-slate-200 block">
                        Arrastra o haz clic para subir 1 o más screenshots
                      </span>
                      <span className="text-[11px] text-slate-500">
                        O presiona <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-cyan-300">Ctrl + V</kbd> para pegar capturas directamente
                      </span>
                    </div>
                  </div>

                  {/* References List Cards */}
                  {references.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 mt-3">
                      {references.map((ref) => (
                        <div key={ref.id} className="neo-glass-panel rounded-xl p-2.5 flex items-center gap-2.5 border border-white/10 relative group">
                          {ref.type === 'image' && (
                            <img
                              src={ref.content}
                              alt={ref.name}
                              className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{ref.name}</div>
                            {/* Color preview bar */}
                            {ref.extractedColors && ref.extractedColors.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                {ref.extractedColors.map((c, i) => (
                                  <div
                                    key={i}
                                    style={{ backgroundColor: c }}
                                    className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm"
                                    title={c}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveRef(ref.id); }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Textual Guidance Prompt */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                    3. Directrices Textuales & Fusión ("Más de X, Menos de Y")
                  </label>
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder='Ej: "Combina la jerarquía de tarjetas del primer screenshot con los botones verde esmeralda del segundo. Bordes finos de 1px, tipografía moderna y efecto cristal en barras de navegación."'
                    className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/60 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                  />
                </div>

                {/* Synthesize Button */}
                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing || (!promptText.trim() && references.length === 0)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <Wand2 className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>{isSynthesizing ? 'Sintetizando ADN Visual...' : 'Sintetizar y Compilar Skill'}</span>
                </button>
              </div>

              {/* Right Column: Live Synthesized Skill Preview & Quick Apply */}
              <div className="w-5/12 p-6 flex flex-col justify-between bg-black/20 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Vista Previa de la Habilidad
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {currentPreviewSkill.version}
                    </span>
                  </div>

                  {/* Skill Card Spec */}
                  <div className="neo-glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{currentPreviewSkill.name}</h3>
                      <div className="flex items-center gap-1">
                        <span
                          style={{ backgroundColor: currentPreviewSkill.tokens.primaryColor }}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-[0_0_8px_currentColor]"
                          title="Primary"
                        />
                        <span
                          style={{ backgroundColor: currentPreviewSkill.tokens.cardColor }}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          title="Card"
                        />
                        <span
                          style={{ backgroundColor: currentPreviewSkill.tokens.backgroundColor }}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          title="Background"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentPreviewSkill.description}
                    </p>

                    {/* Tokens Summary */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-white/[0.08]">
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block text-[9px]">RADIO ESQUINAS</span>
                        <span className="text-cyan-300 font-bold">{currentPreviewSkill.tokens.borderRadius}</span>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block text-[9px]">BORDE / ELEVACIÓN</span>
                        <span className="text-cyan-300 font-bold">{currentPreviewSkill.tokens.borderWidth}</span>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block text-[9px]">TIPOGRAFÍA</span>
                        <span className="text-slate-200 truncate block">{currentPreviewSkill.tokens.fontFamily}</span>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block text-[9px]">DENSIDAD</span>
                        <span className="text-slate-200 capitalize">{currentPreviewSkill.tokens.spacingDensity}</span>
                      </div>
                    </div>

                    {/* Mock Component Preview Box */}
                    <div 
                      style={{
                        backgroundColor: currentPreviewSkill.tokens.backgroundColor,
                        color: currentPreviewSkill.tokens.textColor,
                      }}
                      className="p-3.5 rounded-xl border border-white/10 shadow-inner space-y-2.5 transition-all"
                    >
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>SIMULACIÓN VISUAL</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
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
                          <span>Módulo Demo</span>
                          <span 
                            style={{
                              backgroundColor: `${currentPreviewSkill.tokens.primaryColor}33`,
                              color: currentPreviewSkill.tokens.primaryColor,
                            }}
                            className="px-2 py-0.5 rounded-full text-[10px]"
                          >
                            Activo
                          </span>
                        </div>
                        <p style={{ color: currentPreviewSkill.tokens.mutedColor }} className="text-[11px]">
                          Texto de prueba adaptado con las reglas cromáticas y de contraste del sistema.
                        </p>
                        <button
                          style={{
                            backgroundColor: currentPreviewSkill.tokens.primaryColor,
                            borderRadius: currentPreviewSkill.tokens.borderRadius,
                            boxShadow: currentPreviewSkill.tokens.boxShadow,
                          }}
                          className="w-full py-1.5 text-white text-xs font-semibold shadow transition-transform active:scale-95"
                        >
                          Botón de Acción
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Actions */}
                <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Inyectar ADN Visual al Proyecto
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onApplySkill(currentPreviewSkill, 'screen');
                        soundEngine.playProceduralSound('switch');
                      }}
                      className="px-3 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Pantalla Activa</span>
                    </button>
                    <button
                      onClick={() => {
                        onApplySkill(currentPreviewSkill, 'all');
                        soundEngine.playProceduralSound('chime');
                      }}
                      className="px-3 py-2 bg-cyan-600/80 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Todo el Proyecto</span>
                    </button>
                  </div>

                  {selectedNode && (
                    <button
                      onClick={() => {
                        onApplySkill(currentPreviewSkill, 'selection');
                        soundEngine.playProceduralSound('pop');
                      }}
                      className="w-full py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aplicar solo a elemento #{selectedNode.name}</span>
                    </button>
                  )}
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
                      className={`neo-glass-panel rounded-2xl p-5 border transition-all cursor-pointer relative group ${
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
                              onApplySkill(sk, 'screen');
                              soundEngine.playProceduralSound('chime');
                            }}
                            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Aplicar
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
            <div className="flex-1 p-6 flex flex-col overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Especificación Oficial SKILL.md</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Archivo estructurado compatible directamente con Claude Code, Anthropic Labs y Cursor.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(currentPreviewSkill.rawMarkdown)}
                    className="px-3 py-1.5 neo-glass-btn text-xs font-semibold rounded-xl text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
                  >
                    {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMd ? 'Copiado' : 'Copiar Markdown'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadSkillMd(currentPreviewSkill)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar SKILL.md</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black/60 rounded-2xl border border-white/10 p-4 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed selection:bg-cyan-500 selection:text-black">
                {currentPreviewSkill.rawMarkdown}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
