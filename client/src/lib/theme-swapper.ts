import type { DesignNode, ScreenDefinition } from './types';

// Map of dark hex colors to corresponding light tones and vice versa
const DARK_TO_LIGHT_MAP: Record<string, string> = {
  '#090d16': '#f8fafc',
  '#0f172a': '#ffffff',
  '#111827': '#ffffff',
  '#1e293b': '#f1f5f9',
  '#334155': '#cbd5e1',
  '#000000': '#ffffff',
  '#ffffff': '#0f172a',
  '#94a3b8': '#475569',
  '#64748b': '#64748b',
};

const LIGHT_TO_DARK_MAP: Record<string, string> = {
  '#f8fafc': '#090d16',
  '#ffffff': '#0f172a',
  '#f1f5f9': '#1e293b',
  '#cbd5e1': '#334155',
  '#0f172a': '#ffffff',
  '#475569': '#94a3b8',
};

function invertColor(colorHex: string | undefined, targetMode: 'dark' | 'light'): string | undefined {
  if (!colorHex || typeof colorHex !== 'string') return colorHex;
  const clean = colorHex.toLowerCase().trim();

  if (targetMode === 'light') {
    if (DARK_TO_LIGHT_MAP[clean]) return DARK_TO_LIGHT_MAP[clean];
    // Generic fallback: if it's very dark, make it clean light
    if (clean.startsWith('#') && clean.length === 7) {
      const r = parseInt(clean.substring(1, 3), 16);
      const g = parseInt(clean.substring(3, 5), 16);
      const b = parseInt(clean.substring(5, 7), 16);
      if (r < 60 && g < 60 && b < 70) return '#f8fafc';
    }
  } else {
    if (LIGHT_TO_DARK_MAP[clean]) return LIGHT_TO_DARK_MAP[clean];
    if (clean.startsWith('#') && clean.length === 7) {
      const r = parseInt(clean.substring(1, 3), 16);
      const g = parseInt(clean.substring(3, 5), 16);
      const b = parseInt(clean.substring(5, 7), 16);
      if (r > 200 && g > 200 && b > 200) return '#0f172a';
    }
  }

  return colorHex;
}

function transformNodeTheme(node: DesignNode, targetMode: 'dark' | 'light'): DesignNode {
  const styles = { ...(node.styles || {}) };

  if (styles.backgroundColor) {
    styles.backgroundColor = invertColor(styles.backgroundColor, targetMode);
  }
  if (styles.color) {
    styles.color = invertColor(styles.color, targetMode);
  }
  if (styles.borderColor) {
    styles.borderColor = invertColor(styles.borderColor, targetMode);
  }

  const newChildren = node.children ? node.children.map(c => transformNodeTheme(c, targetMode)) : undefined;

  return {
    ...node,
    styles,
    children: newChildren
  };
}

export function swapScreenTheme(screen: ScreenDefinition, targetMode: 'dark' | 'light'): ScreenDefinition {
  return {
    ...screen,
    rootNode: transformNodeTheme(screen.rootNode, targetMode)
  };
}
