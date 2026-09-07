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
        <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 shadow-2xl rounded-2xl p-3 w-80 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-white">Editar con IA</span>
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/60 truncate max-w-[120px]">
                {selectedNode.name}
              </span>
            </div>
            <button
              onClick={() => setShowCommentPopover(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleSendElementAi} className="mt-2 space-y-2">
            <textarea
              rows={2}
              autoFocus
              value={commentPrompt}
              onChange={(e) => setCommentPrompt(e.target.value)}
              placeholder='Ej: "Haz este botón verde degradado con bordes redondeados y sombra suave", "Cambia el texto a Comprar Ahora"'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">Modifica solo este elemento</span>
              <button
                type="submit"
                disabled={isAiLoading || !commentPrompt.trim()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
              >
                {isAiLoading ? (
                  <Wand2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>Aplicar IA</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contextual Manual Edit Tool Ribbon (When in Edit mode and an element is selected) */}
      {activeMode === 'edit' && selectedNode && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-xl px-3 py-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 pr-2 border-r border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[110px]">{selectedNode.name}</span>
          </div>

          {/* Quick Launch Vector Studio (Tools from report) */}
          <button
            onClick={() => {
              soundEngine.playProceduralSound('pop');
              onOpenVectorStudio();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-medium transition-all"
            title="Abrir Redes Vectoriales, Creador de Formas y Persona Píxel"
          >
            <PenTool className="w-3.5 h-3.5 text-indigo-400" />
            <span>Herramientas Vectoriales</span>
          </button>

          {/* Prompt quick comment for this element */}
          <button
            onClick={() => {
              onModeChange('comment');
              setShowCommentPopover(true);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
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
        className="bg-slate-900/90 hover:bg-slate-900 backdrop-blur-xl border border-slate-700/80 rounded-full px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-1 transition-all"
      >
        {/* Pointer / Select Tool */}
        <button
          onClick={() => handleModeClick('select')}
          className={
            'p-1.5 rounded-full transition-all flex items-center justify-center ' +
            (activeMode === 'select' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50')
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
            (activeMode === 'comment' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/60')
          }
          title="Modo Comment: Haz clic en un elemento para cambiarlo con IA sin tener que leer todo el código"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Comment</span>
        </button>

        {/* Edit Tool (Manual Pro editing with Vector Studio, Shaper, Bezier & Inspector) */}
        <button
          onClick={() => handleModeClick('edit')}
          className={
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ' +
            (activeMode === 'edit' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/60')
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
