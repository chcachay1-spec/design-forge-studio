import type { DesignNode, SkillDefinition, SkillDesignTokens, SkillReference } from './types';

// ==========================================
// 1. PRESET SKILLS DE ÉLITE (Anthropic / Claude Design Inspired)
// ==========================================
export const PRESET_SKILLS: SkillDefinition[] = [
  {
    id: 'skill-linear-dark',
    name: 'Linear Dark High-Precision',
    version: '1.2.0',
    description: 'Sistema de diseño oscuro de alta precisión con micro-bordes de 1px, acento indigo/cyan y jerarquía tipográfica nítida.',
    purpose: 'Evitar interfaces recargadas o "AI slop". Promover una arquitectura visual sobria inspirada en herramientas de desarrollo modernas como Linear, Raycast y Vercel.',
    tokens: {
      primaryColor: '#6366f1',
      secondaryColor: '#22d3ee',
      backgroundColor: '#090d16',
      cardColor: '#0f172a',
      textColor: '#f8fafc',
      mutedColor: '#94a3b8',
      borderColor: '#1e293b',
      accentGradient: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
      borderRadius: '12px',
      borderWidth: '1px',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      fontFamily: 'Inter',
      spacingDensity: 'normal',
    },
    constraints: [
      'Grilla estricta en múltiplos de 8px (padding: 16px o 24px, gap: 12px o 16px).',
      'Bordes sutiles con grosor exacto de 1px y opacidades entre 10% y 20%.',
      'Radio de esquinas equilibrado entre 10px y 14px.',
      'Contraste de texto WCAG AAA con atenuación en textos secundarios (#94a3b8).',
    ],
    antiPatterns: [
      'Prohibido el uso de sombras difusas o sucias sin oclusión ambiental.',
      'Prohibidos degradados multicolores no armónicos.',
      'Prohibidos bordes mayores a 1px salvo en badges de estado o avatares.',
    ],
    references: [
      { id: 'ref-lin-1', type: 'text', name: 'Directriz Linear', content: 'Estética de dashboard minimalista oscuro con bordes nítidos y microinteracciones.' }
    ],
    rawMarkdown: `# Skill: Linear Dark High-Precision v1.2.0
<purpose>
Diseño oscuro de alta densidad y precisión para productos SaaS avanzados.
</purpose>
<constraints>
- primaryColor: #6366f1
- backgroundColor: #090d16
- cardColor: #0f172a
- borderRadius: 12px
- borderWidth: 1px
</constraints>
<anti_patterns>
- No usar colores saturados como fondos.
- No utilizar tipografías serif en interfaces técnicas.
</anti_patterns>`,
  },
  {
    id: 'skill-stripe-horizon',
    name: 'Stripe Clean Enterprise',
    version: '1.0.0',
    description: 'Estética de pagos y fintech de clase mundial con blancos pulidos, azules confiables y esquinas suaves.',
    purpose: 'Transmitir confianza, claridad y dinamismo para plataformas de negocios y flujos transaccionales.',
    tokens: {
      primaryColor: '#0066cc',
      secondaryColor: '#635bff',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      textColor: '#0f172a',
      mutedColor: '#64748b',
      borderColor: '#e2e8f0',
      accentGradient: 'linear-gradient(135deg, #635bff 0%, #00d4ff 100%)',
      borderRadius: '16px',
      borderWidth: '1px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      fontFamily: 'system-ui',
      spacingDensity: 'relaxed',
    },
    constraints: [
      'Fondos limpios con alto valor de luminosidad (#f8fafc o #ffffff).',
      'Botones de acción principal con gradiente fluido azul/púrpura.',
      'Separación generosa entre bloques de información (gap: 20px).',
    ],
    antiPatterns: [
      'Prohibido el uso de negros puros (#000000) en textos.',
      'Prohibido el exceso de bordes duros sin sombras de soporte.',
    ],
    references: [
      { id: 'ref-str-1', type: 'text', name: 'Directriz Stripe', content: 'Tipografía clara, tarjetas con sombras tenues y sensación espaciosa.' }
    ],
    rawMarkdown: `# Skill: Stripe Clean Enterprise v1.0.0
<purpose>
Fintech y pagos modernos con alta legibilidad.
</purpose>
<constraints>
- primaryColor: #0066cc
- backgroundColor: #f8fafc
- cardColor: #ffffff
- borderRadius: 16px
</constraints>`,
  },
  {
    id: 'skill-apple-glass',
    name: 'Apple Spatial Glass',
    version: '1.1.0',
    description: 'Efecto de cristal traslúcido, desenfoque de fondo y curvaturas continuas inspiradas en visionOS e iOS.',
    purpose: 'Proporcionar una experiencia inmersiva con sensación táctil y capas superpuestas mediante blur.',
    tokens: {
      primaryColor: '#38bdf8',
      secondaryColor: '#818cf8',
      backgroundColor: '#020617',
      cardColor: 'rgba(30, 41, 59, 0.65)',
      textColor: '#f1f5f9',
      mutedColor: '#cbd5e1',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
      borderRadius: '24px',
      borderWidth: '1px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
      backdropBlur: 'blur(20px)',
      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
      spacingDensity: 'relaxed',
    },
    constraints: [
      'Uso obligatorio de backdropFilter: blur(...) en tarjetas y barras de navegación.',
      'Bordes con opacidades translúcidas del 12% al 20%.',
      'Curvatura amplia (radio 20px a 28px).',
    ],
    antiPatterns: [
      'Prohibidos fondos 100% opacos en tarjetas de contenido.',
      'Prohibidas sombras cortas o de alto contraste.',
    ],
    references: [
      { id: 'ref-app-1', type: 'text', name: 'Directriz Apple', content: 'Glassmorphism sutil, bordes suaves y sensación espacial.' }
    ],
    rawMarkdown: `# Skill: Apple Spatial Glass v1.1.0
<purpose>
Cristal traslúcido y estética aero-espacial.
</purpose>
<constraints>
- cardColor: rgba(30, 41, 59, 0.65)
- backdropBlur: blur(20px)
- borderRadius: 24px
</constraints>`,
  },
  {
    id: 'skill-emerald-fintech',
    name: 'Neo Emerald Wealth',
    version: '1.0.0',
    description: 'Tema cripto y de finanzas descentralizadas con acentos verde esmeralda y fondos grafito de alto contraste.',
    purpose: 'Destacar cifras financieras, balances y métricas con una sensación de crecimiento y tecnología.',
    tokens: {
      primaryColor: '#10b981',
      secondaryColor: '#06b6d4',
      backgroundColor: '#021e17',
      cardColor: '#053328',
      textColor: '#ecfdf5',
      mutedColor: '#6ee7b7',
      borderColor: '#064e3b',
      accentGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      borderRadius: '16px',
      borderWidth: '1px',
      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
      fontFamily: 'JetBrains Mono, monospace, sans-serif',
      spacingDensity: 'normal',
    },
    constraints: [
      'Acentos esmeralda (#10b981) para botones y estados de éxito.',
      'Textos de cifras numéricas con jerarquía destacada y monospace.',
    ],
    antiPatterns: [
      'No utilizar colores de alerta roja en elementos no críticos.',
    ],
    references: [
      { id: 'ref-fin-1', type: 'text', name: 'Directriz Fintech', content: 'Verdes prósperos, números limpios y fondos abisales.' }
    ],
    rawMarkdown: `# Skill: Neo Emerald Wealth v1.0.0
<purpose>
Interfaces financieras y criptográficas de alta gama.
</purpose>`,
  },
];

// ==========================================
// 2. EXTRACCIÓN DE PALETA DESDE IMÁGENES (HTML5 Canvas)
// ==========================================
export async function extractPaletteFromImage(imageDataUrl: string, maxColors = 6): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#6366f1', '#0f172a', '#1e293b', '#f8fafc']);
          return;
        }

        const width = 64;
        const height = 64;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height).data;
        const colorCounts: Record<string, number> = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue;

          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;

          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
        const result = sorted.slice(0, maxColors);
        resolve(result.length > 0 ? result : ['#6366f1', '#0f172a', '#1e293b']);
      } catch (err) {
        console.warn('Fallo extrayendo paleta de imagen:', err);
        resolve(['#6366f1', '#0f172a', '#1e293b']);
      }
    };
    img.onerror = () => {
      resolve(['#6366f1', '#0f172a', '#1e293b']);
    };
    img.src = imageDataUrl;
  });
}

// ==========================================
// 3. SINTETIZADOR MULTIRREFERENCIAL (Imágenes + Texto)
// ==========================================
export interface SynthesizeSkillParams {
  name: string;
  userPrompt: string;
  references: SkillReference[];
}

export function synthesizeSkillFromReferences({
  name,
  userPrompt,
  references,
}: SynthesizeSkillParams): SkillDefinition {
  const allExtractedColors = references.flatMap(r => r.extractedColors || []);
  const promptLower = userPrompt.toLowerCase();

  const isLightMode = promptLower.includes('claro') || promptLower.includes('light') || promptLower.includes('blanco') || promptLower.includes('white');

  let primaryColor = '#6366f1';
  if (promptLower.includes('verde') || promptLower.includes('green') || promptLower.includes('esmeralda') || promptLower.includes('emerald')) {
    primaryColor = '#10b981';
  } else if (promptLower.includes('cyan') || promptLower.includes('celeste') || promptLower.includes('turquesa')) {
    primaryColor = '#06b6d4';
  } else if (promptLower.includes('morado') || promptLower.includes('purple') || promptLower.includes('violet')) {
    primaryColor = '#8b5cf6';
  } else if (promptLower.includes('rosa') || promptLower.includes('pink') || promptLower.includes('fucsia')) {
    primaryColor = '#ec4899';
  } else if (promptLower.includes('ambar') || promptLower.includes('amber') || promptLower.includes('naranja') || promptLower.includes('orange') || promptLower.includes('amarillo')) {
    primaryColor = '#f59e0b';
  } else if (promptLower.includes('azul') || promptLower.includes('blue')) {
    primaryColor = '#2563eb';
  } else if (allExtractedColors.length > 0) {
    const vibrant = allExtractedColors.find(c => {
      const rgb = parseInt(c.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min) > 40;
    });
    if (vibrant) primaryColor = vibrant;
  }

  let borderRadius = '14px';
  if (promptLower.includes('pill') || promptLower.includes('redondeado') || promptLower.includes('circular') || promptLower.includes('round')) {
    borderRadius = '24px';
  } else if (promptLower.includes('sharp') || promptLower.includes('cuadrado') || promptLower.includes('recto') || promptLower.includes('brutal')) {
    borderRadius = '4px';
  } else if (promptLower.includes('sutil') || promptLower.includes('compacto')) {
    borderRadius = '8px';
  }

  let borderWidth = '1px';
  let boxShadow = isLightMode 
    ? '0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    : '0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)';
  
  if (promptLower.includes('brutalis') || promptLower.includes('borde grueso')) {
    borderWidth = '2px';
    boxShadow = '4px 4px 0px #000000';
  } else if (promptLower.includes('cristal') || promptLower.includes('glass') || promptLower.includes('blur')) {
    boxShadow = '0 20px 40px rgba(0,0,0,0.45)';
  }

  let backgroundColor = isLightMode ? '#f8fafc' : '#090d16';
  let cardColor = isLightMode ? '#ffffff' : '#0f172a';
  let textColor = isLightMode ? '#0f172a' : '#f8fafc';
  let mutedColor = isLightMode ? '#64748b' : '#94a3b8';
  let borderColor = isLightMode ? '#e2e8f0' : '#1e293b';

  const hasGlass = promptLower.includes('cristal') || promptLower.includes('glass') || promptLower.includes('vision');
  if (hasGlass) {
    cardColor = isLightMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.75)';
    borderColor = isLightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)';
  }

  const tokens: SkillDesignTokens = {
    primaryColor,
    secondaryColor: '#38bdf8',
    backgroundColor,
    cardColor,
    textColor,
    mutedColor,
    borderColor,
    accentGradient: `linear-gradient(135deg, ${primaryColor} 0%, #38bdf8 100%)`,
    borderRadius,
    borderWidth,
    boxShadow,
    backdropBlur: hasGlass ? 'blur(16px)' : undefined,
    fontFamily: promptLower.includes('mono') ? 'JetBrains Mono, monospace' : 'Inter, system-ui, sans-serif',
    spacingDensity: promptLower.includes('compacto') ? 'compact' : 'normal',
  };

  const constraints = [
    `Paleta principal basada en ${primaryColor} con fondo ${backgroundColor}.`,
    `Radio de curvatura consistente en ${borderRadius} para tarjetas y componentes interactivos.`,
    `Grosor de borde calibrado en ${borderWidth} con contraste adecuado.`,
    'Alineación y espaciados basados en la cuadrícula de 8px.',
  ];

  const antiPatterns = [
    'Evitar elementos desalineados que no respeten el espaciado de 8px.',
    'No emplear más de 2 familias tipográficas simultáneamente.',
    'No utilizar sombras sin transparencia que ensucien los fondos oscuros.',
  ];

  const skillId = `skill-custom-${Date.now().toString().slice(-4)}`;
  const skillName = name.trim() || 'Habilidad Personalizada';

  const rawMarkdown = `# Skill: ${skillName} v1.0.0
<purpose>
${userPrompt || 'Sistema de diseño sintetizado a partir de múltiples referencias visuales y directrices de diseño.'}
</purpose>

<tokens>
- primaryColor: ${tokens.primaryColor}
- secondaryColor: ${tokens.secondaryColor}
- backgroundColor: ${tokens.backgroundColor}
- cardColor: ${tokens.cardColor}
- textColor: ${tokens.textColor}
- borderColor: ${tokens.borderColor}
- borderRadius: ${tokens.borderRadius}
- borderWidth: ${tokens.borderWidth}
- boxShadow: ${tokens.boxShadow}
${tokens.backdropBlur ? `- backdropBlur: ${tokens.backdropBlur}` : ''}
</tokens>

<constraints>
${constraints.map(c => `- ${c}`).join('\n')}
</constraints>

<anti_patterns>
${antiPatterns.map(a => `- ${a}`).join('\n')}
</anti_patterns>

<references_summary>
${references.map(r => `- ${r.type.toUpperCase()}: ${r.name} ${r.extractedColors ? `(Colores: ${r.extractedColors.join(', ')})` : ''}`).join('\n')}
</references_summary>`;

  return {
    id: skillId,
    name: skillName,
    version: '1.0.0',
    description: userPrompt || 'Habilidad generada a partir de referencias visuales.',
    purpose: userPrompt || 'Dirección estética sintetizada.',
    tokens,
    constraints,
    antiPatterns,
    references,
    rawMarkdown,
    createdDate: new Date().toLocaleDateString(),
  };
}

// ==========================================
// 4. APLICADOR DE SKILL A NODOS (Smart Tree Recalibration)
// ==========================================
export function applySkillToDesignNodes(
  nodes: DesignNode[],
  skill: SkillDefinition,
  targetScope: 'all' | 'selection' | 'screen',
  selectedNodeId?: string | null
): DesignNode[] {
  const { tokens } = skill;

  const transformNode = (node: DesignNode): DesignNode => {
    const isTarget = targetScope === 'all' || targetScope === 'screen' || node.id === selectedNodeId;
    const updatedStyles = { ...node.styles };

    if (isTarget) {
      if (node.id.includes('root') || node.type === 'container') {
        if (node.id.includes('root')) {
          updatedStyles.backgroundColor = tokens.backgroundColor;
          updatedStyles.color = tokens.textColor;
        } else if (node.type === 'container' && updatedStyles.backgroundColor && updatedStyles.backgroundColor !== 'transparent') {
          updatedStyles.backgroundColor = tokens.cardColor;
          updatedStyles.borderColor = tokens.borderColor;
          updatedStyles.borderRadius = tokens.borderRadius;
        }
      }

      if (node.type === 'button' || node.type === 'fab') {
        updatedStyles.backgroundColor = tokens.primaryColor;
        updatedStyles.color = '#ffffff';
        updatedStyles.borderRadius = tokens.borderRadius;
        updatedStyles.boxShadow = tokens.boxShadow;
      }

      if (node.type === 'card' || node.type === 'navbar' || node.type === 'sidebar' || node.type === 'metric') {
        updatedStyles.backgroundColor = tokens.cardColor;
        updatedStyles.borderColor = tokens.borderColor;
        updatedStyles.borderWidth = tokens.borderWidth;
        updatedStyles.borderRadius = tokens.borderRadius;
        updatedStyles.boxShadow = tokens.boxShadow;
        if (tokens.backdropBlur) {
          updatedStyles.backdropFilter = tokens.backdropBlur;
        }
      }

      if (node.type === 'text') {
        if (node.styles.fontSize && parseInt(node.styles.fontSize) >= 18) {
          updatedStyles.color = tokens.textColor;
        } else {
          updatedStyles.color = tokens.mutedColor;
        }
        if (tokens.fontFamily) {
          updatedStyles.fontFamily = tokens.fontFamily;
        }
      }

      if (node.type === 'input' || node.type === 'textarea' || node.type === 'searchbar') {
        updatedStyles.backgroundColor = tokens.cardColor;
        updatedStyles.borderColor = tokens.borderColor;
        updatedStyles.borderRadius = tokens.borderRadius;
        updatedStyles.color = tokens.textColor;
      }

      if (node.type === 'badge') {
        updatedStyles.backgroundColor = `${tokens.primaryColor}22`;
        updatedStyles.color = tokens.primaryColor;
        updatedStyles.borderColor = `${tokens.primaryColor}55`;
        updatedStyles.borderRadius = '9999px';
      }
    }

    const transformedChildren = node.children 
      ? node.children.map(child => (targetScope === 'selection' && node.id === selectedNodeId ? child : transformNode(child)))
      : undefined;

    return {
      ...node,
      styles: updatedStyles,
      children: transformedChildren,
    };
  };

  return nodes.map(transformNode);
}
