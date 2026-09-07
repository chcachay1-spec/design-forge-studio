import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Key, 
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react';
import { 
  type UserLicense, 
  activateLicenseKey, 
  loadUserLicense 
} from '../lib/license';
import { soundEngine } from '../lib/audio-engine';

interface ExportPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (newLicense: UserLicense) => void;
}

export const ExportPaywallModal: React.FC<ExportPaywallModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const currentLicense = loadUserLicense();
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    const res = activateLicenseKey(licenseKeyInput);
    if (res.success) {
      soundEngine.playProceduralSound('chime');
      const updated = loadUserLicense();
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onUnlockSuccess(updated);
        onClose();
      }, 900);
    } else {
      soundEngine.playProceduralSound('pop');
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleQuickDemoUnlock = (tier: 'starter' | 'studio') => {
    soundEngine.playProceduralSound('chime');
    const key = tier === 'starter' ? 'FORGE-STARTER-10' : 'FORGEPRO2026';
    const res = activateLicenseKey(key);
    if (res.success) {
      const updated = loadUserLicense();
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onUnlockSuccess(updated);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-60 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="neo-glass-panel border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-[0_35px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(99,102,241,0.25)] space-y-6 relative overflow-hidden">
        
        {/* Glow backdrop decorative */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-[11px] font-mono font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>EXPORTACIÓN A PRODUCCIÓN</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Exporta tu código <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">React + Tailwind</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Has usado ${currentLicense.exportsUsed} de ${currentLicense.tier === 'studio' ? '∞' : currentLicense.maxExports} exportaciones disponibles. Todas las plantillas de diseño son 100% gratuitas. 
            Elige tu plan de exportación para descargar el código limpio, optimizado y listo para desplegar.
          </p>
        </div>

        {/* Pricing Cards: $5 and $10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: $5 Starter */}
          <div className="neo-glass-card rounded-2xl p-5 border-white/10 hover:border-cyan-400/50 flex flex-col justify-between space-y-4 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] group relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  CREADOR
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">$5</span>
                  <span className="text-[10px] text-slate-400 font-mono"> / 10 exports</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-100">Paquete Starter</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Ideal para creadores y desarrolladores que necesitan exportar proyectos puntuales.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                  <span><strong>10 Exportaciones</strong> completas en ZIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                  <span>Código React + Vite + Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                  <span>Bundles HTML ejecutables offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                  <span>Capturas PNG ilimitadas</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemoUnlock('starter')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 hover:text-white border border-cyan-400/40 hover:border-cyan-400 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Desbloquear Starter ($5)</span>
              </button>
            </div>
          </div>

          {/* Card 2: $10 Studio Pro */}
          <div className="neo-glass-card rounded-2xl p-5 border-indigo-500/40 hover:border-indigo-400/70 flex flex-col justify-between space-y-4 transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] group relative bg-indigo-950/20">
            {/* Best Value Badge */}
            <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-mono text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-indigo-300/40">
              MÁS POPULAR
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/40">
                  STUDIO PRO
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">$10</span>
                  <span className="text-[10px] text-slate-400 font-mono"> / ilimitado</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-100">Licencia Ilimitada Pro</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Para estudios, agencias y freelancers que crean productos continuamente.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-none" />
                  <span><strong>Exportaciones ILIMITADAS</strong> de por vida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-none" />
                  <span>Generador de Pantallas con IA integrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-none" />
                  <span>Licencia Comercial completa para clientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-none" />
                  <span>Soporte prioritario y actualizaciones futuras</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemoUnlock('studio')}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-110 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Desbloquear Studio Pro ($10)</span>
              </button>
            </div>
          </div>
        </div>

        {/* License Key Redemption Section */}
        <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>¿Ya compraste tu clave en Lemon Squeezy o Gumroad?</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Demo: FORGEPRO2026</span>
          </div>

          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              placeholder="Ingresa tu clave de licencia (ej: FORGEPRO2026 o FORGE-STARTER-10)"
              className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] active:scale-95"
            >
              Canjear
            </button>
          </form>

          {statusMessage && (
            <div className={`text-[11px] font-mono p-2 rounded-lg flex items-center gap-2 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
            }`}>
              {statusMessage.type === 'success' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="text-center text-[10px] text-slate-500 font-mono">
          Pago 100% seguro con cifrado SSL de 256 bits. Licencias válidas de por vida.
        </div>
      </div>
    </div>
  );
};
