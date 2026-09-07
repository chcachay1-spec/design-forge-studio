import React, { useState } from 'react';
import { MousePointer, MessageSquarePlus, Edit3, Sparkles, PenTool, Wand2, X } from 'lucide-react';
import { soundEngine } from '../lib/audio-engine';
import type { DesignNode } from '../lib/types';

export type ClaudeDesignMode = 'select' | 'comment' | 'edit';

interface ClaudeDesignPillBarProps {
  activeMode: ClaudeDesignMode;
  onModeChange: (mode: ClaudeDesignMode) => void;
  selectedNode: DesignNode | null;
  onOpenVectorStudio: () => void;
  onApplyElementAiChange: (nodeId: string, prompt: string) => Promise<void> | void;
  isAiLoading?: boolean;
}

export const ClaudeDesignPillBar: React.FC<ClaudeDesignPillBarProps> = ({
  activeMode,
  onModeChange,
  selectedNode,
  onOpenVectorStudio,
  onApplyElementAiChange,
  isAiLoading = false,
}) => {
  const [commentPrompt, setCommentPrompt] = useState('');
  const [showCommentPopover, setShowCommentPopover] = useState(false);

  const handleModeClick = (mode: ClaudeDesignMode) => {
    soundEngine.playProceduralSound('pop');
    onModeChange(mode);
    if (mode === 'comment' && selectedNode) {
      setShowCommentPopover(true);
    } else if (mode !== 'comment') {
      setShowCommentPopover(false);
    }
  };

  const handleSendElementAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentPrompt.trim() || !selectedNode || isAiLoading) return;
    const p = commentPrompt.trim();
    setCommentPrompt('');
    setShowCommentPopover(false);
    await onApplyElementAiChange(selectedNode.id, p);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none">
      {/* Contextual AI Comment Prompt Card (Claude Design style for targeted node) */}
      {activeMode === 'comment' && selectedNode && showCommentPopover && (
        <div className="neo-glass-panel border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.25)] rounded-2xl p-3.5 w-84 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wide">RETOQUE CON IA</span>
              <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30 truncate max-w-[120px]">
                {selectedNode.name}
              </span>
            </div>
            <button
              onClick={() => setShowCommentPopover(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleSendElementAi} className="mt-2.5 space-y-2.5">
            <textarea
              rows={2}
              autoFocus
              value={commentPrompt}
              onChange={(e) => setCommentPrompt(e.target.value)}
              placeholder='Ej: "Haz este botón verde degradado con bordes redondeados y sombra suave", "Cambia el texto a Comprar Ahora"'
              className="w-full bg-black/50 border border-white/[0.08] focus:border-cyan-400/50 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none transition-all"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-mono">MODIFICAR NODO ACTIVO</span>
              <button
                type="submit"
                disabled={isAiLoading || !commentPrompt.trim()}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-200 disabled:opacity-40 rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all"
              >
                {isAiLoading ? (
                  <Wand2 className="w-3 h-3 animate-spin text-cyan-300" />
                ) : (
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                )}
                <span>Aplicar IA</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contextual Manual Edit Tool Ribbon (When in Edit mode and an element is selected) */}
      {activeMode === 'edit' && selectedNode && (
        <div className="neo-glass-panel border-white/[0.1] shadow-[0_15px_35px_rgba(0,0,0,0.85)] rounded-xl px-3 py-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 pr-2.5 border-r border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="truncate max-w-[110px] font-mono">{selectedNode.name}</span>
          </div>

          {/* Quick Launch Vector Studio (Tools from report) */}
          <button
            onClick={() => {
              soundEngine.playProceduralSound('pop');
              onOpenVectorStudio();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 rounded-lg text-xs font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            title="Abrir Redes Vectoriales, Creador de Formas y Persona Píxel"
          >
            <PenTool className="w-3.5 h-3.5 text-cyan-300" />
            <span>Herramientas Vectoriales</span>
          </button>

          {/* Prompt quick comment for this element */}
          <button
            onClick={() => {
              onModeChange('comment');
              setShowCommentPopover(true);
            }}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
            title="Pedir cambio con IA sobre este elemento"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Retoque IA</span>
          </button>
        </div>
      )}

      {/* Floating Pill Dock Bar (Exact replicate of user's Claude Design toolbar: Cursor | Comment | Edit) */}
      <nav 
        aria-label="Modos de lienzo Claude Design" 
        className="neo-glass-panel rounded-full px-2 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.15)] flex items-center gap-1.5 transition-all border-white/[0.12]"
      >
        {/* Pointer / Select Tool */}
        <button
          onClick={() => handleModeClick('select')}
          className={
            'p-2 rounded-full transition-all flex items-center justify-center ' +
            (activeMode === 'select' ? 'bg-white/[0.12] text-white shadow-[0_0_12px_rgba(255,255,255,0.2)] border border-white/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent')
          }
          title="Modo Selección (Navegación normal)"
        >
          <MousePointer className="w-4 h-4 transform -rotate-12" />
        </button>

        {/* Comment Tool (Claude Design contextual AI prompt & notes) */}
        <button
          onClick={() => handleModeClick('comment')}
          className={
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ' +
            (activeMode === 'comment' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent')
          }
          title="Modo Comment: Haz clic en un elemento para cambiarlo con IA sin tener que leer todo el código"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Comment</span>
        </button>

        {/* Edit Tool (Manual Pro editing with Vector Studio, Shaper, Bezier & Inspector) */}
        <button
          onClick={() => handleModeClick('edit')}
          className={
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ' +
            (activeMode === 'edit' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent')
          }
          title="Modo Edit: Edición manual avanzada con Redes Vectoriales, Buscatrazos, Shaper Tool y Persona Píxel"
        >
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Edit</span>
        </button>
      </nav>
    </div>
  );
};
