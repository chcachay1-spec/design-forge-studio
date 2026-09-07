import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Download,
  ExternalLink,
  Gift,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../lib/audio-engine';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedExport: () => void;
  exportType: 'react' | 'zip' | null;
}

export const ExportPaywallModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onProceedExport,
  exportType: _exportType,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [hasDonatedBefore] = useState(() => {
    try {
      return localStorage.getItem('designforge_donated') === 'true';
    } catch { return false; }
  });

  if (!isOpen) return null;

  const donationAmounts = [
    { value: 3, label: '\$3', emoji: '☕', desc: 'Un café' },
    { value: 5, label: '\$5', emoji: '🌟', desc: 'Apoyo base' },
    { value: 10, label: '\$10', emoji: '🚀', desc: 'Impulso pro' },
    { value: 25, label: '\$25', emoji: '💎', desc: 'Patrón del proyecto' },
  ];

  const handleDonate = () => {
    soundEngine.playProceduralSound('chime');
    // Mark as donated in localStorage
    try { localStorage.setItem('designforge_donated', 'true'); } catch {}
    setShowThanks(true);
    // Open donation link (placeholder — replace with real link)
    const donationUrl = 'https://buymeacoffee.com/designforge';
    window.open(donationUrl, '_blank');
    // After brief delay, proceed with the export
    setTimeout(() => {
      onProceedExport();
      onClose();
      setShowThanks(false);
      setSelectedAmount(null);
    }, 1200);
  };

  const handleSkipAndExport = () => {
    soundEngine.playProceduralSound('switch');
    onProceedExport();
    onClose();
    setSelectedAmount(null);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-60 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="neo-glass-panel border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_35px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(99,102,241,0.25)] space-y-5 relative overflow-hidden">
        
        {/* Glow backdrop decorative */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2.5 max-w-md mx-auto relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 border border-pink-500/30 text-[11px] font-mono font-bold text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>EXPORTACIÓN GRATUITA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Tu proyecto está{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              listo para exportar
            </span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            La exportación es <strong className="text-emerald-300">100% gratuita</strong> y siempre lo será. 
            Si DesignForge te ha sido útil, considera apoyar con una donación voluntaria 
            para impulsar este y otros proyectos open-source. 💜
          </p>
        </div>

        {showThanks ? (
          <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500/30 to-indigo-500/30 border border-pink-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white">¡Muchas gracias! 💜</h3>
            <p className="text-xs text-slate-300">Tu apoyo hace posible que sigamos creando. Exportando tu proyecto...</p>
          </div>
        ) : (
          <>
            {/* Donation amount selector */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                <span>Elige un monto de donación (opcional):</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {donationAmounts.map((amt) => (
                  <button
                    key={amt.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt.value === selectedAmount ? null : amt.value);
                      soundEngine.playProceduralSound('pop');
                    }}
                    className={'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all ' + (
                      selectedAmount === amt.value
                        ? 'bg-indigo-600/30 border-indigo-400/60 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.03]'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <span className="text-lg">{amt.emoji}</span>
                    <span className="text-sm font-black">{amt.label}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{amt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Donate & Export */}
              {selectedAmount && (
                <button
                  type="button"
                  onClick={handleDonate}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Heart className="w-4 h-4" />
                  <span>Donar {donationAmounts.find(a => a.value === selectedAmount)?.label} y Exportar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}

              {/* Skip & Export Free */}
              <button
                type="button"
                onClick={handleSkipAndExport}
                className={'w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] ' + (
                  selectedAmount
                    ? 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60 hover:border-slate-500'
                    : 'bg-gradient-to-r from-emerald-600/80 to-cyan-600/80 hover:brightness-110 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/40'
                )}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{selectedAmount ? 'No gracias, solo exportar gratis' : 'Exportar proyecto gratis'}</span>
              </button>
            </div>

            {/* Previous donor badge */}
            {hasDonatedBefore && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-indigo-300 bg-indigo-950/40 py-2 px-3 rounded-xl border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">¡Ya has apoyado este proyecto antes! Gracias por ser parte. 💜</span>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 font-mono leading-relaxed">
          DesignForge es un proyecto open-source. Todas las funciones y exportaciones son 100% gratuitas.
          <br />
          Las donaciones son voluntarias y se destinan a mantener y mejorar el proyecto.
        </div>
      </div>
    </div>
  );
};
