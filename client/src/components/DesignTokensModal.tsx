import React, { useState } from 'react';
import { Palette, Check, X, RefreshCw } from 'lucide-react';
import type { ProjectTheme } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface DesignTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ProjectTheme;
  onUpdateTheme: (newTheme: ProjectTheme) => void;
  onPropagateThemeToAllNodes: (newTheme: ProjectTheme) => void;
}

const THEME_PRESETS: ProjectTheme[] = [
  {
    name: 'Modern Violet (Cyberpunk)',
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    backgroundColor: '#0f172a',
    cardColor: '#1e293b',
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderRadius: '16px',
  },
  {
    name: 'Emerald Neo (Fintech)',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    backgroundColor: '#022c22',
    cardColor: '#064e3b',
    textColor: '#f0fdf4',
    mutedColor: '#6ee7b7',
    borderRadius: '14px',
  },
  {
    name: 'Amber Sunset (Creativos)',
    primaryColor: '#f59e0b',
    secondaryColor: '#ef4444',
    backgroundColor: '#1c1917',
    cardColor: '#292524',
    textColor: '#fafaf9',
    mutedColor: '#a8a29e',
    borderRadius: '18px',
  },
  {
    name: 'Minimal Light (Clean Web)',
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
    backgroundColor: '#f8fafc',
    cardColor: '#ffffff',
    textColor: '#0f172a',
    mutedColor: '#64748b',
    borderRadius: '12px',
  },
];

export const DesignTokensModal: React.FC<DesignTokensModalProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
  onPropagateThemeToAllNodes,
}) => {
  const [current, setCurrent] = useState<ProjectTheme>(theme);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key: keyof ProjectTheme, val: string) => {
    setCurrent(prev => ({ ...prev, [key]: val }));
  };

  const handleApply = (propagate: boolean = true) => {
    onUpdateTheme(current);
    if (propagate) {
      onPropagateThemeToAllNodes(current);
    }
    soundEngine.playProceduralSound('chime');
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 800);
  };

  const handleSelectPreset = (preset: ProjectTheme) => {
    setCurrent(preset);
    soundEngine.playProceduralSound('pop');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950/95 border border-slate-800/80 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Sistema de Diseño & Tokens</h2>
              <p className="text-[11px] text-slate-400">Variables globales de color y estilo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-200 rounded-md hover:bg-slate-850 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Paletas Preconfiguradas (Presets)</label>
          <div className="grid grid-cols-2 gap-2">
            {THEME_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={'p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ' + (
                  current.name === p.name
                    ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500 shadow'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                )}
              >
                <div className="flex -space-x-1 shrink-0">
                  <div className="w-4 h-4 rounded-full border border-slate-900 shadow" style={{ backgroundColor: p.primaryColor }} />
                  <div className="w-4 h-4 rounded-full border border-slate-900 shadow" style={{ backgroundColor: p.secondaryColor }} />
                  <div className="w-4 h-4 rounded-full border border-slate-900 shadow" style={{ backgroundColor: p.cardColor }} />
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{p.primaryColor}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Variables */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300">Variables Globales (Tokens)</label>

          <div className="grid grid-cols-2 gap-3">
            {/* Primary Color */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Color Primario (Marca)</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={current.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={current.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Color Secundario / Acento</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={current.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={current.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Card Surface Color */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Color de Superficie / Tarjeta</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={current.cardColor}
                  onChange={(e) => handleChange('cardColor', e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={current.cardColor}
                  onChange={(e) => handleChange('cardColor', e.target.value)}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Global Border Radius */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Radio de Bordes Global</label>
              <select
                value={current.borderRadius}
                onChange={(e) => handleChange('borderRadius', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="6px">Poco Redondeado (6px)</option>
                <option value="12px">Estándar (12px)</option>
                <option value="16px">Moderno (16px)</option>
                <option value="24px">Super Redondo (24px)</option>
                <option value="9999px">Píldora (9999px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleApply(true)}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            {applied ? <Check className="w-4 h-4 text-emerald-300" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{applied ? '¡Tokens Aplicados a Todo!' : 'Aplicar a Todo el Proyecto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
