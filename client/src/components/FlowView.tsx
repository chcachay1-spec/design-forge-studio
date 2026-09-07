import React from 'react';
import type { ScreenDefinition, DeviceMode } from '../lib/types';
import { soundEngine } from '../lib/audio-engine';
import { ArrowRight, Eye } from 'lucide-react';

interface FlowViewProps {
  screens: ScreenDefinition[];
  activeScreenId: string;
  onSelectScreen: (id: string) => void;
  deviceMode: DeviceMode;
  onCloseFlow: () => void;
}

export const FlowView: React.FC<FlowViewProps> = ({
  screens,
  activeScreenId,
  onSelectScreen,
  deviceMode,
  onCloseFlow,
}) => {
  // Extract all navigation flows between screens
  const connections: Array<{
    fromScreenId: string;
    toScreenId: string;
    nodeName: string;
    transition?: string;
  }> = [];

  screens.forEach((screen) => {
    const scanNodes = (node: any) => {
      if (node.action && node.action.type === 'navigate' && node.action.targetScreenId) {
        connections.push({
          fromScreenId: screen.id,
          toScreenId: node.action.targetScreenId,
          nodeName: node.name || 'Botón',
          transition: node.action.transition || 'fade',
        });
      }
      if (node.children) {
        node.children.forEach(scanNodes);
      }
    };
    scanNodes(screen.rootNode);
  });

  return (
    <div className="flex-1 bg-slate-950 overflow-auto relative p-12 flex flex-col select-none">
      {/* Flow View Header Bar */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">Mapa de Flujo y Arquitectura (Flow View)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Vista panorámica de todas las ventanas y conexiones interactivas ({deviceMode.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            {screens.length} Pantallas • {connections.length} Conexiones
          </div>
          <button
            onClick={onCloseFlow}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Volver al Editor</span>
          </button>
        </div>
      </div>

      {/* Screen Cards Canvas Grid */}
      <div className="flex flex-wrap gap-12 items-start justify-start relative z-10 pb-24">
        {screens.map((screen, idx) => {
          const isActive = screen.id === activeScreenId;
          const outConnections = connections.filter(c => c.fromScreenId === screen.id);

          return (
            <div
              key={screen.id}
              onClick={() => {
                onSelectScreen(screen.id);
                soundEngine.playProceduralSound('pop');
              }}
              className={'group flex flex-col rounded-3xl p-4 transition-all duration-200 cursor-pointer border ' + (
                isActive
                  ? 'bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 shadow-xl'
              )}
              style={{ width: '320px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {screen.name}
                  </h3>
                </div>
                {isActive && (
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Activa
                  </span>
                )}
              </div>

              {/* Mini Scaled Screen Mockup */}
              <div 
                className="w-full h-96 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-inner p-3 flex flex-col gap-2 pointer-events-none"
                style={{ backgroundColor: screen.rootNode.styles.backgroundColor || '#090d16' }}
              >
                <div className="text-[11px] font-bold text-slate-300 line-clamp-1">
                  {screen.rootNode.name}
                </div>
                {screen.rootNode.children && screen.rootNode.children.slice(0, 5).map(c => (
                  <div 
                    key={c.id} 
                    className="p-2 rounded-xl text-[10px] border border-white/5 truncate font-medium"
                    style={{
                      backgroundColor: c.styles.backgroundColor || 'rgba(30, 41, 59, 0.6)',
                      color: c.styles.color || '#f8fafc',
                    }}
                  >
                    {c.name}
                    {c.content && <span className="text-slate-400 font-normal"> - {c.content}</span>}
                  </div>
                ))}
              </div>

              {/* Connections Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1.5">
                  Conexiones salientes:
                </div>
                {outConnections.length > 0 ? (
                  <div className="space-y-1">
                    {outConnections.map((conn, cIdx) => {
                      const targetScreen = screens.find(s => s.id === conn.toScreenId);
                      return (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between text-[11px] bg-slate-950/60 p-1.5 rounded-lg border border-slate-800"
                        >
                          <span className="text-slate-300 font-medium truncate max-w-[120px]">{conn.nodeName}</span>
                          <div className="flex items-center gap-1 text-indigo-400 font-mono text-[10px]">
                            <ArrowRight size={12} />
                            <span className="text-white font-semibold truncate max-w-[90px]">{targetScreen?.name || conn.toScreenId}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-600 italic">Sin navegación saliente</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
