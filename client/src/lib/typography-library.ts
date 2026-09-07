export interface FontFamilyItem {
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'mono' | 'display' | 'handwriting';
  description: string;
  preview: string;
}

export const FONT_CATEGORIES = [
  { id: 'all', label: 'Todas las Fuentes' },
  { id: 'sans', label: 'Sans-Serif (Modernas)' },
  { id: 'serif', label: 'Serif (Elegantes)' },
  { id: 'mono', label: 'Monospace (Tech / Código)' },
  { id: 'display', label: 'Display & Retro' },
  { id: 'handwriting', label: 'Manuscritas & Cursivas' }
] as const;

export const FONT_FAMILIES_CATALOG: FontFamilyItem[] = [
  // --- SANS-SERIF MODERNAS ---
  {
    name: 'Inter',
    family: 'Inter',
    category: 'sans',
    description: 'Estándar moderno para UI, limpia y de máxima legibilidad',
    preview: 'Ag'
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    category: 'sans',
    description: 'Geométrica contemporánea, amigable y equilibrada',
    preview: 'Ag'
  },
  {
    name: 'Plus Jakarta Sans',
    family: 'Plus Jakarta Sans',
    category: 'sans',
    description: 'Ultra moderna para Startups, FinTech y SaaS 2026',
    preview: 'Ag'
  },
  {
    name: 'Outfit',
    family: 'Outfit',
    category: 'sans',
    description: 'Minimalista geométrica inspirada en marcas de lujo tech',
    preview: 'Ag'
  },
  {
    name: 'Space Grotesk',
    family: 'Space Grotesk',
    category: 'sans',
    description: 'Brutalismo digital, diseño web3 y editorial moderno',
    preview: 'Ag'
  },
  {
    name: 'Montserrat',
    family: 'Montserrat',
    category: 'sans',
    description: 'Inspirada en carteles urbanos, refinada y versátil',
    preview: 'Ag'
  },
  {
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans',
    description: 'El clásico referente de Material Design para Android',
    preview: 'Ag'
  },
  {
    name: 'DM Sans',
    family: 'DM Sans',
    category: 'sans',
    description: 'Geometría suave optimizada para lectura en pantallas',
    preview: 'Ag'
  },
  {
    name: 'Rubik',
    family: 'Rubik',
    category: 'sans',
    description: 'Esquinas ligeramente redondeadas, cálida y sólida',
    preview: 'Ag'
  },
  {
    name: 'Nunito',
    family: 'Nunito',
    category: 'sans',
    description: 'Terminales redondeadas, carácter jovial y accesible',
    preview: 'Ag'
  },

  // --- SERIF & EDITORIALES ELEGANTES ---
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'serif',
    description: 'Estilo editorial de alta gama, moda y revistas europeas',
    preview: 'Ag'
  },
  {
    name: 'Cinzel',
    family: 'Cinzel',
    category: 'serif',
    description: 'Inscripciones monumentales romanas, heráldica y prestigio',
    preview: 'AG'
  },
  {
    name: 'Lora',
    family: 'Lora',
    category: 'serif',
    description: 'Serif contemporánea con raíces caligráficas fluidas',
    preview: 'Ag'
  },
  {
    name: 'Merriweather',
    family: 'Merriweather',
    category: 'serif',
    description: 'Diseñada para lectura agradable en pantallas largas',
    preview: 'Ag'
  },
  {
    name: 'Cormorant Garamond',
    family: 'Cormorant Garamond',
    category: 'serif',
    description: 'Elegancia renacentista pura, libros y diseño literario',
    preview: 'Ag'
  },
  {
    name: 'Bodoni Moda',
    family: 'Bodoni Moda',
    category: 'serif',
    description: 'Contraste dramático estilo Vogue y alta costura',
    preview: 'Ag'
  },

  // --- MONOSPACE & CÓDIGO / TECH ---
  {
    name: 'Fira Code',
    family: 'Fira Code',
    category: 'mono',
    description: 'Monospace para desarrolladores con soporte de ligaduras',
    preview: '=>'
  },
  {
    name: 'JetBrains Mono',
    family: 'JetBrains Mono',
    category: 'mono',
    description: 'Geometría matemática optimizada para código e IDEs',
    preview: '<>'
  },
  {
    name: 'Space Mono',
    family: 'Space Mono',
    category: 'mono',
    description: 'Retrofuturismo de la era espacial de los años 60s',
    preview: '01'
  },
  {
    name: 'VT323',
    family: 'VT323',
    category: 'mono',
    description: 'Terminal hacker vintage fósforo verde DEC VT220',
    preview: '>_'
  },
  {
    name: 'Share Tech Mono',
    family: 'Share Tech Mono',
    category: 'mono',
    description: 'Monospace para pantallas HUD, militar y ciencia ficción',
    preview: 'TX'
  },

  // --- DISPLAY & RETRO / CYBER ---
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue',
    category: 'display',
    description: 'Titulares monumentales en mayúsculas, pósters y cine',
    preview: 'BE'
  },
  {
    name: 'Syne',
    family: 'Syne',
    category: 'display',
    description: 'Avant-garde artística contemporánea y diseño experimental',
    preview: 'Sy'
  },
  {
    name: 'Righteous',
    family: 'Righteous',
    category: 'display',
    description: 'Retro Synthwave y Art Déco de los años 80',
    preview: '80'
  },
  {
    name: 'Audiowide',
    family: 'Audiowide',
    category: 'display',
    description: 'Gaming, ciberespacio y naves espaciales futuristas',
    preview: 'AI'
  },
  {
    name: 'Press Start 2P',
    family: 'Press Start 2P',
    category: 'display',
    description: 'Pixel art arcade retro de 8 bits (Arcade 1985)',
    preview: '👾'
  },
  {
    name: 'Unbounded',
    family: 'Unbounded',
    category: 'display',
    description: 'Display ancha cyberpunk, brutalista y potente',
    preview: 'UN'
  },

  // --- MANUSCRITAS & CURSIVAS ---
  {
    name: 'Caveat',
    family: 'Caveat',
    category: 'handwriting',
    description: 'Manuscrita dinámica y espontánea, notas personales',
    preview: 'hi'
  },
  {
    name: 'Pacifico',
    family: 'Pacifico',
    category: 'handwriting',
    description: 'Pincel retro californiano de surf de los años 50',
    preview: 'Alo'
  },
  {
    name: 'Dancing Script',
    family: 'Dancing Script',
    category: 'handwriting',
    description: 'Cursiva vivaz con letras que saltan con soltura',
    preview: 'Art'
  },
  {
    name: 'Satisfy',
    family: 'Satisfy',
    category: 'handwriting',
    description: 'Firma caligráfica clásica y refinada de pluma estilográfica',
    preview: 'Sign'
  },
  {
    name: 'Permanent Marker',
    family: 'Permanent Marker',
    category: 'handwriting',
    description: 'Marcador indeleble urbano, estética callejera y graffiti',
    preview: 'Yo!'
  }
];

export interface TextEffectItem {
  id: string;
  name: string;
  cssShadow?: string;
  description: string;
}

export const TEXT_EFFECTS_PRESETS: TextEffectItem[] = [
  {
    id: 'none',
    name: 'Sin efecto',
    cssShadow: undefined,
    description: 'Texto plano sin sombras'
  },
  {
    id: 'soft_shadow',
    name: 'Sombra Suave',
    cssShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
    description: 'Aumenta el contraste sobre cualquier fondo'
  },
  {
    id: 'deep_shadow',
    name: 'Sombra Elevada 3D',
    cssShadow: '0 8px 24px rgba(0, 0, 0, 0.85), 0 2px 6px rgba(0, 0, 0, 0.4)',
    description: 'Profundidad cinematográfica'
  },
  {
    id: 'neon_cyan',
    name: 'Neón Cian Cyber',
    cssShadow: '0 0 8px #06b6d4, 0 0 20px #06b6d4, 0 0 40px #0891b2',
    description: 'Resplandor futurista cian'
  },
  {
    id: 'neon_pink',
    name: 'Neón Magenta Pop',
    cssShadow: '0 0 8px #ec4899, 0 0 20px #db2777, 0 0 40px #be185d',
    description: 'Resplandor vibrante synthwave'
  },
  {
    id: 'neon_amber',
    name: 'Neón Ámbar / Oro',
    cssShadow: '0 0 8px #f59e0b, 0 0 20px #d97706, 0 0 35px #b45309',
    description: 'Resplandor cálido de neón retro'
  },
  {
    id: 'retro_3d',
    name: 'Extrusión Retro 3D',
    cssShadow: '2px 2px 0px #4f46e5, 4px 4px 0px #06b6d4, 6px 6px 0px #0f172a',
    description: 'Efecto ochentero con capas de color'
  },
  {
    id: 'arcade_solid',
    name: 'Arcade Block 2D',
    cssShadow: '3px 3px 0px #000000',
    description: 'Borde cortado nítido estilo videojuegos'
  },
  {
    id: 'glitch_anaglyph',
    name: 'Glitch 3D Anáglifo',
    cssShadow: '2px 0px 0px #ef4444, -2px 0px 0px #06b6d4',
    description: 'Desfase cromático rojo y cian'
  },
  {
    id: 'letterpress',
    name: 'Grabado / Letterpress',
    cssShadow: '0 1px 0 rgba(255, 255, 255, 0.4), 0 -1px 0 rgba(0, 0, 0, 0.8)',
    description: 'Relieve hundido en la superficie'
  }
];

export interface TextGradientItem {
  id: string;
  name: string;
  cssGradient?: string;
  previewColors: string[];
}

export const TEXT_GRADIENTS_PRESETS: TextGradientItem[] = [
  {
    id: 'none',
    name: 'Color Sólido (Normal)',
    cssGradient: undefined,
    previewColors: ['#ffffff', '#ffffff']
  },
  {
    id: 'sunset_fire',
    name: 'Fuego Atardecer',
    cssGradient: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ec4899 100%)',
    previewColors: ['#fbbf24', '#f97316', '#ec4899']
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Neón',
    cssGradient: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
    previewColors: ['#06b6d4', '#a855f7', '#ec4899']
  },
  {
    id: 'aurora_mint',
    name: 'Aurora Boreal',
    cssGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
    previewColors: ['#10b981', '#06b6d4', '#3b82f6']
  },
  {
    id: 'royal_gold',
    name: 'Oro Real & Champagne',
    cssGradient: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
    previewColors: ['#fef08a', '#f59e0b', '#b45309']
  },
  {
    id: 'silver_hologram',
    name: 'Plata Holográfica',
    cssGradient: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 50%, #e2e8f0 100%)',
    previewColors: ['#f8fafc', '#94a3b8', '#e2e8f0']
  },
  {
    id: 'electric_violet',
    name: 'Violeta Eléctrico',
    cssGradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #4f46e5 100%)',
    previewColors: ['#c084fc', '#9333ea', '#4f46e5']
  }
];
