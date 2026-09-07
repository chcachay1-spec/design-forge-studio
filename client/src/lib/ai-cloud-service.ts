import type { AIProviderConfig, DesignNode, ProjectTheme } from './types';

export interface AIActionCommand {
  type: 'MODIFY_STYLE' | 'BIND_SOUND' | 'UPDATE_THEME' | 'ADD_NODE' | 'DELETE_NODE' | 'MESSAGE';
  nodeId?: string;
  parentId?: string;
  nodeType?: 'container' | 'button' | 'text' | 'card' | 'badge';
  name?: string;
  content?: string;
  styleKey?: string;
  value?: string;
  trigger?: 'onClick' | 'onHover';
  soundType?: 'click' | 'pop' | 'switch' | 'chime' | 'alert' | 'whoosh' | 'bell';
  message: string;
}

const SYSTEM_DESIGN_INSTRUCTIONS = `You are the DesignForge AI Design Copilot.
You modify visual designs and assign UI sound effects based on user instructions.
Analyze the provided Project Theme and Component Tree.
Respond with a helpful explanation and embed a JSON block with actions if styles or sounds need to change.

Format your design modifications strictly inside this JSON block at the end of your message:
\`\`\`json
{
  "actions": [
    { "type": "MODIFY_STYLE", "nodeId": "transfer-button", "styleKey": "backgroundColor", "value": "#10b981" },
    { "type": "MODIFY_STYLE", "nodeId": "transfer-button", "styleKey": "boxShadow", "value": "0 4px 14px rgba(16,185,129,0.4)" },
    { "type": "BIND_SOUND", "nodeId": "transfer-button", "trigger": "onClick", "soundType": "chime" }
  ]
}
\`\`\`
Valid soundTypes: click, pop, switch, chime, bell, whoosh, alert.
Always keep colors harmonious and accessible.`;

export async function queryAIProvider(
  prompt: string,
  config: AIProviderConfig,
  _nodes: DesignNode[],
  _theme: ProjectTheme,
  contextMarkdown: string
): Promise<{ text: string; actions: AIActionCommand[] }> {
  const fullSystemPrompt = SYSTEM_DESIGN_INSTRUCTIONS + '\n\n' + contextMarkdown;

  if (config.provider === 'anthropic') {
    return await callAnthropic(prompt, config, fullSystemPrompt);
  }
  if (config.provider === 'openai') {
    return await callOpenAI(prompt, config, fullSystemPrompt);
  }
  if (config.provider === 'gemini') {
    return await callGemini(prompt, config, fullSystemPrompt);
  }
  if (config.provider === 'ollama') {
    return await callOllama(prompt, config, fullSystemPrompt);
  }

  // Fallback offline mock response
  return {
    text: `[Offline Mode] Executed heuristics for: "${prompt}"`,
    actions: []
  };
}

async function callAnthropic(
  prompt: string,
  config: AIProviderConfig,
  systemPrompt: string
): Promise<{ text: string; actions: AIActionCommand[] }> {
  if (!config.apiKey) throw new Error('Anthropic API Key is required.');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic Error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const actions = extractActionsFromJson(text);
  return { text, actions };
}

async function callOpenAI(
  prompt: string,
  config: AIProviderConfig,
  systemPrompt: string
): Promise<{ text: string; actions: AIActionCommand[] }> {
  if (!config.apiKey) throw new Error('OpenAI API Key is required.');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI Error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const actions = extractActionsFromJson(text);
  return { text, actions };
}

async function callGemini(
  prompt: string,
  config: AIProviderConfig,
  systemPrompt: string
): Promise<{ text: string; actions: AIActionCommand[] }> {
  if (!config.apiKey) throw new Error('Google Gemini API Key is required.');
  const model = config.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const actions = extractActionsFromJson(text);
  return { text, actions };
}

async function callOllama(
  prompt: string,
  config: AIProviderConfig,
  systemPrompt: string
): Promise<{ text: string; actions: AIActionCommand[] }> {
  const endpoint = config.endpointUrl || 'http://localhost:11434';
  const res = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model || 'llama3',
      system: systemPrompt,
      prompt: prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama Error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.response || '';
  const actions = extractActionsFromJson(text);
  return { text, actions };
}

function extractActionsFromJson(text: string): AIActionCommand[] {
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed.actions)) {
        return parsed.actions;
      }
    }
  } catch {
    // Ignore JSON parsing errors from conversational text
  }
  return [];
}

