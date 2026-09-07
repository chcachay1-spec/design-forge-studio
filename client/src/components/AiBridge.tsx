import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Terminal, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Sparkles,
  Settings2,
  Globe,
  Loader2
} from 'lucide-react';
import type { AIProviderConfig, AIProvider, DesignNode, ProjectTheme } from '../lib/types';
import { generateMarkdownDesignContext } from '../lib/zip-handler';
import { queryAIProvider, type AIActionCommand } from '../lib/ai-cloud-service';

interface AiBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: DesignNode[];
  theme: ProjectTheme;
  onExecuteAiCommand: (command: string) => { success: boolean; message: string };
  onApplyPresetTheme: (themeName: string) => void;
  onApplyAiAction: (action: AIActionCommand) => void;
}

export const AiBridge: React.FC<AiBridgeProps> = ({
  isOpen,
  onClose,
  nodes,
  theme,
  onExecuteAiCommand,
  onApplyPresetTheme,
  onApplyAiAction,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'context'>('chat');
  const [promptInput, setPromptInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cloud AI Provider Settings
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(() => {
    const saved = localStorage.getItem('designforge_ai_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // default
      }
    }
    return {
      provider: 'offline',
      apiKey: '',
      model: 'claude-3-5-sonnet-20241022',
      endpointUrl: 'http://localhost:11434',
    };
  });

  useEffect(() => {
    localStorage.setItem('designforge_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  const [logs, setLogs] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'DesignForge Copilot ready. Switch between Offline Heuristics/MCP or connect Claude, OpenAI, Gemini, or Ollama in the Settings tab.',
      time: 'Ready',
    },
  ]);

  if (!isOpen) return null;

  const markdownContext = generateMarkdownDesignContext(nodes, theme);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;

    const userText = promptInput.trim();
    setPromptInput('');
    setLogs(prev => [...prev, { sender: 'user', text: userText, time: new Date().toLocaleTimeString() }]);

    if (aiConfig.provider === 'offline') {
      // Offline local parser
      const result = onExecuteAiCommand(userText);
      setTimeout(() => {
        setLogs(prev => [
          ...prev,
          {
            sender: 'agent',
            text: result.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }, 200);
    } else {
      // Online Cloud AI query
      setIsLoading(true);
      try {
        const response = await queryAIProvider(
          userText,
          aiConfig,
          nodes,
          theme,
          markdownContext
        );

        // Apply all actions parsed from the AI response
        if (response.actions && response.actions.length > 0) {
          response.actions.forEach(act => onApplyAiAction(act));
        }

        setLogs(prev => [
          ...prev,
          {
            sender: 'agent',
            text: response.text,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err: any) {
        setLogs(prev => [
          ...prev,
          {
            sender: 'agent',
            text: `⚠️ Cloud AI Error: ${err.message || String(err)}\nFalling back to offline heuristics.`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        const fallback = onExecuteAiCommand(userText);
        setLogs(prev => [
          ...prev,
          {
            sender: 'agent',
            text: `[Offline Fallback] ${fallback.message}`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-slate-950/95 backdrop-blur-md border-l border-slate-800/80 shadow-2xl z-40 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 text-indigo-400 border border-slate-800 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold text-white">Asistente IA</h2>
              {aiConfig.provider === 'offline' ? (
                <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-800 flex items-center gap-1">
                  OFFLINE
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-950/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono border border-emerald-500/20 flex items-center gap-1">
                  ONLINE
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/60 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold px-4 pt-2 gap-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'chat'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Chat & Prompts</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'settings'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Cloud AI Setup</span>
        </button>
        <button
          onClick={() => setActiveTab('context')}
          className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'context'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>.md Sync</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        {activeTab === 'chat' && (
          <>
            {/* Quick Style AI Presets */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>One-Click Design Transforms</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'neon-cyberpunk', label: 'Cyberpunk Neon', desc: 'Vibrant pink & cyan' },
                  { id: 'emerald-luxury', label: 'Emerald Fintech', desc: 'Rich forest & gold' },
                  { id: 'clean-slate', label: 'Clean iOS Minimal', desc: 'Slate & indigo crisp' },
                  { id: 'sunset-gradient', label: 'Sunset Amber', desc: 'Warm amber glow' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onApplyPresetTheme(preset.id)}
                    className="bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 text-left transition-colors group"
                  >
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agent Conversation</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {aiConfig.provider === 'offline' ? 'Offline Local Mode' : `${aiConfig.provider} Live`}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-64 overflow-y-auto space-y-3 font-mono text-xs">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      log.sender === 'user'
                        ? 'bg-purple-950/40 border border-purple-800/40 text-purple-200 ml-4'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 mr-2'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-indigo-400">
                        {log.sender === 'user' ? '👤 YOU' : `🤖 ${aiConfig.provider.toUpperCase()} AGENT`}
                      </span>
                      <span>{log.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{log.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-purple-400 text-xs py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI is reasoning and updating layout...</span>
                  </div>
                )}
              </div>

              {/* Prompt Input Form */}
              <form onSubmit={handleSendPrompt} className="flex gap-2">
                <input
                  type="text"
                  value={promptInput}
                  disabled={isLoading}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={
                    aiConfig.provider === 'offline'
                      ? "e.g.: 'make transfer button emerald green'..."
                      : "Ask Claude / OpenAI to refactor design & sounds..."
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>AI Provider & Connection</span>
              </h3>

              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Active AI Mode</label>
                <select
                  value={aiConfig.provider}
                  onChange={(e) => setAiConfig(c => ({ ...c, provider: e.target.value as AIProvider }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="offline">⚡ Offline (Local Heuristics + MCP)</option>
                  <option value="anthropic">🧠 Anthropic Claude (Claude 3.5 Sonnet / Haiku)</option>
                  <option value="openai">✨ OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="gemini">⚡ Google Gemini (Gemini 1.5 Flash / Pro)</option>
                  <option value="ollama">🦙 Ollama (Local LLM Server)</option>
                </select>
              </div>

              {/* API Key Field (if not offline / ollama) */}
              {aiConfig.provider !== 'offline' && aiConfig.provider !== 'ollama' && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">API Key</label>
                  <input
                    type="password"
                    value={aiConfig.apiKey || ''}
                    onChange={(e) => setAiConfig(c => ({ ...c, apiKey: e.target.value }))}
                    placeholder={`Enter ${aiConfig.provider} API Key...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    🔒 Stored exclusively in your local browser storage (never sent to third-party backends).
                  </p>
                </div>
              )}

              {/* Model Name */}
              {aiConfig.provider !== 'offline' && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Model Identifier</label>
                  <input
                    type="text"
                    value={aiConfig.model || ''}
                    onChange={(e) => setAiConfig(c => ({ ...c, model: e.target.value }))}
                    placeholder="e.g. claude-3-5-sonnet-20241022 or gpt-4o"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Ollama Endpoint URL */}
              {aiConfig.provider === 'ollama' && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Ollama Endpoint URL</label>
                  <input
                    type="text"
                    value={aiConfig.endpointUrl || ''}
                    onChange={(e) => setAiConfig(c => ({ ...c, endpointUrl: e.target.value }))}
                    placeholder="http://localhost:11434"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>.design-context.md Sync File</span>
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy MD'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              This markdown context is automatically injected to cloud models and local MCP agents.
            </p>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono overflow-x-auto max-h-80">
              {markdownContext}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};


