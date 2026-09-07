import React, { useState } from 'react';
import { MessageSquare, Check, Trash2, X } from 'lucide-react';
import type { CanvasComment } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';

interface CommentsLayerProps {
  isActive: boolean;
  comments: CanvasComment[];
  onAddComment: (comment: CanvasComment) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
}

export const CommentsLayer: React.FC<CommentsLayerProps> = ({
  isActive,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
}) => {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [newCommentPos, setNewCommentPos] = useState<{ x: number; y: number } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Diseñador');

  if (!isActive && comments.length === 0) return null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    // Don't trigger if clicked on an existing comment card
    if ((e.target as HTMLElement).closest('.comment-card')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNewCommentPos({ x, y });
    soundEngine.playProceduralSound('pop');
  };

  const handleCreateComment = () => {
    if (!newCommentPos || !newCommentText.trim()) return;

    const newComment: CanvasComment = {
      id: 'cmt-' + Date.now(),
      x: newCommentPos.x,
      y: newCommentPos.y,
      author: authorName.trim() || 'Diseñador',
      content: newCommentText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false,
    };

    onAddComment(newComment);
    soundEngine.playProceduralSound('chime');
    setNewCommentPos(null);
    setNewCommentText('');
  };

  return (
    <div
      onClick={handleCanvasClick}
      className={'absolute inset-0 z-40 ' + (isActive ? 'cursor-crosshair' : 'pointer-events-none')}
    >
      {/* Existing Comments */}
      {comments.map((cmt, idx) => (
        <div
          key={cmt.id}
          style={{ left: cmt.x, top: cmt.y }}
          className="absolute -translate-x-3 -translate-y-3 pointer-events-auto comment-card"
        >
          {/* Pin Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePin(activePin === cmt.id ? null : cmt.id);
              soundEngine.playProceduralSound('pop');
            }}
            className={'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border transition-transform ' + (
              cmt.resolved
                ? 'bg-emerald-600 text-white border-emerald-400 opacity-60'
                : 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/40 hover:scale-110'
            )}
          >
            {idx + 1}
          </button>

          {/* Comment Popover Bubble */}
          {(activePin === cmt.id || isActive) && (
            <div className="absolute left-8 top-0 w-60 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-white">{cmt.author}</span>
                <span className="text-[10px] text-slate-400 font-mono">{cmt.createdAt}</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{cmt.content}</p>
              <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolveComment(cmt.id);
                    soundEngine.playProceduralSound('pop');
                  }}
                  className={'p-1 rounded-lg transition-colors flex items-center gap-1 text-[10px] ' + (
                    cmt.resolved ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'
                  )}
                  title="Marcar como resuelto"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{cmt.resolved ? 'Resuelto' : 'Resolver'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteComment(cmt.id);
                    soundEngine.playProceduralSound('switch');
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                  title="Eliminar nota"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* New Comment Creator Modal */}
      {newCommentPos && isActive && (
        <div
          style={{ left: newCommentPos.x, top: newCommentPos.y }}
          className="absolute -translate-x-3 -translate-y-3 pointer-events-auto comment-card w-64 bg-slate-900 border border-indigo-500 rounded-xl p-3 shadow-2xl z-50 space-y-2 animate-in fade-in duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Nueva Nota en Lienzo
            </span>
            <button
              onClick={() => setNewCommentPos(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Tu nombre..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          />
          <textarea
            rows={2}
            autoFocus
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Escribe tu comentario o sugerencia de diseño..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setNewCommentPos(null)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreateComment}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow"
            >
              Publicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
