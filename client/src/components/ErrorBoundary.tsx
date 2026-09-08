import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DesignForge Uncaught Error]:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted local project cache and reload safely
    try {
      localStorage.removeItem('forge_active');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleSoftRecover = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#030712] flex items-center justify-center p-6 text-slate-100 font-sans select-none">
          <div className="max-w-md w-full neo-glass-panel border-rose-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">Recuperación Automática de Estado</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Se detectó una inconsistencia visual al modificar un nodo. La aplicación previno el bloqueo de la pantalla.
              </p>
            </div>

            {this.state.error && (
              <pre className="w-full max-h-24 overflow-y-auto bg-black/60 border border-white/10 rounded-xl p-2.5 text-[10px] text-rose-300 font-mono text-left whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={this.handleSoftRecover}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              >
                Reintentar Render
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Proyecto</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
