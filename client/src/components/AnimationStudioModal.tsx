import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Download, 
  Upload, 
  Check, 
  Layers, 
  Layers2, 
  Plus, 
  Code,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import type { CustomAnimationDefinition, DesignNode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface AnimationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  animations: CustomAnimationDefinition[];
  onAddAnimation: (anim: CustomAnimationDefinition) => void;
  selectedNode: DesignNode | null;
  onAssignAnimationToSelected: (animationClass: string, duration?: string) => void;
  onMoveDepth?: (direction: 'front' | 'back' | 'forward' | 'backward') => void;
}

export const AnimationStudioModal: React.FC<AnimationStudioModalProps> = ({
  isOpen,
  onClose,
  animations,
  onAddAnimation,
  selectedNode,
  onAssignAnimationToSelected,
  onMoveDepth,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'import_export'>('presets');
  const [selectedAnimId, setSelectedAnimId] = useState<string>(animations[0]?.id || 'anim-neon-pulse');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Custom animation creator state
  const [name, setName] = useState('Float & Glow 3D');
  const [duration, setDuration] = useState('2.5s');
  const [timing, setTiming] = useState('ease-in-out');
  const [category, setCategory] = useState<'motion' | 'glow' | 'attention' | 'fade'>('motion');
  const [customKeyframes, setCustomKeyframes] = useState(`
@keyframes anim-user-created {
  0%, 100% {
    transform: translateY(0px) scale(1);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }
  50% {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(236, 72, 153, 0.6);
  }
}
.anim-user-created {
  animation: anim-user-created 2.5s infinite ease-in-out;
}
`);

  if (!isOpen) return null;

  const currentSelectedAnim = animations.find(a => a.id === selectedAnimId) || animations[0];

  const handleCreateAnimation = () => {
    const classId = `anim-custom-${Date.now().toString().slice(-4)}`;
    // Normalize class in CSS
    const updatedCss = customKeyframes
      .replace(/@keyframes\s+[\w-]+/g, `@keyframes ${classId}`)
      .replace(/\.[\w-]+\s*\{/g, `.${classId} {`)
      .replace(/animation:\s*[\w-]+/g, `animation: ${classId}`);

    const newAnim: CustomAnimationDefinition = {
      id: classId,
      name: name.trim() || 'Animación Personalizada',
      description: `Creada en el estudio (${duration}, ${timing})`,
      keyframesCss: updatedCss,
      animationClass: classId,
      defaultDuration: duration,
      defaultTiming: timing,
      category,
    };

    onAddAnimation(newAnim);
    setSelectedAnimId(newAnim.id);
    soundEngine.playProceduralSound('chime');
    setFeedback(`¡"${newAnim.name}" guardada y lista!`);
    setTimeout(() => setFeedback(null), 2500);
    setActiveTab('presets');
  };

  const handleExportJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appName: 'DesignForge Animation Pack',
      animations,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `designforge-animations-${Date.now().toString().slice(-4)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    soundEngine.playProceduralSound('pop');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.animations && Array.isArray(parsed.animations)) {
          parsed.animations.forEach((a: CustomAnimationDefinition) => {
            onAddAnimation(a);
          });
          soundEngine.playProceduralSound('chime');
          setFeedback(`Se importaron ${parsed.animations.length} animaciones.`);
          setTimeout(() => setFeedback(null), 3000);
        } else {
          alert('El archivo no contiene un formato de animaciones válido.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="h-12 px-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">Estudio de Animaciones & Profundidad</h2>
              <p className="text-[10px] text-slate-400">Diseña, asigna a tarjetas, exporta e importa efectos clave</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/20 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-pink-500 text-pink-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Biblioteca de Animaciones ({animations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-pink-500 text-pink-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Diseñador CSS Keyframes</span>
          </button>
          <button
            onClick={() => setActiveTab('import_export')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'import_export'
                ? 'border-pink-500 text-pink-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar & Importar</span>
          </button>
        </div>

        {feedback && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 px-5 py-1.5 text-xs flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Work Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 border-r border-slate-800/80">
            {/* Context Alert for Target Element */}
            {selectedNode ? (
              <div className="bg-slate-900/60 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Elemento destino:</span>
                  <span className="font-semibold text-white font-mono">#{selectedNode.id} ({selectedNode.name})</span>
                </div>
                <button
                  onClick={() => {
                    if (currentSelectedAnim) {
                      onAssignAnimationToSelected(currentSelectedAnim.animationClass, currentSelectedAnim.defaultDuration);
                      soundEngine.playProceduralSound('pop');
                      setFeedback(`¡Animación "${currentSelectedAnim.name}" aplicada a #${selectedNode.id}!`);
                      setTimeout(() => setFeedback(null), 2500);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs shadow transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Asignar a este elemento</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400">
                💡 <em>Selecciona una tarjeta o botón en el lienzo para asignarle la animación directamente con 1 clic.</em>
              </div>
            )}

            {/* Depth / Z-Index Controls (Poner sobre o detrás de algo) */}
            {onMoveDepth && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Layers2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Control de Profundidad Espacial (Superponer / Poner Detrás)</span>
                  </span>
                  {selectedNode?.styles?.zIndex !== undefined && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                      Z-Index: {selectedNode.styles.zIndex}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onMoveDepth('front');
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                    title="Poner completamente al frente de todos los elementos"
                  >
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                    <span>Al Frente</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMoveDepth('forward');
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                    title="Subir un nivel sobre el elemento adyacente"
                  >
                    <ChevronUp className="w-3 h-3 text-cyan-400" />
                    <span>Subir 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMoveDepth('backward');
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                    title="Bajar un nivel debajo del elemento adyacente"
                  >
                    <ChevronDown className="w-3 h-3 text-amber-400" />
                    <span>Bajar 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMoveDepth('back');
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                    title="Poner al fondo detrás de todos los elementos"
                  >
                    <ArrowDown className="w-3 h-3 text-rose-400" />
                    <span>Al Fondo</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Catálogo de Animaciones
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {animations.map((anim) => (
                    <div
                      key={anim.id}
                      onClick={() => {
                        setSelectedAnimId(anim.id);
                        soundEngine.playProceduralSound('pop');
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                        selectedAnimId === anim.id
                          ? 'bg-slate-900 border-pink-500 ring-1 ring-pink-500 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{anim.name}</span>
                          <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1 py-0.2 rounded">
                            {anim.defaultDuration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{anim.description}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] font-mono text-pink-400">.{anim.animationClass}</span>
                        {selectedNode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignAnimationToSelected(anim.animationClass, anim.defaultDuration);
                              soundEngine.playProceduralSound('chime');
                              setFeedback(`¡Asignado a #${selectedNode.id}!`);
                              setTimeout(() => setFeedback(null), 2000);
                            }}
                            className="px-2 py-0.5 bg-pink-600 hover:bg-pink-500 text-white rounded text-[10px] font-medium transition-colors"
                          >
                            Asignar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM KEYFRAMES DESIGNER */}
            {activeTab === 'custom' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Nombre del Efecto</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Elastic Drop"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Duración</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ej: 2s o 800ms"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Curva de Tiempo (Easing)</label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="ease-in-out">ease-in-out (Suave)</option>
                      <option value="linear">linear (Constante)</option>
                      <option value="cubic-bezier(0.16, 1, 0.3, 1)">spring / bouncy</option>
                      <option value="ease-out">ease-out (Frenado)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="motion">Movimiento (Motion)</option>
                      <option value="glow">Resplandor (Glow)</option>
                      <option value="attention">Atención / Alerta</option>
                      <option value="fade">Desvanecimiento (Fade)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">CSS Keyframes (@keyframes)</label>
                  <textarea
                    rows={8}
                    value={customKeyframes}
                    onChange={(e) => setCustomKeyframes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCreateAnimation}
                    className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Guardar y Agregar a Biblioteca</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: IMPORT & EXPORT */}
            {activeTab === 'import_export' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">
                    Exportar / Respaldar Colección de Animaciones
                  </span>
                  <p className="text-xs text-slate-400">
                    Descarga todas las animaciones personalizadas del proyecto en un archivo JSON para usarlas en otros proyectos o compartirlas con tu equipo.
                  </p>
                  <button
                    onClick={handleExportJson}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar animaciones (.json)</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">
                    Importar Paquete de Animaciones
                  </span>
                  <p className="text-xs text-slate-400">
                    Carga un archivo JSON previamente exportado para enriquecer la biblioteca de animación instantáneamente.
                  </p>
                  <label className="py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    <span>Seleccionar archivo JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Interactive Target Card / Preview Box */}
          <div className="w-full md:w-80 p-5 bg-slate-900/30 flex flex-col items-center justify-between">
            <div className="w-full text-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Previsualización en Target Box
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentSelectedAnim?.name || 'Vista Previa'}
              </span>
            </div>

            {/* Target Box with Selected Animation Applied */}
            <div className="my-8 relative flex items-center justify-center">
              {/* Back Layer Demo to verify Depth (Poner detrás de algo) */}
              <div className="absolute -bottom-3 -right-3 w-28 h-28 rounded-2xl bg-indigo-950/60 border border-indigo-700/40 -z-10 flex items-end justify-end p-2">
                <span className="text-[9px] text-indigo-400 font-mono">Detrás (Z: 0)</span>
              </div>

              {/* Animated Target Card */}
              <div
                className={`w-44 h-40 bg-gradient-to-br from-slate-900 to-slate-950 border border-pink-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between select-none ${
                  currentSelectedAnim?.animationClass || ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs">
                    ❖
                  </div>
                  <span className="text-[9px] font-mono text-pink-400 font-bold bg-pink-950/80 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Target Box</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Efecto asignable</p>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 w-3/4 rounded-full" />
                </div>
              </div>

              {/* Front Layer Demo to verify Depth (Poner sobre algo) */}
              <div className="absolute -top-3 -left-3 w-16 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/50 z-20 flex items-center justify-center shadow-lg pointer-events-none">
                <span className="text-[9px] text-emerald-300 font-mono">Sobre (Z: 20)</span>
              </div>
            </div>

            <div className="w-full text-center space-y-2">
              <p className="text-[10px] text-slate-500 leading-normal">
                Puedes aplicar este efecto a cualquier componente del diseño desde este modal o en el Inspector.
              </p>
              {selectedNode && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentSelectedAnim) {
                      onAssignAnimationToSelected(currentSelectedAnim.animationClass, currentSelectedAnim.defaultDuration);
                      soundEngine.playProceduralSound('chime');
                      setFeedback(`¡Efecto asignado a "${selectedNode.name}"!`);
                      setTimeout(() => setFeedback(null), 2500);
                    }
                  }}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Asignar a #{selectedNode.id}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
