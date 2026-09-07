import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Sliders, 
  Download, 
  Upload, 
  Plus, 
  Sparkles, 
  Radio, 
  Check, 
  FileAudio,
  Trash2,
  Share2,
  Wand2,
  Code2,
  Copy,
  Layers,
  Gamepad2,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../lib/audio-engine';
import type { CustomSoundDefinition, CustomSynthParams, DesignNode } from '../lib/types';
import { 
  SOUND_UI_PRESETS, 
  generateSoundFromPrompt, 
  generateRetro8BitSound 
} from '../lib/sound-designer';
import { 
  bufferToWav, 
  renderSynthToBuffer, 
  generateSoundCodeSnippet 
} from '../lib/sound-exporter';

interface SoundLabProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySoundToAllButtons: (soundType: string) => void;
  customSounds: CustomSoundDefinition[];
  onAddCustomSound: (sound: CustomSoundDefinition) => void;
  onDeleteCustomSound?: (id: string) => void;
  selectedNode: DesignNode | null;
  onAssignSoundToSelected?: (trigger: 'onClick' | 'onHover', soundId: string) => void;
}

export const SoundLab: React.FC<SoundLabProps> = ({
  isOpen,
  onClose,
  onApplySoundToAllButtons,
  customSounds,
  onAddCustomSound,
  onDeleteCustomSound,
  selectedNode,
  onAssignSoundToSelected,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'presets' | 'synth' | 'retro' | 'library' | 'import_export'>('prompt');
  const [volume, setVolume] = useState(0.7);

  // 1. Text-to-Audio AI Prompting & Variations State
  const [promptText, setPromptText] = useState('');
  const [maxDuration, setMaxDuration] = useState(0.25); // Limitador estricto para micro-interacciones
  const [generatedPromptSound, setGeneratedPromptSound] = useState<{
    name: string;
    params: CustomSynthParams;
    variations: CustomSynthParams[];
  } | null>(null);

  // 2. Synth builder states with Fades (Attack & Decay)
  const [synthName, setSynthName] = useState('Clic Sutil UI');
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('triangle');
  const [startFreq, setStartFreq] = useState(850);
  const [endFreq, setEndFreq] = useState(140);
  const [duration, setDuration] = useState(0.08);
  const [attack, setAttack] = useState(0.005);
  const [decay, setDecay] = useState(0.07);
  const [ramp, setRamp] = useState<'exponential' | 'linear'>('exponential');
  const [synthGain, setSynthGain] = useState(0.8);

  // 3. Code Snippet Language
  const [codeSnippetLang, setCodeSnippetLang] = useState<'js' | 'swift' | 'kotlin'>('js');
  const [copiedCode, setCopiedCode] = useState(false);

  // 4. Preset Category Filter
  const [presetCategory, setPresetCategory] = useState<'Todos' | 'Botones' | 'Notificaciones' | 'Éxito' | 'Error' | 'Transición'>('Todos');

  const [previewFeedback, setPreviewFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const NATIVE_SOUND_EFFECTS: Array<{
    type: string;
    name: string;
    category: string;
    description: string;
    freqHint: string;
  }> = [
    { type: 'click', name: 'Snappy Click', category: 'Botones', description: 'Pulsación rápida para botones de bajo perfil', freqHint: '800Hz → 120Hz' },
    { type: 'pop', name: 'Bubble Pop', category: 'Botones', description: 'Tap moderno redondo móvil (estilo iOS)', freqHint: '320Hz → 740Hz' },
    { type: 'switch', name: 'Crisp Switch', category: 'Botones', description: 'Toggle de palanca de doble oscilador', freqHint: '1.4kHz + 700Hz' },
    { type: 'chime', name: 'Harmonic Chime', category: 'Éxito', description: 'Acorde C-Mayor de confirmación suave', freqHint: 'C5, E5, G5, C6' },
    { type: 'bell', name: 'Notification Bell', category: 'Notificaciones', description: 'Campana de resonancia para avisos', freqHint: '880Hz Sine' },
    { type: 'whoosh', name: 'Air Transition', category: 'Transición', description: 'Barrido sutil para drawers y modales', freqHint: 'Bandpass 1.8kHz' },
    { type: 'alert', name: 'Gentle Alert', category: 'Error', description: 'Indicador suave para validación', freqHint: '380Hz / 310Hz' },
  ];

  // AI Prompt generation
  const handleGeneratePrompt = () => {
    if (!promptText.trim()) return;
    const res = generateSoundFromPrompt(promptText, maxDuration);
    setGeneratedPromptSound(res);
    soundEngine.playCustomSynth(res.params, volume);
    setPreviewFeedback(`✓ Sonido generado: "${res.name}"`);
    setTimeout(() => setPreviewFeedback(null), 2500);
  };

  // Save generated sound to library
  const handleSaveToLibrary = (params: CustomSynthParams, customCategory?: any) => {
    const id = `synth-${Date.now().toString().slice(-5)}`;
    const newSound: CustomSoundDefinition = {
      id,
      name: params.name || 'Nuevo Sonido UI',
      type: 'synth',
      category: customCategory || 'Botones',
      description: `${params.waveform?.toUpperCase() || 'SINE'} ${params.startFreq}Hz → ${params.endFreq}Hz (${params.duration}s)`,
      synthParams: params,
      createdDate: new Date().toISOString(),
    };
    onAddCustomSound(newSound);
    soundEngine.registerCustomSound(newSound);
    setPreviewFeedback(`¡"${newSound.name}" añadido a la biblioteca!`);
    setTimeout(() => setPreviewFeedback(null), 2500);
  };

  // Export sound directly to WAV format
  const handleDownloadWav = async (params: CustomSynthParams) => {
    try {
      const buffer = await renderSynthToBuffer(params);
      const wavBlob = bufferToWav(buffer);
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(params.name || 'ui-sound').toLowerCase().replace(/[^a-z0-9]/g, '_')}.wav`;
      link.click();
      URL.revokeObjectURL(url);
      setPreviewFeedback('✓ Archivo WAV descargado');
      setTimeout(() => setPreviewFeedback(null), 2000);
    } catch (err) {
      alert('Error exportando WAV: ' + String(err));
    }
  };

  const handleTestCurrentSynth = () => {
    const params: CustomSynthParams = {
      waveform,
      startFreq,
      endFreq,
      duration,
      attack,
      decay,
      ramp,
      gain: synthGain,
      name: synthName,
    };
    soundEngine.playCustomSynth(params, volume);
  };

  const handleSaveSynthToLibrary = () => {
    const params: CustomSynthParams = {
      waveform,
      startFreq,
      endFreq,
      duration,
      attack,
      decay,
      ramp,
      gain: synthGain,
      name: synthName,
    };
    handleSaveToLibrary(params, 'Botones');
  };

  const handleExportSoundsJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appName: 'DesignForge Sound Pack',
      sounds: customSounds,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `designforge-sound-pack-${Date.now().toString().slice(-4)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.sounds && Array.isArray(parsed.sounds)) {
          parsed.sounds.forEach((s: CustomSoundDefinition) => {
            onAddCustomSound(s);
            soundEngine.registerCustomSound(s);
          });
          setPreviewFeedback(`Se importaron ${parsed.sounds.length} efectos de sonido.`);
          setTimeout(() => setPreviewFeedback(null), 3000);
        } else {
          alert('El archivo no tiene el formato válido de paquete de sonidos.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportAudioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const id = `audio-${Date.now().toString().slice(-5)}`;
        const soundDef: CustomSoundDefinition = {
          id,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'audio_file',
          description: `Archivo ${file.type || 'audio'} (${(file.size / 1024).toFixed(1)} KB)`,
          audioDataUrl: dataUrl,
          createdDate: new Date().toISOString(),
        };
        onAddCustomSound(soundDef);
        soundEngine.registerCustomSound(soundDef);
        setPreviewFeedback(`Audio "${soundDef.name}" importado con éxito.`);
        setTimeout(() => setPreviewFeedback(null), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('Error al cargar archivo de audio: ' + String(err));
    }
    e.target.value = '';
  };

  const filteredPresets = presetCategory === 'Todos'
    ? SOUND_UI_PRESETS
    : SOUND_UI_PRESETS.filter(p => p.category === presetCategory);

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-slate-950/95 backdrop-blur-md border-l border-slate-800/80 shadow-2xl z-40 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white">Diseñador de Sonido UI</h2>
            <p className="text-[10px] text-slate-500">Efectos rápidos, consistencia y exportación</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/60 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/60 bg-slate-900/30 p-1 gap-1 text-[11px] overflow-x-auto">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'prompt' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Generador por Texto a Audio"
        >
          <Wand2 className="w-3 h-3 text-amber-400" />
          <span>IA Prompt</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'presets' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Preconfiguraciones de UI por categoría"
        >
          <Layers className="w-3 h-3 text-indigo-400" />
          <span>Presets UI</span>
        </button>

        <button
          onClick={() => setActiveTab('synth')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'synth' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Sintetizador con Ataque y Decaimiento"
        >
          <Sliders className="w-3 h-3 text-emerald-400" />
          <span>Sintetizador</span>
        </button>

        <button
          onClick={() => setActiveTab('retro')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'retro' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Generador 8-Bits Estilo jsfxr"
        >
          <Gamepad2 className="w-3 h-3 text-pink-400" />
          <span>8-Bits</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'library' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Biblioteca y Colecciones"
        >
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Biblioteca</span>
        </button>

        <button
          onClick={() => setActiveTab('import_export')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'import_export' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
          title="Importar y Exportar"
        >
          <Share2 className="w-3 h-3 text-slate-400" />
          <span>Exportar</span>
        </button>
      </div>

      {previewFeedback && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-300 px-4 py-1.5 text-[11px] font-medium flex items-center gap-1.5">
          <Check className="w-3 h-3" />
          <span>{previewFeedback}</span>
        </div>
      )}

      {/* Body Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        {/* Master Volume Slider */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
              <Sliders className="w-3 h-3 text-amber-400" />
              <span>Volumen de Salida</span>
            </span>
            <span className="font-mono text-amber-400 text-xs">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5"
          />
        </div>

        {/* TAB 0: TEXT-TO-AUDIO AI PROMPT (MVP CRITICAL) */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generador de Texto a Audio UI</span>
                </span>
                <span className="text-[9px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-800/60">
                  Micro-efectos UI
                </span>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Describe el sonido que necesitas:</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                    placeholder="Ej: 'clic sutil', 'alerta de exito', 'deslizar menu'..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleGeneratePrompt}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Crear</span>
                  </button>
                </div>
              </div>

              {/* Strict Duration Limiter (Under 1-2s for micro-interactions) */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">Ajuste de Duración Estricto (UI Limiter):</span>
                  <span className="font-mono text-amber-400">{Math.round(maxDuration * 1000)} ms</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="1.5"
                  step="0.02"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5"
                />
                <p className="text-[9px] text-slate-500">
                  Garantiza que los sonidos de interacción no saturen la navegación (máx 1.5s).
                </p>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <label className="text-[10px] text-slate-400">Sugerencias rápidas:</label>
                <div className="flex flex-wrap gap-1">
                  {['clic sutil', 'pop burbuja', 'alerta de exito', 'deslizar menu', 'campana suave', 'error rechazo'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPromptText(p);
                        const res = generateSoundFromPrompt(p, maxDuration);
                        setGeneratedPromptSound(res);
                        soundEngine.playCustomSynth(res.params, volume);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Sound Card & 4 Micro-Variations (Anti-fatigue) */}
            {generatedPromptSound && (
              <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">{generatedPromptSound.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Math.round((generatedPromptSound.params.duration || 0.08) * 1000)}ms • {generatedPromptSound.params.waveform?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => soundEngine.playCustomSynth(generatedPromptSound.params, volume)}
                      className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                      title="Reproducir audio principal"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleDownloadWav(generatedPromptSound.params)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                      title="Descargar WAV directo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSaveToLibrary(generatedPromptSound.params, 'Botones')}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                      title="Guardar en biblioteca"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Variador de Muestras (Generar Similares / Anti-Fatigue) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-indigo-400" />
                      <span>Variaciones Anti-Fatiga (4 Tonos):</span>
                    </span>
                    <span className="text-[9px] text-slate-500">Evita monotonía auditiva</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {generatedPromptSound.variations.map((v, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors"
                      >
                        <div className="truncate mr-1">
                          <span className="text-[10px] font-medium text-slate-200 block truncate">Var {i + 1}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{v.startFreq}Hz</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => soundEngine.playCustomSynth(v, volume)}
                            className="p-1 text-slate-300 hover:text-amber-400 rounded"
                            title="Escuchar variación"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                          <button
                            onClick={() => handleSaveToLibrary(v, 'Botones')}
                            className="p-1 text-slate-400 hover:text-white rounded"
                            title="Guardar esta variación"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Export Snippet */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-cyan-400" />
                      <span>Copiar Código de Reproducción:</span>
                    </span>
                    <div className="flex bg-slate-950 rounded p-0.5 border border-slate-800">
                      {(['js', 'swift', 'kotlin'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setCodeSnippetLang(lang)}
                          className={'px-1.5 py-0.5 rounded text-[9px] font-mono ' + (
                            codeSnippetLang === lang ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto">
                      {generateSoundCodeSnippet(generatedPromptSound.name, 'synth', codeSnippetLang)}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateSoundCodeSnippet(generatedPromptSound.name, 'synth', codeSnippetLang));
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[9px] flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: UI PRESETS BY CATEGORY (UX DESIGNER BOOST) */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
              {(['Todos', 'Botones', 'Notificaciones', 'Éxito', 'Error', 'Transición'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setPresetCategory(cat)}
                  className={'px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ' + (
                    presetCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Preset Cards */}
            <div className="space-y-1.5">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">{preset.name}</span>
                      <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-1 py-0.2 rounded border border-indigo-900/60">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{preset.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => soundEngine.playCustomSynth(preset.params, volume)}
                      className="p-1.5 bg-slate-900 hover:bg-amber-500 text-slate-300 hover:text-slate-950 rounded-lg transition-colors"
                      title="Probar sonido"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={() => handleDownloadWav(preset.params)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="Descargar WAV"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    {selectedNode && onAssignSoundToSelected ? (
                      <button
                        onClick={() => {
                          handleSaveToLibrary(preset.params, preset.category);
                          onAssignSoundToSelected('onClick', preset.params.name || 'preset');
                          setPreviewFeedback('Asignado a #' + selectedNode.id);
                          setTimeout(() => setPreviewFeedback(null), 2000);
                        }}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-medium transition-colors"
                        title="Asignar al elemento seleccionado"
                      >
                        Asignar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveToLibrary(preset.params, preset.category)}
                        className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-colors"
                        title="Guardar en biblioteca"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SYNTHESIZER WITH FADES (ATTACK & DECAY) */}
        {activeTab === 'synth' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sintetizador Procedural Web Audio</span>
                </span>
                <span className="text-[9px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                  En tiempo real
                </span>
              </div>

              {/* Synth Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Nombre del Efecto Sonoro</label>
                <input
                  type="text"
                  value={synthName}
                  onChange={(e) => setSynthName(e.target.value)}
                  placeholder="Ej: Power-up, Laser Tap, Moneda..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Waveform Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Forma de Onda (Oscilador)</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['sine', 'triangle', 'square', 'sawtooth'] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWaveform(w)}
                      className={`py-1 text-[10px] font-medium rounded-md border text-center transition-colors ${
                        waveform === w
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {w.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Range */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Freq Inicio</span>
                    <span className="font-mono text-amber-400">{startFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2400"
                    step="20"
                    value={startFreq}
                    onChange={(e) => setStartFreq(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Freq Fin</span>
                    <span className="font-mono text-amber-400">{endFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="2400"
                    step="20"
                    value={endFreq}
                    onChange={(e) => setEndFreq(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5"
                  />
                </div>
              </div>

              {/* Attack and Decay Fades (UX Designer Crucial) */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Ataque (Fade-in)</span>
                    <span className="font-mono text-emerald-400">{Math.round(attack * 1000)} ms</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.2"
                    step="0.005"
                    value={attack}
                    onChange={(e) => setAttack(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Decaimiento (Fade-out)</span>
                    <span className="font-mono text-amber-400">{Math.round(decay * 1000)} ms</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.8"
                    step="0.01"
                    value={decay}
                    onChange={(e) => setDecay(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-1.5"
                  />
                </div>
              </div>

              {/* Duration & Envelope */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Duración</span>
                    <span className="font-mono text-amber-400">{duration} s</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="1.2"
                    step="0.01"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Envolvente</span>
                    <span className="font-mono text-amber-400">{ramp}</span>
                  </div>
                  <div className="flex bg-slate-900 p-0.5 rounded border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setRamp('exponential')}
                      className={`flex-1 py-0.5 rounded ${ramp === 'exponential' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      Exp
                    </button>
                    <button
                      type="button"
                      onClick={() => setRamp('linear')}
                      className={`flex-1 py-0.5 rounded ${ramp === 'linear' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      Lin
                    </button>
                  </div>
                </div>
              </div>

              {/* Synth Intensity / Gain */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Intensidad de Ataque</span>
                  <span className="font-mono text-amber-400">{Math.round(synthGain * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={synthGain}
                  onChange={(e) => setSynthGain(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5"
                />
              </div>

              {/* Test & Save Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleTestCurrentSynth}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-medium text-xs rounded-lg border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Probar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadWav({
                    waveform,
                    startFreq,
                    endFreq,
                    duration,
                    attack,
                    decay,
                    ramp,
                    gain: synthGain,
                    name: synthName,
                  })}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  title="Descargar WAV directo"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveSynthToLibrary}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>

            {/* Quick Presets for Synth */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Presets de Sintetizador:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Coin Collect', wave: 'sine', sF: 987, eF: 1318, dur: 0.15, ramp: 'linear' },
                  { label: 'Laser Blast', wave: 'sawtooth', sF: 1600, eF: 120, dur: 0.14, ramp: 'exponential' },
                  { label: 'Deep Bass Drop', wave: 'triangle', sF: 350, eF: 40, dur: 0.45, ramp: 'exponential' },
                  { label: 'Mechanical Click', wave: 'square', sF: 1200, eF: 300, dur: 0.04, ramp: 'exponential' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setWaveform(p.wave as any);
                      setStartFreq(p.sF);
                      setEndFreq(p.eF);
                      setDuration(p.dur);
                      setRamp(p.ramp as any);
                      setSynthName(p.label);
                      soundEngine.playCustomSynth({
                        waveform: p.wave as any,
                        startFreq: p.sF,
                        endFreq: p.eF,
                        duration: p.dur,
                        ramp: p.ramp as any,
                        gain: 0.8,
                      }, volume);
                    }}
                    className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-left text-[11px] text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RETRO 8-BIT GENERATOR (ESTILO JSFXR) */}
        {activeTab === 'retro' && (
          <div className="space-y-4">
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Generador 8-Bits Estilo jsfxr</span>
                </span>
                <span className="text-[9px] bg-pink-950 text-pink-300 font-mono px-1.5 py-0.5 rounded border border-pink-800/50">
                  Algorítmico Retro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Genera ondas cuadradas y chiptune con sweeps de frecuencia para interfaces minimalistas, micro-juegos y recompensas nostálgicas.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'coin' as const, label: 'Moneda / Coin', color: 'text-amber-400', desc: 'Arpegio doble ascendente' },
                  { type: 'laser' as const, label: 'Láser UI', color: 'text-cyan-400', desc: 'Sweep descendente rápido' },
                  { type: 'jump' as const, label: 'Salto / Pop', color: 'text-emerald-400', desc: 'Sweep ascendente ágil' },
                  { type: 'hit' as const, label: 'Impacto / Hit', color: 'text-rose-400', desc: 'Ataque percusivo punch' },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 hover:border-pink-500/40 transition-colors"
                  >
                    <div>
                      <span className={`text-xs font-bold block ${item.color}`}>{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1 border-t border-slate-900">
                      <button
                        onClick={() => {
                          const retro = generateRetro8BitSound(item.type);
                          soundEngine.playCustomSynth(retro, volume);
                        }}
                        className="flex-1 py-1 bg-slate-900 hover:bg-pink-600 hover:text-white text-slate-300 rounded text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
                        title="Probar sonido 8-bits"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => {
                          const retro = generateRetro8BitSound(item.type);
                          handleDownloadWav(retro);
                        }}
                        className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                        title="Descargar WAV"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          const retro = generateRetro8BitSound(item.type);
                          handleSaveToLibrary(retro, 'Botones');
                        }}
                        className="p-1 bg-pink-950/60 hover:bg-pink-600 text-pink-300 hover:text-white rounded border border-pink-800/40 transition-colors"
                        title="Guardar en biblioteca"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIBRARY & PROJECT COLLECTIONS */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            {/* Element Assignment Context */}
            {selectedNode && (
              <div className="bg-slate-900/70 border border-indigo-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Elemento seleccionado:</span>
                  <span className="font-semibold text-white font-mono text-[11px]">#{selectedNode.id} ({selectedNode.name})</span>
                </div>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                  Listo para asignar
                </span>
              </div>
            )}

            {/* Custom Synthesized & Imported Sounds */}
            {customSounds.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    ★ Sonidos Personalizados Creados
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{customSounds.length}</span>
                </div>
                <div className="space-y-1.5">
                  {customSounds.map((sound) => (
                    <div
                      key={sound.id}
                      className="bg-slate-950 hover:bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/30 transition-colors flex items-center justify-between"
                    >
                      <div className="truncate mr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">{sound.name}</span>
                          <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded">
                            {sound.category || (sound.type === 'synth' ? 'SYNTH' : 'AUDIO')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{sound.description}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => soundEngine.playProceduralSound(sound.id, volume)}
                          className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg transition-colors"
                          title="Reproducir"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                        {sound.synthParams && (
                          <button
                            onClick={() => handleDownloadWav(sound.synthParams!)}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Descargar WAV"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        )}
                        {selectedNode && onAssignSoundToSelected && (
                          <button
                            onClick={() => {
                              onAssignSoundToSelected('onClick', sound.id);
                              setPreviewFeedback(`Asignado a #${selectedNode.id}`);
                              setTimeout(() => setPreviewFeedback(null), 2000);
                            }}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-medium transition-colors"
                            title="Asignar al elemento seleccionado"
                          >
                            Asignar
                          </button>
                        )}
                        {onDeleteCustomSound && (
                          <button
                            onClick={() => onDeleteCustomSound(sound.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Eliminar de biblioteca"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Native Procedural Sounds */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Efectos Nativos del Sistema
              </span>
              <div className="space-y-1.5">
                {NATIVE_SOUND_EFFECTS.map((sound) => (
                  <div
                    key={sound.type}
                    className="bg-slate-950 hover:bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{sound.name}</span>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-1 py-0.2 rounded border border-indigo-900/40">
                          {sound.category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                          {sound.freqHint}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{sound.description}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => soundEngine.playProceduralSound(sound.type, volume)}
                        className="p-1.5 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 rounded-lg transition-colors"
                        title="Probar sonido"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                      {selectedNode && onAssignSoundToSelected ? (
                        <button
                          onClick={() => {
                            onAssignSoundToSelected('onClick', sound.type);
                            setPreviewFeedback(`Asignado a #${selectedNode.id}`);
                            setTimeout(() => setPreviewFeedback(null), 2000);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded text-[10px] font-medium transition-colors"
                        >
                          Asignar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onApplySoundToAllButtons(sound.type);
                            setPreviewFeedback(`¡Aplicado a todos los botones!`);
                            setTimeout(() => setPreviewFeedback(null), 2000);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded text-[10px] font-medium transition-colors"
                          title="Asignar a todos los botones del proyecto"
                        >
                          Global
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: IMPORT & EXPORT */}
        {activeTab === 'import_export' && (
          <div className="space-y-4">
            {/* Import Audio File */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <FileAudio className="w-4 h-4 text-emerald-400" />
                <span>Importar Archivo de Audio (WAV / MP3 / OGG)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sube tus propios archivos de sonido para integrarlos de forma offline en el proyecto.
              </p>
              <label className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seleccionar Archivo de Audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleImportAudioFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Import / Export Sound Pack JSON */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Paquetes de Sonido (Sound Packs JSON)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Exporta toda tu colección de sintetizadores para compartirla o respaldarla, o importa colecciones externas.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleExportSoundsJson}
                  className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Pack</span>
                </button>

                <label className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Importar Pack</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
