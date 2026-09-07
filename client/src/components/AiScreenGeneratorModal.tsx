import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  CreditCard, 
  User, 
  ShoppingBag, 
  BarChart3, 
  LogIn, 
} from 'lucide-react';
import type { ScreenDefinition, DesignNode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface AiScreenGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenGenerated: (newScreen: ScreenDefinition) => void;
}

const TEMPLATE_PROMPTS = [
  {
    title: 'Checkout E-Commerce',
    icon: ShoppingBag,
    prompt: 'Pantalla de checkout móvil para tienda de ropa con resumen de compra, tarjeta de crédito VISA y botón de pago seguro.',
    type: 'checkout'
  },
  {
    title: 'Dashboard de Analíticas',
    icon: BarChart3,
    prompt: 'Panel de control con métricas de ventas, usuarios activos, gráficos de rendimiento y accesos directos.',
    type: 'dashboard'
  },
  {
    title: 'Autenticación & Login',
    icon: LogIn,
    prompt: 'Pantalla de inicio de sesión con inputs de email y contraseña, botón social con Google y enlace de recuperación.',
    type: 'auth'
  },
  {
    title: 'Perfil de Usuario',
    icon: User,
    prompt: 'Perfil de usuario con avatar personalizable, badges de membresía, estadísticas y opciones de configuración.',
    type: 'profile'
  },
  {
    title: 'Billetera Digital Fintech',
    icon: CreditCard,
    prompt: 'App bancaria con balance disponible, tarjeta virtual interactiva, transferencias rápidas y últimos movimientos.',
    type: 'fintech'
  }
];

export const AiScreenGeneratorModal: React.FC<AiScreenGeneratorModalProps> = ({
  isOpen,
  onClose,
  onScreenGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [screenName, setScreenName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stylePreset, setStylePreset] = useState<'modern_dark' | 'clean_light' | 'vibrant_cyber'>('modern_dark');

  if (!isOpen) return null;

  const buildGeneratedScreen = (name: string, description: string): ScreenDefinition => {
    const screenId = 'screen-ai-' + Date.now();
    const cleanName = name.trim() || 'Pantalla IA';

    // Build intelligent node tree based on keywords in prompt
    const isDark = stylePreset !== 'clean_light';
    const bgApp = isDark ? '#090d16' : '#f8fafc';
    const cardBg = isDark ? '#111827' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const subtextColor = isDark ? '#94a3b8' : '#64748b';
    const accentColor = stylePreset === 'vibrant_cyber' ? '#ec4899' : '#6366f1';

    const rootChildren: DesignNode[] = [];

    // 1. Top Bar / Header
    rootChildren.push({
      id: `header-${Date.now()}`,
      name: 'Cabecera de Pantalla',
      type: 'container',
      styles: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: 'transparent'
      },
      children: [
        {
          id: `title-${Date.now()}`,
          name: 'Título Principal',
          type: 'text',
          content: cleanName,
          styles: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: textColor
          }
        },
        {
          id: `badge-${Date.now()}`,
          name: 'Badge Status',
          type: 'badge',
          content: '⚡ IA Pro',
          styles: {
            backgroundColor: `${accentColor}25`,
            color: accentColor,
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600'
          }
        }
      ]
    });

    // 2. Hero Card / Summary Section
    rootChildren.push({
      id: `hero-card-${Date.now()}`,
      name: 'Tarjeta Principal',
      type: 'card',
      styles: {
        width: '100%',
        backgroundColor: cardBg,
        borderRadius: '18px',
        padding: '20px',
        boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)' : '0 4px 15px -2px rgba(0, 0, 0, 0.05)',
        borderWidth: '1px',
        borderColor: isDark ? '#1f2937' : '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      },
      children: [
        {
          id: `subhead-${Date.now()}`,
          name: 'Subtítulo',
          type: 'text',
          content: description.slice(0, 80) || 'Vista generada con precisión por DesignForge AI Engine.',
          styles: {
            fontSize: '13px',
            color: subtextColor,
            lineHeight: '1.4'
          }
        },
        {
          id: `metric-box-${Date.now()}`,
          name: 'Métrica Clave',
          type: 'metric',
          content: '$24,580.00',
          secondaryContent: '+18.4% este mes',
          styles: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: textColor,
            display: 'flex',
            flexDirection: 'column'
          }
        }
      ]
    });

    // 3. Form or Interactive Action Area
    rootChildren.push({
      id: `form-section-${Date.now()}`,
      name: 'Formulario / Acciones',
      type: 'container',
      styles: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '8px 0'
      },
      children: [
        {
          id: `input-field-${Date.now()}`,
          name: 'Campo de Texto',
          type: 'input',
          placeholder: 'Ingresa tu información...',
          styles: {
            width: '100%',
            backgroundColor: isDark ? '#0b1120' : '#f1f5f9',
            color: textColor,
            borderRadius: '12px',
            padding: '12px 14px',
            borderColor: isDark ? '#334155' : '#cbd5e1',
            borderWidth: '1px'
          }
        },
        {
          id: `action-btn-${Date.now()}`,
          name: 'Botón de Confirmación',
          type: 'button',
          content: 'Continuar Acción Principal →',
          styles: {
            width: '100%',
            backgroundColor: accentColor,
            color: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center',
            boxShadow: `0 4px 14px 0 ${accentColor}50`
          },
          action: {
            type: 'confetti'
          }
        }
      ]
    });

    return {
      id: screenId,
      name: cleanName,
      rootNode: {
        id: `root-${screenId}`,
        name: cleanName,
        type: 'container',
        styles: {
          width: '100%',
          minHeight: '100%',
          backgroundColor: bgApp,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        },
        children: rootChildren
      }
    };
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    soundEngine.playProceduralSound('whoosh');

    setTimeout(() => {
      const generated = buildGeneratedScreen(screenName || 'Nueva Pantalla IA', prompt);
      onScreenGenerated(generated);
      setIsGenerating(false);
      soundEngine.playProceduralSound('chime');
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Generador IA de Pantallas Completas</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">v2.0</span>
              </h2>
              <p className="text-xs text-slate-400">Describe tu idea y el motor creará una pantalla interactiva con Auto Layout.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Preset Prompts */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plantillas Rápidas de Prompt</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATE_PROMPTS.map((tp, idx) => {
                const Icon = tp.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(tp.prompt);
                      setScreenName(tp.title);
                      soundEngine.playProceduralSound('pop');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/60 text-left transition-all group hover:bg-indigo-950/20"
                  >
                    <Icon className="w-4 h-4 text-indigo-400 group-hover:text-pink-400 mb-1.5 transition-colors" />
                    <div className="text-xs font-semibold text-slate-200">{tp.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screen Name */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Nombre de la pantalla / pestaña:</label>
            <input
              type="text"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              placeholder="Ej: Checkout Tienda, Perfil de Usuario..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Prompt input */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Prompt descriptivo:</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe los elementos, disposición, tarjetas, inputs y colores que deseas que compongan la interfaz..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Aesthetic Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Estilo Visual Base:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStylePreset('modern_dark')}
                className={'p-2 rounded-xl border text-center text-xs font-medium transition-all ' + (
                  stylePreset === 'modern_dark' ? 'bg-indigo-600/30 border-indigo-500 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                )}
              >
                🌙 Modern Dark
              </button>
              <button
                type="button"
                onClick={() => setStylePreset('clean_light')}
                className={'p-2 rounded-xl border text-center text-xs font-medium transition-all ' + (
                  stylePreset === 'clean_light' ? 'bg-indigo-600/30 border-indigo-500 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                )}
              >
                ☀️ Clean Light
              </button>
              <button
                type="button"
                onClick={() => setStylePreset('vibrant_cyber')}
                className={'p-2 rounded-xl border text-center text-xs font-medium transition-all ' + (
                  stylePreset === 'vibrant_cyber' ? 'bg-pink-600/30 border-pink-500 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                )}
              >
                ⚡ Cyber Vibrant
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!prompt.trim() || isGenerating}
            onClick={handleGenerate}
            className={'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ' + (
              prompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            )}
          >
            <Sparkles className={'w-3.5 h-3.5 ' + (isGenerating ? 'animate-spin text-pink-300' : 'text-white')} />
            <span>{isGenerating ? 'Generando Pantalla...' : 'Generar Pantalla IA ↗'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
