import type { 
  SkillDefinition, 
  SkillDesignTokens, 
  SkillReference, 
  DesignNode, 
  ScreenDefinition,
  DeviceMode 
} from './types';

// ==========================================
// 1. BIBLIOTECA DE SKILLS OFICIALES (PRESETS)
// ==========================================
export const PRESET_SKILLS: SkillDefinition[] = [
  {
    id: 'skill-linear-dark',
    name: 'Linear Dark',
    version: '1.2.0',
    description: 'Estética minimalista técnica, microbordes sutiles, fondo carbón obsidiana y acentos índigo neón para herramientas de alto rendimiento.',
    purpose: 'Estilo inspirado en Linear, Raycast y Vercel para herramientas técnicas, paneles de desarrollo y SaaS modernos.',
    tokens: {
      primaryColor: '#6366f1',
      secondaryColor: '#38bdf8',
      backgroundColor: '#08090a',
      cardColor: '#121417',
      textColor: '#f3f4f6',
      mutedColor: '#9ca3af',
      borderColor: '#22252a',
      accentGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      borderRadius: '10px',
      borderWidth: '1px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingDensity: 'compact',
    },
    constraints: [
      'Fondos oscuros profundos (#08090a a #121417) para reducir fatiga visual.',
      'Acentos de color restringidos al 10% de la superficie visual.',
      'Bordes sutiles de 1px con opacidad baja (10-15%).',
      'Tipografía monoespaciada o sans-serif neutral con alta legibilidad.',
    ],
    antiPatterns: [
      'Prohibido el uso de bordes gruesos mayores a 1px salvo focus accesible.',
      'Prohibido el uso de sombras difusas de color brillante sin máscara.',
      'Prohibido saturar tarjetas secundarias con colores primarios.',
    ],
    references: [
      { id: 'ref-lin-1', type: 'text', name: 'Directriz Linear', content: 'Dark mode sobrio, esquinas 8-10px, densidad compacta y microcontrastes.' }
    ],
    rawMarkdown: `# Skill: Linear Dark v1.2.0
<purpose>
Estilo técnico sobrio inspirado en Linear y Raycast.
</purpose>
<constraints>
- primaryColor: #6366f1
- backgroundColor: #08090a
- cardColor: #121417
- borderRadius: 10px
</constraints>`,
  },
  {
    id: 'skill-stripe-enterprise',
    name: 'Stripe Clean Enterprise',
    version: '1.0.0',
    description: 'Diseño claro ultra pulido con tipografía nítida, elevación suave, bordes definidos y acentos púrpura vibrante.',
    purpose: 'Ideal para pasarelas de pago, paneles bancarios, checkout y aplicaciones B2B de confianza.',
    tokens: {
      primaryColor: '#635bff',
      secondaryColor: '#00d4aa',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      textColor: '#0a2540',
      mutedColor: '#425466',
      borderColor: '#e3e8ee',
      accentGradient: 'linear-gradient(135deg, #635bff 0%, #00d4aa 100%)',
      borderRadius: '12px',
      borderWidth: '1px',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingDensity: 'normal',
    },
    constraints: [
      'Contraste estricto WCAG AAA en textos oscuros sobre fondo blanco.',
      'Bordes nítidos y sombras multicapa suaves.',
      'Uso de degradados diagonales para banners o tarjetas bancarias.',
    ],
    antiPatterns: [
      'No emplear fondos oscuros en tarjetas principales.',
      'No usar fuentes display de fantasía que afecten la legibilidad de transacciones.',
    ],
    references: [
      { id: 'ref-str-1', type: 'text', name: 'Directriz Stripe', content: 'Fondos claros inmaculados, botones morados (#635bff) y sombras suaves.' }
    ],
    rawMarkdown: `# Skill: Stripe Clean Enterprise v1.0.0
<purpose>
Fintech y pagos modernos con alta legibilidad.
</purpose>
<constraints>
- primaryColor: #635bff
- backgroundColor: #f8fafc
- cardColor: #ffffff
- borderRadius: 12px
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
// 2. ANÁLISIS CROMÁTICO & EXTRACCIÓN DE ALTA FIDELIDAD
// ==========================================
export interface ExtractedImageAnalysis {
  palette: string[];
  backgroundColor: string;
  cardColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  isLightMode: boolean;
  aspectRatio: number;
  detectedFormat: 'mobile' | 'tablet' | 'desktop';
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min;
}

export async function extractRichPaletteFromImage(imageDataUrl: string): Promise<ExtractedImageAnalysis> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const natWidth = img.naturalWidth || 400;
        const natHeight = img.naturalHeight || 800;
        const aspectRatio = natWidth / natHeight;
        
        let detectedFormat: 'mobile' | 'tablet' | 'desktop' = 'mobile';
        if (aspectRatio >= 1.2) detectedFormat = 'desktop';
        else if (aspectRatio >= 0.8) detectedFormat = 'tablet';

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getFallbackAnalysis(detectedFormat, aspectRatio));
          return;
        }

        const sampleSize = 80;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        const colorCounts: Record<string, { r: number; g: number; b: number; count: number }> = {};
        const perimeterColors: Array<{ r: number; g: number; b: number }> = [];

        let totalLum = 0;
        let pixelCount = 0;

        for (let y = 0; y < sampleSize; y += 2) {
          for (let x = 0; x < sampleSize; x += 2) {
            const idx = (y * sampleSize + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3];

            if (a < 120) continue;

            const lum = getLuminance(r, g, b);
            totalLum += lum;
            pixelCount++;

            // Sample borders to find the true screen background
            if (x <= 4 || x >= sampleSize - 4 || y <= 4 || y >= sampleSize - 4) {
              perimeterColors.push({ r, g, b });
            }

            const qr = Math.round(r / 16) * 16;
            const qg = Math.round(g / 16) * 16;
            const qb = Math.round(b / 16) * 16;
            const hex = rgbToHex(qr, qg, qb);

            if (!colorCounts[hex]) {
              colorCounts[hex] = { r: qr, g: qg, b: qb, count: 0 };
            }
            colorCounts[hex].count++;
          }
        }

        const avgLum = pixelCount > 0 ? totalLum / pixelCount : 40;
        const isLightMode = avgLum > 130;

        // Background color detection from perimeter
        let backgroundColor = isLightMode ? '#f8fafc' : '#090d16';
        if (perimeterColors.length > 0) {
          let prSum = 0, pgSum = 0, pbSum = 0;
          perimeterColors.forEach(p => { prSum += p.r; pgSum += p.g; pbSum += p.b; });
          const pr = prSum / perimeterColors.length;
          const pg = pgSum / perimeterColors.length;
          const pb = pbSum / perimeterColors.length;
          backgroundColor = rgbToHex(pr, pg, pb);
        }

        const sortedColors = Object.values(colorCounts).sort((a, b) => b.count - a.count);
        const palette = sortedColors.slice(0, 8).map(c => rgbToHex(c.r, c.g, c.b));

        // Find vibrant brand accent
        let primaryColor = isLightMode ? '#635bff' : '#6366f1';
        let secondaryColor = '#38bdf8';

        const vibrantCandidates = sortedColors
          .filter(c => {
            const sat = getSaturation(c.r, c.g, c.b);
            const lum = getLuminance(c.r, c.g, c.b);
            return sat > 38 && lum > 40 && lum < 225;
          })
          .sort((a, b) => getSaturation(b.r, b.g, b.b) - getSaturation(a.r, a.g, a.b));

        if (vibrantCandidates.length > 0) {
          primaryColor = rgbToHex(vibrantCandidates[0].r, vibrantCandidates[0].g, vibrantCandidates[0].b);
        }
        if (vibrantCandidates.length > 1) {
          secondaryColor = rgbToHex(vibrantCandidates[1].r, vibrantCandidates[1].g, vibrantCandidates[1].b);
        }

        let cardColor: string;
        let textColor: string;
        let mutedColor: string;
        let borderColor: string;

        if (isLightMode) {
          cardColor = '#ffffff';
          textColor = '#0f172a';
          mutedColor = '#64748b';
          borderColor = '#e2e8f0';
        } else {
          cardColor = '#131b2e';
          textColor = '#f8fafc';
          mutedColor = '#94a3b8';
          borderColor = 'rgba(255, 255, 255, 0.12)';
        }

        resolve({
          palette,
          backgroundColor,
          cardColor,
          primaryColor,
          secondaryColor,
          textColor,
          mutedColor,
          borderColor,
          isLightMode,
          aspectRatio,
          detectedFormat,
        });
      } catch (err) {
        console.warn('Error en análisis cromático enriquecido:', err);
        resolve(getFallbackAnalysis());
      }
    };
    img.onerror = () => resolve(getFallbackAnalysis());
    img.src = imageDataUrl;
  });
}

function getFallbackAnalysis(
  detectedFormat: 'mobile' | 'tablet' | 'desktop' = 'mobile', 
  aspectRatio = 0.5
): ExtractedImageAnalysis {
  return {
    palette: ['#6366f1', '#090d16', '#131b2e', '#f8fafc', '#38bdf8'],
    backgroundColor: '#090d16',
    cardColor: '#131b2e',
    primaryColor: '#6366f1',
    secondaryColor: '#38bdf8',
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    isLightMode: false,
    aspectRatio,
    detectedFormat,
  };
}

export async function extractPaletteFromImage(imageDataUrl: string, maxColors = 6): Promise<string[]> {
  const analysis = await extractRichPaletteFromImage(imageDataUrl);
  return analysis.palette.slice(0, maxColors);
}

// ==========================================
// 3. SINTETIZADOR MULTIRREFERENCIAL
// ==========================================
export interface SynthesizeSkillParams {
  name: string;
  userPrompt: string;
  references: SkillReference[];
  analysisList?: ExtractedImageAnalysis[];
}

export function synthesizeSkillFromReferences({
  name,
  userPrompt,
  references,
  analysisList,
}: SynthesizeSkillParams): SkillDefinition {
  const promptLower = userPrompt.toLowerCase();
  const allExtractedColors = references.flatMap(r => r.extractedColors || []);
  const primaryAnalysis = analysisList && analysisList.length > 0 ? analysisList[0] : null;

  const promptExplicitLight = promptLower.includes('claro') || promptLower.includes('light') || promptLower.includes('blanco') || promptLower.includes('white');
  const promptExplicitDark = promptLower.includes('oscuro') || promptLower.includes('dark') || promptLower.includes('negro') || promptLower.includes('black');
  
  let isLightMode = false;
  if (promptExplicitLight) isLightMode = true;
  else if (promptExplicitDark) isLightMode = false;
  else if (primaryAnalysis) isLightMode = primaryAnalysis.isLightMode;

  let primaryColor = primaryAnalysis?.primaryColor || '#6366f1';
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
  } else if (allExtractedColors.length > 0 && !primaryAnalysis) {
    primaryColor = allExtractedColors[0];
  }

  let backgroundColor = isLightMode 
    ? (primaryAnalysis?.isLightMode ? primaryAnalysis.backgroundColor : '#f8fafc')
    : (primaryAnalysis && !primaryAnalysis.isLightMode ? primaryAnalysis.backgroundColor : '#090d16');

  let cardColor = isLightMode
    ? (primaryAnalysis?.isLightMode ? primaryAnalysis.cardColor : '#ffffff')
    : (primaryAnalysis && !primaryAnalysis.isLightMode ? primaryAnalysis.cardColor : '#121826');

  let textColor = isLightMode ? '#0f172a' : '#f8fafc';
  let mutedColor = isLightMode ? '#64748b' : '#94a3b8';
  let borderColor = isLightMode ? '#e2e8f0' : 'rgba(255, 255, 255, 0.12)';

  const hasGlass = promptLower.includes('cristal') || promptLower.includes('glass') || promptLower.includes('vision');
  if (hasGlass) {
    cardColor = isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 24, 38, 0.75)';
    borderColor = isLightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)';
  }

  let borderRadius = '14px';
  if (promptLower.includes('pill') || promptLower.includes('redondeado') || promptLower.includes('circular') || promptLower.includes('round') || hasGlass) {
    borderRadius = '24px';
  } else if (promptLower.includes('sharp') || promptLower.includes('cuadrado') || promptLower.includes('recto') || promptLower.includes('brutal')) {
    borderRadius = '4px';
  } else if (promptLower.includes('sutil') || promptLower.includes('compacto')) {
    borderRadius = '8px';
  }

  let borderWidth = '1px';
  let boxShadow = isLightMode 
    ? '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    : '0 15px 35px -5px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)';
  
  if (promptLower.includes('brutalis') || promptLower.includes('borde grueso')) {
    borderWidth = '2px';
    boxShadow = '4px 4px 0px #000000';
  }

  const tokens: SkillDesignTokens = {
    primaryColor,
    secondaryColor: primaryAnalysis?.secondaryColor || '#38bdf8',
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
    `Fondo maestro calibrado en ${backgroundColor} con superficie de tarjetas ${cardColor}.`,
    `Acento de marca primario ${primaryColor} con radio de esquinas ${borderRadius}.`,
    `Grosor de borde ${borderWidth} con contraste calculado para modo ${isLightMode ? 'claro' : 'oscuro'}.`,
    'Alineación y espaciados basados en la cuadrícula de 8px.',
  ];

  const antiPatterns = [
    'No mezclar esquinas cuadradas y redondeadas sin coherencia jerárquica.',
    'No utilizar texto de bajo contraste que viole las normas de accesibilidad.',
    'Evitar degradados ruidosos que ensucien el fondo del lienzo.',
  ];

  const skillId = `skill-custom-${Date.now().toString().slice(-4)}`;
  const skillName = name.trim() || 'Habilidad Personalizada';

  const rawMarkdown = `# Skill: ${skillName} v1.0.0
<purpose>
${userPrompt || 'Sistema de diseño sintetizado a partir de referencias visuales y directrices de diseño.'}
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
${references.map(r => `- ${r.type.toUpperCase()}: ${r.name}`).join('\n')}
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
// 4. TIPOS DE ESTILOS VISUALES EXPANDIDOS
// ==========================================
export type BackgroundStyle = 'aurora' | 'glass' | 'tech_grid' | 'editorial' | 'solid';
export type ButtonShape = 'pill' | 'squircle' | 'sharp' | 'glow' | 'glass';
export type MenuStyle = 'floating_dock' | 'classic_topbar' | 'bottom_tabbar' | 'sidebar';

export interface GenerateScreenParams {
  skill: SkillDefinition;
  prompt: string;
  screenName?: string;
  deviceMode: DeviceMode;
  backgroundStyle?: BackgroundStyle;
  buttonShape?: ButtonShape;
  menuStyle?: MenuStyle;
  useUploadedImages?: boolean;
}

// ==========================================
// 5. GENERADOR DE PANTALLA Y LAYOUT COMPLETO
// ==========================================
export function generateScreenFromSkillAndPrompt({
  skill,
  prompt,
  screenName,
  deviceMode,
  backgroundStyle = 'aurora',
  buttonShape = 'squircle',
  menuStyle = 'floating_dock',
  useUploadedImages = true,
}: GenerateScreenParams): ScreenDefinition {
  const { tokens } = skill;
  const promptLower = prompt.toLowerCase();
  const screenId = `screen-skill-${Date.now()}`;
  const title = screenName?.trim() || 'Diseño Sintetizado';

  // Extract reference images if available
  const refImages = skill.references
    .filter(r => r.type === 'image' && r.content && r.content.startsWith('data:image'))
    .map(r => r.content);

  const heroImage = (useUploadedImages && refImages.length > 0) ? refImages[0] : null;
  const secondaryImage = (useUploadedImages && refImages.length > 1) ? refImages[1] : heroImage;

  // Identify Archetype
  let archetype: 'fintech' | 'saas' | 'ecommerce' | 'social' | 'auth' | 'general' = 'general';
  if (promptLower.includes('fintech') || promptLower.includes('crypto') || promptLower.includes('cripto') || promptLower.includes('wallet') || promptLower.includes('billetera') || promptLower.includes('balance') || promptLower.includes('dinero') || promptLower.includes('pago')) {
    archetype = 'fintech';
  } else if (promptLower.includes('dashboard') || promptLower.includes('saas') || promptLower.includes('admin') || promptLower.includes('metric') || promptLower.includes('analítica') || promptLower.includes('kpi')) {
    archetype = 'saas';
  } else if (promptLower.includes('tienda') || promptLower.includes('ecommerce') || promptLower.includes('compras') || promptLower.includes('producto') || promptLower.includes('carrito') || promptLower.includes('store')) {
    archetype = 'ecommerce';
  } else if (promptLower.includes('perfil') || promptLower.includes('social') || promptLower.includes('amigos') || promptLower.includes('feed') || promptLower.includes('chat') || promptLower.includes('avatar')) {
    archetype = 'social';
  } else if (promptLower.includes('login') || promptLower.includes('registro') || promptLower.includes('auth') || promptLower.includes('contraseña') || promptLower.includes('onboarding')) {
    archetype = 'auth';
  }

  const rootChildren: DesignNode[] = [];
  const isDesktop = deviceMode === 'desktop';
  const isTablet = deviceMode === 'tablet';

  // 1. Navigation / Menu rendering according to menuStyle
  rootChildren.push(buildNavigationNode(title, menuStyle, isDesktop, tokens, buttonShape, heroImage));

  // ----------------------------------------------------
  // ARCHETYPE 1: FINTECH / CRIPTO / BILLETERA
  // ----------------------------------------------------
  if (archetype === 'fintech') {
    if (isDesktop) {
      rootChildren.push({
        id: `metrics-row-${Date.now()}`,
        name: 'Fila de Métricas Financieras',
        type: 'container',
        styles: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        },
        children: [
          buildMetricCard('Balance Total en Cuenta', '$48,250.00 USD', '+14.8% este mes', tokens),
          buildMetricCard('Rendimiento Portafolio', '+$6,420.50', '24h récord', tokens),
          buildMetricCard('Ahorros en Bóveda', '$12,000.00', 'APY 5.2%', tokens),
        ]
      });

      rootChildren.push({
        id: `main-content-grid-${Date.now()}`,
        name: 'Panel Principal de Finanzas',
        type: 'container',
        styles: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
        },
        children: [
          {
            id: `chart-card-${Date.now()}`,
            name: 'Ventana de Crecimiento & Gráfico',
            type: 'card',
            styles: buildCardStyle(tokens),
            children: [
              {
                id: `chart-header-${Date.now()}`,
                name: 'Cabecera de Rendimiento',
                type: 'container',
                styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' },
                children: [
                  { id: `c-title-${Date.now()}`, name: 'Título', type: 'text', content: 'Historial de Rendimiento de Activos', styles: { fontSize: '16px', fontWeight: 'bold', color: tokens.textColor } },
                  { id: `c-badge-${Date.now()}`, name: 'Badge', type: 'badge', content: 'En Vivo 🟢', styles: buildBadgeStyle(tokens) },
                ]
              },
              heroImage ? {
                id: `chart-img-${Date.now()}`,
                name: 'Imagen de Referencia / Gráfico',
                type: 'image',
                imageUrl: heroImage,
                styles: { width: '100%', height: '160px', borderRadius: tokens.borderRadius, marginBottom: '14px', objectFit: 'cover' }
              } : {
                id: `chart-metric-${Date.now()}`,
                name: 'Valor Numérico',
                type: 'metric',
                content: '$1,248.50',
                secondaryContent: 'Volumen diario estimado',
                styles: { fontSize: '28px', fontWeight: 'bold', color: tokens.textColor, marginBottom: '16px' }
              },
              {
                id: `chart-actions-${Date.now()}`,
                name: 'Acciones de Operación',
                type: 'container',
                styles: { display: 'flex', gap: '10px', width: '100%' },
                children: [
                  buildCustomButton('Comprar Activo +', tokens, buttonShape, true),
                  buildCustomButton('Transferir Fondos', tokens, buttonShape, false),
                ]
              }
            ]
          },
          {
            id: `side-panel-${Date.now()}`,
            name: 'Panel Lateral de Transferencia Rápida',
            type: 'card',
            styles: buildCardStyle(tokens),
            children: [
              { id: `sp-title-${Date.now()}`, name: 'Título', type: 'text', content: 'Envío Instantáneo', styles: { fontSize: '15px', fontWeight: 'bold', color: tokens.textColor, marginBottom: '12px' } },
              { id: `sp-input1-${Date.now()}`, name: 'Input Destinatario', type: 'input', placeholder: 'Dirección de billetera o email...', styles: buildInputStyle(tokens) },
              { id: `sp-input2-${Date.now()}`, name: 'Input Monto', type: 'input', placeholder: 'Monto en USD ($0.00)', styles: buildInputStyle(tokens) },
              buildCustomButton('Confirmar Envío Inmediato →', tokens, buttonShape, true),
            ]
          }
        ]
      });
    } else {
      // Mobile Hero Card with optional image texture/background
      rootChildren.push({
        id: `hero-balance-${Date.now()}`,
        name: 'Tarjeta de Balance Maestro',
        type: 'card',
        styles: {
          ...buildCardStyle(tokens),
          background: tokens.accentGradient || tokens.cardColor,
          color: '#ffffff',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          heroImage ? {
            id: `hb-cover-${Date.now()}`,
            name: 'Textura de Fondo Visual',
            type: 'image',
            imageUrl: heroImage,
            styles: {
              width: '100%',
              height: '80px',
              borderRadius: tokens.borderRadius,
              objectFit: 'cover',
              opacity: '0.6',
              marginBottom: '6px',
            }
          } : null,
          { id: `hb-sub-${Date.now()}`, name: 'Etiqueta', type: 'text', content: 'Balance Total Disponible', styles: { fontSize: '12px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' } },
          { id: `hb-num-${Date.now()}`, name: 'Cifra Balance', type: 'metric', content: '$28,450.00', secondaryContent: '+$2,150.00 (7.4%)', styles: { fontSize: '32px', fontWeight: 'bold', color: '#ffffff' } },
          {
            id: `hb-actions-${Date.now()}`,
            name: 'Fila de Botones de Acción',
            type: 'container',
            styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' },
            children: [
              buildCustomButton('Enviar ↗', tokens, buttonShape, true),
              buildCustomButton('Recibir ↙', tokens, buttonShape, false),
              buildCustomButton('Canjear ⇄', tokens, buttonShape, false),
            ]
          }
        ].filter(Boolean) as DesignNode[]
      });

      rootChildren.push({
        id: `assets-card-${Date.now()}`,
        name: 'Portafolio de Activos Destacados',
        type: 'card',
        styles: buildCardStyle(tokens),
        children: [
          { id: `as-title-${Date.now()}`, name: 'Título', type: 'text', content: 'Criptomonedas y Acciones', styles: { fontSize: '15px', fontWeight: 'bold', color: tokens.textColor, marginBottom: '12px' } },
          buildListItem('Bitcoin (BTC)', '$67,420.00', '+3.2%', tokens),
          buildListItem('Ethereum (ETH)', '$3,580.00', '+1.8%', tokens),
          buildListItem('Solana (SOL)', '$142.50', '+8.4%', tokens),
        ]
      });

      // Mobile Bottom Tabbar
      if (menuStyle === 'bottom_tabbar') {
        rootChildren.push(buildBottomTabbarNode(tokens, buttonShape));
      }
    }
  }

  // ----------------------------------------------------
  // ARCHETYPE 2: SAAS / DASHBOARD DE ANALÍTICAS
  // ----------------------------------------------------
  else if (archetype === 'saas') {
    rootChildren.push({
      id: `saas-kpi-row-${Date.now()}`,
      name: 'Métricas KPI de Alto Rendimiento',
      type: 'container',
      styles: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        gap: '14px',
      },
      children: [
        buildMetricCard('MRR Recurrente', '$124,500', '+12.4% MoM', tokens),
        buildMetricCard('Usuarios Activos', '18,420', '+850 esta semana', tokens),
        buildMetricCard('Tasa de Conversión', '4.85%', '+0.6% vs avg', tokens),
        buildMetricCard('Churn Rate', '0.8%', '-0.2% reducción', tokens),
      ]
    });

    rootChildren.push({
      id: `saas-main-card-${Date.now()}`,
      name: 'Ventana de Rendimiento General',
      type: 'card',
      styles: buildCardStyle(tokens),
      children: [
        {
          id: `saas-card-hdr-${Date.now()}`,
          name: 'Encabezado de Ventana',
          type: 'container',
          styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '14px' },
          children: [
            { id: `saas-th-${Date.now()}`, name: 'Título', type: 'text', content: 'Actividad Reciente del Sistema', styles: { fontSize: '16px', fontWeight: 'bold', color: tokens.textColor } },
            buildCustomButton('+ Generar Reporte', tokens, buttonShape, true),
          ]
        },
        heroImage ? {
          id: `saas-banner-img-${Date.now()}`,
          name: 'Banner Visual Analítico',
          type: 'image',
          imageUrl: heroImage,
          styles: { width: '100%', height: '180px', borderRadius: tokens.borderRadius, marginBottom: '16px', objectFit: 'cover' }
        } : null,
        buildListItem('Usuario Pro registrado: @alex_founder', 'Plan Enterprise', 'Hace 2 min', tokens),
        buildListItem('Pago procesado con éxito: $299.00', 'Stripe Connect', 'Hace 14 min', tokens),
        buildListItem('Nuevo despliegue en producción v2.4.0', '100% verificado', 'Hace 1 hora', tokens),
      ].filter(Boolean) as DesignNode[]
    });

    if (!isDesktop && menuStyle === 'bottom_tabbar') {
      rootChildren.push(buildBottomTabbarNode(tokens, buttonShape));
    }
  }

  // ----------------------------------------------------
  // ARCHETYPE 3: E-COMMERCE / TIENDA
  // ----------------------------------------------------
  else if (archetype === 'ecommerce') {
    rootChildren.push({
      id: `ecom-search-row-${Date.now()}`,
      name: 'Buscador y Filtros',
      type: 'container',
      styles: { width: '100%', display: 'flex', gap: '10px' },
      children: [
        { id: `ecom-search-${Date.now()}`, name: 'Barra de Búsqueda', type: 'searchbar', placeholder: 'Buscar productos, marcas y ofertas...', styles: { ...buildInputStyle(tokens), flex: '1' } },
        buildCustomButton('Filtrar 🔍', tokens, buttonShape, false),
      ]
    });

    // Promo banner with injected user image
    rootChildren.push({
      id: `ecom-promo-banner-${Date.now()}`,
      name: 'Banner Promocional Destacado',
      type: 'card',
      styles: {
        ...buildCardStyle(tokens),
        background: tokens.accentGradient || tokens.primaryColor,
        color: '#ffffff',
        padding: '24px',
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        alignItems: 'center',
        gap: '20px',
      },
      children: [
        heroImage ? {
          id: `ecom-hero-img-${Date.now()}`,
          name: 'Imagen Principal de Oferta',
          type: 'image',
          imageUrl: heroImage,
          styles: { width: isDesktop ? '260px' : '100%', height: '160px', borderRadius: tokens.borderRadius, objectFit: 'cover' }
        } : null,
        {
          id: `ecom-banner-text-${Date.now()}`,
          name: 'Textos de Promoción',
          type: 'container',
          styles: { display: 'flex', flexDirection: 'column', gap: '8px', flex: '1' },
          children: [
            { id: `ep-b-${Date.now()}`, name: 'Badge', type: 'badge', content: 'OFERTA DE TEMPORADA ⚡', styles: { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', alignSelf: 'flex-start', fontSize: '11px', fontWeight: 'bold' } },
            { id: `ep-title-${Date.now()}`, name: 'Título Banner', type: 'text', content: 'Hasta 40% de Descuento en Colección Pro', styles: { fontSize: '22px', fontWeight: 'bold', color: '#ffffff' } },
            { id: `ep-desc-${Date.now()}`, name: 'Descripción', type: 'text', content: 'Diseño exclusivo, acabados de alta gama y envío express gratuito.', styles: { fontSize: '13px', color: 'rgba(255,255,255,0.9)' } },
            buildCustomButton('Explorar Ofertas Ahora →', tokens, buttonShape, true),
          ]
        }
      ].filter(Boolean) as DesignNode[]
    });

    rootChildren.push({
      id: `ecom-products-grid-${Date.now()}`,
      name: 'Cuadrícula de Productos',
      type: 'container',
      styles: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
        gap: '16px',
      },
      children: [
        buildProductCard('Sneakers Cyber Edition', '$189.00 USD', '★ 4.9 (124 reseñas)', tokens, buttonShape, secondaryImage),
        buildProductCard('Smartwatch Titanium X', '$320.00 USD', '★ 5.0 (89 reseñas)', tokens, buttonShape, heroImage),
        buildProductCard('Mochila Impermeable Modular', '$95.00 USD', '★ 4.8 (210 reseñas)', tokens, buttonShape, secondaryImage),
      ]
    });

    if (!isDesktop && menuStyle === 'bottom_tabbar') {
      rootChildren.push(buildBottomTabbarNode(tokens, buttonShape));
    }
  }

  // ----------------------------------------------------
  // ARCHETYPE 4: SOCIAL / PERFIL
  // ----------------------------------------------------
  else if (archetype === 'social') {
    rootChildren.push({
      id: `social-profile-card-${Date.now()}`,
      name: 'Ventana de Perfil de Usuario',
      type: 'card',
      styles: buildCardStyle(tokens),
      children: [
        heroImage ? {
          id: `sp-banner-${Date.now()}`,
          name: 'Foto de Portada de Perfil',
          type: 'image',
          imageUrl: heroImage,
          styles: { width: '100%', height: '130px', borderRadius: tokens.borderRadius, objectFit: 'cover', marginBottom: '14px' }
        } : null,
        {
          id: `sp-hdr-${Date.now()}`,
          name: 'Avatar y Nombre',
          type: 'container',
          styles: { display: 'flex', alignItems: 'center', gap: '14px', width: '100%' },
          children: [
            secondaryImage ? {
              id: `avatar-img-${Date.now()}`,
              name: 'Foto de Avatar',
              type: 'image',
              imageUrl: secondaryImage,
              styles: { width: '56px', height: '56px', borderRadius: '9999px', objectFit: 'cover', border: `2px solid ${tokens.primaryColor}` }
            } : {
              id: `avatar-${Date.now()}`,
              name: 'Avatar',
              type: 'avatar',
              content: 'CR',
              styles: { width: '56px', height: '56px', borderRadius: '9999px', backgroundColor: tokens.primaryColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }
            },
            {
              id: `sp-meta-${Date.now()}`,
              name: 'Meta Información',
              type: 'container',
              styles: { display: 'flex', flexDirection: 'column', gap: '2px' },
              children: [
                { id: `sp-n-${Date.now()}`, name: 'Nombre', type: 'text', content: 'Carlos Rodriguez', styles: { fontSize: '18px', fontWeight: 'bold', color: tokens.textColor } },
                { id: `sp-u-${Date.now()}`, name: 'Usuario', type: 'text', content: '@carlos_design • Lead UI Designer', styles: { fontSize: '12px', color: tokens.mutedColor } },
              ]
            }
          ]
        },
        {
          id: `sp-stats-${Date.now()}`,
          name: 'Estadísticas Sociales',
          type: 'container',
          styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${tokens.borderColor}` },
          children: [
            { id: `st-1-${Date.now()}`, name: 'Seguidores', type: 'metric', content: '14.2k', secondaryContent: 'Seguidores', styles: { fontSize: '18px', fontWeight: 'bold', color: tokens.textColor } },
            { id: `st-2-${Date.now()}`, name: 'Siguiendo', type: 'metric', content: '480', secondaryContent: 'Siguiendo', styles: { fontSize: '18px', fontWeight: 'bold', color: tokens.textColor } },
            { id: `st-3-${Date.now()}`, name: 'Proyectos', type: 'metric', content: '36', secondaryContent: 'Diseños', styles: { fontSize: '18px', fontWeight: 'bold', color: tokens.textColor } },
          ]
        },
        {
          id: `sp-btn-row-${Date.now()}`,
          name: 'Botones de Perfil',
          type: 'container',
          styles: { display: 'flex', gap: '10px', marginTop: '14px', width: '100%' },
          children: [
            buildCustomButton('Seguir Perfil +', tokens, buttonShape, true),
            buildCustomButton('Enviar Mensaje', tokens, buttonShape, false),
          ]
        }
      ].filter(Boolean) as DesignNode[]
    });

    if (!isDesktop && menuStyle === 'bottom_tabbar') {
      rootChildren.push(buildBottomTabbarNode(tokens, buttonShape));
    }
  }

  // ----------------------------------------------------
  // ARCHETYPE 5: AUTENTICACIÓN / LOGIN
  // ----------------------------------------------------
  else if (archetype === 'auth') {
    rootChildren.push({
      id: `auth-wrapper-${Date.now()}`,
      name: 'Ventana de Autenticación',
      type: 'card',
      styles: {
        ...buildCardStyle(tokens),
        maxWidth: isDesktop ? '460px' : '100%',
        margin: '20px auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      },
      children: [
        heroImage ? {
          id: `auth-logo-${Date.now()}`,
          name: 'Isotipo Visual de Acceso',
          type: 'image',
          imageUrl: heroImage,
          styles: { width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', margin: '0 auto', boxShadow: tokens.boxShadow }
        } : null,
        { id: `auth-badge-${Date.now()}`, name: 'Badge', type: 'badge', content: 'Acceso Seguro 🔒', styles: buildBadgeStyle(tokens) },
        { id: `auth-title-${Date.now()}`, name: 'Título Principal', type: 'text', content: 'Bienvenido de Nuevo', styles: { fontSize: '24px', fontWeight: 'bold', color: tokens.textColor } },
        { id: `auth-sub-${Date.now()}`, name: 'Subtítulo', type: 'text', content: 'Ingresa tus credenciales para acceder a tu espacio de trabajo.', styles: { fontSize: '13px', color: tokens.mutedColor } },
        { id: `auth-in-email-${Date.now()}`, name: 'Input Correo', type: 'input', placeholder: 'nombre@empresa.com', styles: buildInputStyle(tokens) },
        { id: `auth-in-pwd-${Date.now()}`, name: 'Input Contraseña', type: 'input', placeholder: '••••••••••••', styles: buildInputStyle(tokens) },
        buildCustomButton('Iniciar Sesión Ahora →', tokens, buttonShape, true),
        buildCustomButton('Continuar con Google', tokens, buttonShape, false),
      ].filter(Boolean) as DesignNode[]
    });
  }

  // ----------------------------------------------------
  // ARCHETYPE 6: GENERAL / MULTIPROPÓSITO
  // ----------------------------------------------------
  else {
    rootChildren.push({
      id: `gen-hero-card-${Date.now()}`,
      name: 'Ventana Principal de Módulo',
      type: 'card',
      styles: buildCardStyle(tokens),
      children: [
        heroImage ? {
          id: `gen-img-${Date.now()}`,
          name: 'Imagen Principal',
          type: 'image',
          imageUrl: heroImage,
          styles: { width: '100%', height: isDesktop ? '220px' : '150px', borderRadius: tokens.borderRadius, objectFit: 'cover', marginBottom: '14px' }
        } : null,
        { id: `gh-sub-${Date.now()}`, name: 'Etiqueta', type: 'text', content: 'Directriz Activa', styles: { fontSize: '11px', color: tokens.primaryColor, fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: `gh-title-${Date.now()}`, name: 'Título Hero', type: 'text', content: prompt.slice(0, 75) || title, styles: { fontSize: '20px', fontWeight: 'bold', color: tokens.textColor, marginTop: '4px' } },
        { id: `gh-desc-${Date.now()}`, name: 'Descripción', type: 'text', content: 'Diseño sintetizado con coherencia estética, contraste calibrado y paleta extraída.', styles: { fontSize: '13px', color: tokens.mutedColor, marginTop: '4px' } },
        {
          id: `gh-btn-row-${Date.now()}`,
          name: 'Fila de Acciones',
          type: 'container',
          styles: { display: 'flex', gap: '10px', marginTop: '16px' },
          children: [
            buildCustomButton('Comenzar Flujo →', tokens, buttonShape, true),
            buildCustomButton('Ver Detalles', tokens, buttonShape, false),
          ]
        }
      ].filter(Boolean) as DesignNode[]
    });

    rootChildren.push({
      id: `gen-grid-${Date.now()}`,
      name: 'Cuadrícula de Contenido Secundario',
      type: 'container',
      styles: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
        gap: '14px',
      },
      children: [
        buildMetricCard('Métrica de Desempeño', '98.4%', 'Excelente', tokens),
        buildMetricCard('Operaciones Hoy', '1,420', 'Sin incidentes', tokens),
        buildMetricCard('Eficiencia de Red', '12ms', 'Latencia ultra baja', tokens),
      ]
    });

    if (!isDesktop && menuStyle === 'bottom_tabbar') {
      rootChildren.push(buildBottomTabbarNode(tokens, buttonShape));
    }
  }

  // Determine Root Background Style
  let rootBgGradient: string | undefined = undefined;
  let rootBgColor = tokens.backgroundColor;

  if (backgroundStyle === 'aurora') {
    rootBgGradient = `radial-gradient(at 15% 15%, ${tokens.primaryColor}30 0px, transparent 55%), radial-gradient(at 85% 85%, ${tokens.secondaryColor}25 0px, transparent 55%), ${tokens.backgroundColor}`;
  } else if (backgroundStyle === 'glass') {
    rootBgGradient = `radial-gradient(circle at 50% 0%, ${tokens.primaryColor}35 0%, transparent 60%), ${tokens.backgroundColor}`;
  } else if (backgroundStyle === 'tech_grid') {
    rootBgGradient = `linear-gradient(to right, ${tokens.primaryColor}15 1px, transparent 1px), linear-gradient(to bottom, ${tokens.primaryColor}15 1px, ${tokens.backgroundColor} 1px)`;
  } else if (backgroundStyle === 'editorial') {
    rootBgColor = '#faf8f5';
  }

  const rootNode: DesignNode = {
    id: `root-${screenId}`,
    name: title,
    type: 'container',
    styles: {
      width: '100%',
      minHeight: '100%',
      backgroundColor: rootBgColor,
      backgroundGradient: rootBgGradient,
      color: tokens.textColor,
      padding: isDesktop ? '32px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: isDesktop ? '24px' : '16px',
      fontFamily: tokens.fontFamily || 'Inter, sans-serif',
      boxSizing: 'border-box',
    },
    children: rootChildren,
  };

  return {
    id: screenId,
    name: title,
    rootNode,
  };
}

// ----------------------------------------------------
// UI BUILDER HELPERS WITH MORPHOLOGY STYLES
// ----------------------------------------------------
function buildCardStyle(tokens: SkillDesignTokens) {
  return {
    width: '100%',
    backgroundColor: tokens.cardColor,
    borderColor: tokens.borderColor,
    borderWidth: tokens.borderWidth,
    borderRadius: tokens.borderRadius,
    boxShadow: tokens.boxShadow,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    backdropFilter: tokens.backdropBlur,
  };
}

function buildBadgeStyle(tokens: SkillDesignTokens) {
  return {
    backgroundColor: `${tokens.primaryColor}22`,
    color: tokens.primaryColor,
    borderColor: `${tokens.primaryColor}44`,
    borderWidth: '1px',
    borderRadius: '9999px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
    alignSelf: 'flex-start',
  };
}

function buildInputStyle(tokens: SkillDesignTokens) {
  return {
    width: '100%',
    backgroundColor: tokens.cardColor,
    borderColor: tokens.borderColor,
    borderWidth: tokens.borderWidth,
    borderRadius: tokens.borderRadius,
    color: tokens.textColor,
    padding: '12px 14px',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  };
}

// Custom Button with ButtonShape Support
function buildCustomButton(
  label: string, 
  tokens: SkillDesignTokens, 
  shape: ButtonShape = 'squircle', 
  isPrimary = true
): DesignNode {
  let borderRadius = tokens.borderRadius;
  let borderWidth = '0px';
  let boxShadow = tokens.boxShadow;
  let padding = '12px 18px';
  let bg = isPrimary ? tokens.primaryColor : 'transparent';
  let color = isPrimary ? '#ffffff' : tokens.textColor;
  let backdropFilter: string | undefined = undefined;

  if (shape === 'pill') {
    borderRadius = '9999px';
    padding = '12px 24px';
  } else if (shape === 'sharp') {
    borderRadius = '2px';
    borderWidth = '2px';
    boxShadow = isPrimary ? '3px 3px 0px #000000' : 'none';
  } else if (shape === 'glow') {
    borderRadius = '12px';
    boxShadow = isPrimary ? `0 0 20px ${tokens.primaryColor}80` : tokens.boxShadow;
  } else if (shape === 'glass') {
    borderRadius = '16px';
    bg = isPrimary ? `${tokens.primaryColor}30` : 'rgba(255,255,255,0.06)';
    borderWidth = '1px';
    backdropFilter = 'blur(10px)';
  }

  return {
    id: `btn-${isPrimary ? 'pri' : 'sec'}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Botón ${label}`,
    type: 'button',
    content: label,
    styles: {
      backgroundColor: bg,
      color,
      borderRadius,
      borderWidth,
      borderColor: isPrimary && shape === 'sharp' ? '#000000' : tokens.borderColor,
      boxShadow,
      padding,
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter,
    },
    action: isPrimary ? { type: 'confetti' } : undefined,
  };
}

// Navigation Builder with MenuStyle Support
function buildNavigationNode(
  title: string,
  menuStyle: MenuStyle,
  _isDesktop: boolean,
  tokens: SkillDesignTokens,
  buttonShape: ButtonShape,
  logoImg: string | null
): DesignNode {
  // 1. Floating Dock Menu (Floating Island style)
  if (menuStyle === 'floating_dock') {
    return {
      id: `floating-dock-${Date.now()}`,
      name: 'Menú Dock Flotante',
      type: 'container',
      styles: {
        width: '100%',
        backgroundColor: `${tokens.cardColor}dd`,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${tokens.borderColor}`,
        borderRadius: '9999px',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
      },
      children: [
        {
          id: `dock-left-${Date.now()}`,
          name: 'Identidad Dock',
          type: 'container',
          styles: { display: 'flex', alignItems: 'center', gap: '10px' },
          children: [
            logoImg ? {
              id: `dock-logo-${Date.now()}`,
              name: 'Logo Dock',
              type: 'image',
              imageUrl: logoImg,
              styles: { width: '28px', height: '28px', borderRadius: '9999px', objectFit: 'cover' }
            } : {
              id: `dock-dot-${Date.now()}`,
              name: 'Dot Activo',
              type: 'container',
              styles: { width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: tokens.primaryColor, boxShadow: `0 0 10px ${tokens.primaryColor}` }
            },
            { id: `dock-title-${Date.now()}`, name: 'Título Dock', type: 'text', content: title, styles: { fontSize: '15px', fontWeight: 'bold', color: tokens.textColor } }
          ]
        },
        {
          id: `dock-actions-${Date.now()}`,
          name: 'Acciones Dock',
          type: 'container',
          styles: { display: 'flex', alignItems: 'center', gap: '8px' },
          children: [
            buildCustomButton('Menú ☰', tokens, 'pill', false),
            buildCustomButton('Acción', tokens, 'pill', true),
          ]
        }
      ]
    };
  }

  // 2. Classic Topbar / Edge-to-edge Header
  return {
    id: `desktop-header-${Date.now()}`,
    name: 'Cabecera Superior Clásica',
    type: 'container',
    styles: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '16px',
      borderBottom: `1px solid ${tokens.borderColor}`,
    },
    children: [
      {
        id: `dh-brand-${Date.now()}`,
        name: 'Logo y Título',
        type: 'container',
        styles: { display: 'flex', alignItems: 'center', gap: '12px' },
        children: [
          logoImg ? {
            id: `dh-logo-${Date.now()}`,
            name: 'Logo',
            type: 'image',
            imageUrl: logoImg,
            styles: { width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }
          } : {
            id: `dh-dot-${Date.now()}`,
            name: 'Dot',
            type: 'container',
            styles: { width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: tokens.primaryColor, boxShadow: `0 0 10px ${tokens.primaryColor}` }
          },
          { id: `dh-title-${Date.now()}`, name: 'Título Pantalla', type: 'text', content: title, styles: { fontSize: '18px', fontWeight: 'bold', color: tokens.textColor } },
        ]
      },
      {
        id: `dh-nav-links-${Date.now()}`,
        name: 'Acciones de Cabecera',
        type: 'container',
        styles: { display: 'flex', alignItems: 'center', gap: '10px' },
        children: [
          buildCustomButton('⚙ Ajustes', tokens, buttonShape, false),
          buildCustomButton('+ Operación', tokens, buttonShape, true),
        ]
      }
    ]
  };
}

// Bottom Mobile Tabbar with Center Action Button
function buildBottomTabbarNode(tokens: SkillDesignTokens, _buttonShape: ButtonShape): DesignNode {
  return {
    id: `mobile-tabbar-${Date.now()}`,
    name: 'Barra de Pestañas Inferior (Tabbar)',
    type: 'tabbar',
    styles: {
      width: '100%',
      backgroundColor: `${tokens.cardColor}ee`,
      backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${tokens.borderColor}`,
      borderRadius: tokens.borderRadius,
      padding: '10px 16px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 'auto',
      boxShadow: '0 -10px 25px rgba(0,0,0,0.3)',
    },
    children: [
      { id: `tb-1-${Date.now()}`, name: 'Tab Inicio', type: 'text', content: '🏠 Inicio', styles: { fontSize: '11px', color: tokens.primaryColor, fontWeight: 'bold' } },
      { id: `tb-2-${Date.now()}`, name: 'Tab Explorar', type: 'text', content: '🔍 Explorar', styles: { fontSize: '11px', color: tokens.mutedColor } },
      buildCustomButton('+', tokens, 'pill', true),
      { id: `tb-3-${Date.now()}`, name: 'Tab Actividad', type: 'text', content: '🔔 Alertas', styles: { fontSize: '11px', color: tokens.mutedColor } },
      { id: `tb-4-${Date.now()}`, name: 'Tab Perfil', type: 'text', content: '👤 Perfil', styles: { fontSize: '11px', color: tokens.mutedColor } },
    ]
  };
}

function buildMetricCard(title: string, value: string, badge: string, tokens: SkillDesignTokens): DesignNode {
  return {
    id: `metric-box-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Métrica: ${title}`,
    type: 'card',
    styles: {
      ...buildCardStyle(tokens),
      padding: '16px',
      gap: '8px',
    },
    children: [
      { id: `mt-${Date.now()}`, name: 'Etiqueta', type: 'text', content: title, styles: { fontSize: '11px', color: tokens.mutedColor, textTransform: 'uppercase' } },
      { id: `mv-${Date.now()}`, name: 'Valor', type: 'metric', content: value, secondaryContent: badge, styles: { fontSize: '24px', fontWeight: 'bold', color: tokens.textColor } },
    ]
  };
}

function buildListItem(title: string, subtitle: string, meta: string, tokens: SkillDesignTokens): DesignNode {
  return {
    id: `list-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Item: ${title}`,
    type: 'container',
    styles: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${tokens.borderColor}`,
    },
    children: [
      {
        id: `li-text-${Date.now()}`,
        name: 'Texto',
        type: 'container',
        styles: { display: 'flex', flexDirection: 'column', gap: '2px' },
        children: [
          { id: `li-t-${Date.now()}`, name: 'Título', type: 'text', content: title, styles: { fontSize: '13px', fontWeight: '600', color: tokens.textColor } },
          { id: `li-s-${Date.now()}`, name: 'Sub', type: 'text', content: subtitle, styles: { fontSize: '11px', color: tokens.mutedColor } },
        ]
      },
      { id: `li-m-${Date.now()}`, name: 'Meta', type: 'badge', content: meta, styles: buildBadgeStyle(tokens) }
    ]
  };
}

function buildProductCard(
  title: string, 
  price: string, 
  rating: string, 
  tokens: SkillDesignTokens,
  shape: ButtonShape,
  cardImg: string | null
): DesignNode {
  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Producto ${title}`,
    type: 'card',
    styles: {
      ...buildCardStyle(tokens),
      gap: '10px',
    },
    children: [
      cardImg ? {
        id: `prod-img-real-${Date.now()}`,
        name: 'Imagen de Producto',
        type: 'image',
        imageUrl: cardImg,
        styles: { width: '100%', height: '140px', borderRadius: tokens.borderRadius, objectFit: 'cover' }
      } : {
        id: `prod-img-${Date.now()}`,
        name: 'Placeholder Visual',
        type: 'container',
        styles: {
          width: '100%',
          height: '140px',
          backgroundColor: `${tokens.primaryColor}15`,
          borderRadius: tokens.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.primaryColor,
          fontWeight: 'bold',
          fontSize: '14px',
        },
        children: [
          { id: `pi-lbl-${Date.now()}`, name: 'Etiqueta', type: 'text', content: '🖼️ Producto Destacado', styles: { color: tokens.primaryColor, fontWeight: 'bold' } }
        ]
      },
      { id: `prod-t-${Date.now()}`, name: 'Título', type: 'text', content: title, styles: { fontSize: '14px', fontWeight: 'bold', color: tokens.textColor } },
      { id: `prod-r-${Date.now()}`, name: 'Rating', type: 'text', content: rating, styles: { fontSize: '11px', color: tokens.mutedColor } },
      {
        id: `prod-price-row-${Date.now()}`,
        name: 'Precio y Compra',
        type: 'container',
        styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '6px' },
        children: [
          { id: `p-pr-${Date.now()}`, name: 'Precio', type: 'metric', content: price, styles: { fontSize: '16px', fontWeight: 'bold', color: tokens.textColor } },
          buildCustomButton('Comprar', tokens, shape, true),
        ]
      }
    ]
  };
}

// ==========================================
// 6. APLICADOR DE SKILL A NODOS EXISTENTES
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
          if (tokens.fontFamily) updatedStyles.fontFamily = tokens.fontFamily;
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
