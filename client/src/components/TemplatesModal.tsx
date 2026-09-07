import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutTemplate, 
  X, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Smartphone, 
  Monitor, 
  Check, 
  BookmarkCheck,
  Crown,
  Star,
  ShieldCheck
} from 'lucide-react';
import { 
  OFFICIAL_TEMPLATES, 
  loadCustomTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate, 
  isUserProActive,
  type ProjectTemplate 
} from '../lib/templates';
import { soundEngine } from '../lib/audio-engine';
import type { ScreenDefinition } from '../lib/types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: ProjectTemplate) => void;
  currentScreens?: ScreenDefinition[];
}

type FilterTab = 'all' | 'mobile' | 'web' | 'custom';

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentScreens = [],
}) => {
  const [customTemplates, setCustomTemplates] = useState<ProjectTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProUser, setIsProUserState] = useState(false);
  

  
  // Custom template creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<ProjectTemplate['category']>('Fintech');
  const [newTemplatePlatform, setNewTemplatePlatform] = useState<'mobile' | 'web'>('mobile');
  const [newTemplateIcon, setNewTemplateIcon] = useState('✨');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomTemplates(loadCustomTemplates());
      setIsProUserState(isUserProActive());
      setIsCreating(false);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Combine user templates with official library
  const allTemplates = [...customTemplates, ...OFFICIAL_TEMPLATES];

  const filteredTemplates = allTemplates.filter(tmpl => {
    // Filter tabs
    if (activeTab === 'mobile' && tmpl.platform !== 'mobile') return false;
    if (activeTab === 'web' && tmpl.platform !== 'web') return false;
    if (activeTab === 'custom' && !tmpl.isCustom) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tmpl.name.toLowerCase().includes(q);
      const matchDesc = tmpl.description.toLowerCase().includes(q);
      const matchCat = tmpl.category.toLowerCase().includes(q);
      const matchTags = tmpl.tags?.some(tag => tag.toLowerCase().includes(q));
      return matchName || matchDesc || matchCat || matchTags;
    }

    return true;
  });

  const handleApply = (tmpl: ProjectTemplate) => {
    soundEngine.playProceduralSound('chime');
    onApplyTemplate(tmpl);
    onClose();
  };



  const handleSaveCurrentAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim() || currentScreens.length === 0) return;

    const newTmpl: ProjectTemplate = {
      id: 'custom-template-' + Date.now(),
      name: newTemplateName.trim(),
      category: newTemplateCategory,
      platform: newTemplatePlatform,
      tier: 'free',
      description: newTemplateDesc.trim() || 'Plantilla personalizada guardada por el usuario.',
      icon: newTemplateIcon || '✨',
      tags: ['Personalizada', newTemplateCategory, newTemplatePlatform],
      isCustom: true,
      screens: JSON.parse(JSON.stringify(currentScreens)),
    };

    const updated = saveCustomTemplate(newTmpl);
    setCustomTemplates(updated);
    soundEngine.playProceduralSound('chime');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsCreating(false);
      setNewTemplateName('');
      setNewTemplateDesc('');
      setActiveTab('custom');
    }, 1200);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteCustomTemplate(id);
    setCustomTemplates(updated);
    soundEngine.playProceduralSound('pop');
  };

  const handleExportTemplateJson = (tmpl: ProjectTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tmpl, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `${tmpl.name.toLowerCase().replace(/\s+/g, '-')}-template.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    soundEngine.playProceduralSound('chime');
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as ProjectTemplate;
        if (parsed.name && parsed.screens && parsed.screens.length > 0) {
          parsed.id = 'imported-template-' + Date.now();
          parsed.isCustom = true;
          parsed.tier = 'free';
          const updated = saveCustomTemplate(parsed);
          setCustomTemplates(updated);
          setActiveTab('custom');
          soundEngine.playProceduralSound('chime');
        } else {
          alert('El archivo no es una plantilla válida de DesignForge.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al leer el archivo JSON de plantilla.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="neo-glass-panel border-cyan-500/30 rounded-2xl max-w-4xl w-full p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh] space-y-4">
        
        {/* Hidden File Input for Template Import */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".json" 
          className="hidden" 
          onChange={handleImportJsonFile} 
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <LayoutTemplate className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Figma & UI8 Template Hub</h2>
                {isProUser ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>PRO ACTIVO</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>100% GRATIS</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                UI Kits completos inspirados en la comunidad de Figma para Mobile y Web con React + Tailwind.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Current as Template CTA */}
            <button
              type="button"
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-1.5 text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isCreating ? 'Ver Catálogo' : 'Guardar mi Diseño'}</span>
            </button>

            {/* Import JSON Template */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors flex items-center gap-1.5"
              title="Importar plantilla compartida en formato .json"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Importar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CREATE TEMPLATE FORM (Save Current Project) */}
        {isCreating && (
          <form onSubmit={handleSaveCurrentAsTemplate} className="neo-glass-card p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 border-cyan-400/30">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                <span>Guardar Proyecto Activo en tu Biblioteca</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentScreens.length} PANTALLA(S)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Nombre del UI Kit:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Crypto Exchange App"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Categoría:</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Fintech">Fintech & Crypto</option>
                  <option value="E-Commerce">E-Commerce & Tiendas</option>
                  <option value="SaaS & Web">SaaS & Dashboards</option>
                  <option value="Social & Chat">Social & Mensajería</option>
                  <option value="Salud & Fitness">Salud & Fitness</option>
                  <option value="Landing & Portfolio">Landing & Portfolios</option>
                  <option value="Gaming & Media">Gaming & Media</option>
                  <option value="Design Systems">Design Systems</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Plataforma y Emoji:</label>
                <div className="flex gap-2">
                  <select
                    value={newTemplatePlatform}
                    onChange={(e) => setNewTemplatePlatform(e.target.value as any)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="mobile">📱 Móvil</option>
                    <option value="web">💻 Web</option>
                  </select>
                  <input
                    type="text"
                    maxLength={3}
                    value={newTemplateIcon}
                    onChange={(e) => setNewTemplateIcon(e.target.value)}
                    className="w-12 text-center bg-black/50 border border-white/10 rounded-lg py-1.5 text-base"
                    title="Icono Emoji"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-400 text-[11px]">Descripción del Kit:</label>
              <input
                type="text"
                placeholder="Ej: UI Kit completo con arquitectura moderna de componentes y diseño responsivo."
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <BookmarkCheck className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? '¡Guardada!' : 'Guardar Plantilla'}</span>
              </button>
            </div>
          </form>
        )}

        {/* FILTERS & SEARCH BAR (Figma Community style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06] text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Todas ({allTemplates.length})
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'mobile'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Smartphone className="w-3 h-3 text-cyan-400" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setActiveTab('web')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'web'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Monitor className="w-3 h-3 text-indigo-400" />
              <span>Web</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>⭐ Mis Kits ({customTemplates.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar UI Kit, estilo o tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.06] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* TEMPLATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-y-auto pr-1 flex-1 min-h-[300px] max-h-[520px]">
          {filteredTemplates.map(tmpl => {
            
            return (
              <div
                key={tmpl.id}
                className={
                  'neo-glass-card p-4 rounded-2xl transition-all flex flex-col justify-between group shadow-lg relative ' +
                  (tmpl.tier === 'pro'
                    ? 'border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                    : 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]')
                }
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      {tmpl.icon}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {tmpl.tier === 'pro' ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>{tmpl.price || '$19 PRO'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          GRATIS
                        </span>
                      )}

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        {tmpl.platform === 'mobile' ? '📱' : '💻'}
                      </span>

                      {tmpl.isCustom && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleExportTemplateJson(tmpl, e)}
                            className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-white/[0.05] transition-colors"
                            title="Descargar archivo JSON de este kit"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTemplate(tmpl.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                            title="Eliminar kit"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="text-cyan-400 font-semibold uppercase">{tmpl.category}</span>
                      {tmpl.rating && (
                        <span className="flex items-center gap-1 text-amber-300">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{tmpl.rating} ({tmpl.downloads || '1k'})</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5 group-hover:text-cyan-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  {tmpl.tags && tmpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {tmpl.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono bg-white/[0.03] text-slate-400 px-1.5 py-0.5 rounded border border-white/[0.04]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleApply(tmpl)}
                  className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 hover:text-white border border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95"
                >
                  <span>Usar Plantilla</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 space-y-2 font-mono text-xs">
              <LayoutTemplate className="w-8 h-8 text-slate-600 mx-auto opacity-60" />
              <p>No se encontraron plantillas en este filtro.</p>
              {activeTab === 'custom' && (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="text-cyan-400 hover:underline font-sans"
                >
                  Haz clic aquí para guardar tu diseño actual como tu primera plantilla.
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};
