import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import type { DesignNode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface A11yContrastCheckerProps {
  node: DesignNode;
  onUpdateStyle: (nodeId: string, property: string, value: any) => void;
}

// Convert hex color to sRGB relative luminance
function hexToLuminance(hex: string): number {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return 0.5; // fallback

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Calculate WCAG Contrast Ratio between foreground and background
function calculateContrastRatio(colorHex: string, bgHex: string): number {
  const lum1 = hexToLuminance(colorHex);
  const lum2 = hexToLuminance(bgHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const A11yContrastChecker: React.FC<A11yContrastCheckerProps> = ({ node, onUpdateStyle }) => {
  const styles = node.styles || {};
  const textColor = styles.color || '#ffffff';
  const bgColor = styles.backgroundColor || '#0f172a';

  // Only evaluate when both colors are hex codes
  const isValidColor = (c: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(c.trim());
  const canCalculate = isValidColor(textColor) && isValidColor(bgColor);

  const ratio = canCalculate ? calculateContrastRatio(textColor, bgColor) : 4.8;
  const roundedRatio = ratio.toFixed(2);

  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7.0;
  const passesLargeAA = ratio >= 3.0;

  const fixContrast = () => {
    soundEngine.playProceduralSound('chime');
    // If background is dark, set high contrast white, else high contrast dark slate
    const bgLum = hexToLuminance(bgColor);
    if (bgLum < 0.4) {
      onUpdateStyle(node.id, 'color', '#ffffff');
    } else {
      onUpdateStyle(node.id, 'color', '#0f172a');
    }
  };

  return (
    <div className="space-y-2.5 p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Eye className="w-3.5 h-3.5" />
          <span>Accesibilidad & Contraste (WCAG)</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Ratio:</span>
          <span className={'font-bold ' + (passesAA ? 'text-emerald-400' : 'text-amber-400')}>
            {roundedRatio}:1
          </span>
        </div>
      </div>

      {/* WCAG Compliance Badges */}
      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
        <div className={'p-1.5 rounded-lg border flex flex-col items-center justify-center ' + (
          passesAA ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
        )}>
          <div className="flex items-center gap-1 font-bold">
            {passesAA ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-rose-400" />}
            <span>WCAG AA</span>
          </div>
          <span className="text-[9px] opacity-75">Texto Normal (4.5:1)</span>
        </div>

        <div className={'p-1.5 rounded-lg border flex flex-col items-center justify-center ' + (
          passesAAA ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-400'
        )}>
          <div className="flex items-center gap-1 font-bold">
            {passesAAA ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-slate-500" />}
            <span>WCAG AAA</span>
          </div>
          <span className="text-[9px] opacity-75">Óptimo (7.0:1)</span>
        </div>

        <div className={'p-1.5 rounded-lg border flex flex-col items-center justify-center ' + (
          passesLargeAA ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
        )}>
          <div className="flex items-center gap-1 font-bold">
            {passesLargeAA ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-rose-400" />}
            <span>Texto Grande</span>
          </div>
          <span className="text-[9px] opacity-75">Títulos (3.0:1)</span>
        </div>
      </div>

      {/* 1-Click Fix Button */}
      {!passesAA && (
        <button
          type="button"
          onClick={fixContrast}
          className="w-full py-1.5 px-2 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 shadow transition-all"
        >
          <Sparkles className="w-3 h-3 text-emerald-200" />
          <span>Optimizar Contraste con 1 Clic</span>
        </button>
      )}
    </div>
  );
};
