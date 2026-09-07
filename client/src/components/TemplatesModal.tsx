import React from 'react';
import { LayoutTemplate, X, ArrowRight } from 'lucide-react';
import { TEMPLATES, type ProjectTemplate } from '../lib/templates';
import { soundEngine } from '../lib/audio-engine';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: ProjectTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-950/95 border border-slate-800/80 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Plantillas de Proyecto</h2>
              <p className="text-[11px] text-slate-400">Interfaces completas y listas para usar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-200 rounded-md hover:bg-slate-850 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEMPLATES.map(tmpl => (
            <div
              key={tmpl.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-indigo-500/60 transition-all flex flex-col justify-between group shadow"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-xl shadow">
                  {tmpl.icon}
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {tmpl.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playProceduralSound('chime');
                  onApplyTemplate(tmpl);
                  onClose();
                }}
                className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <span>Usar Plantilla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
