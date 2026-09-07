// Visual Assets Library: Lucide Icons Catalog & Unsplash Curated Stock Photos

export interface IconItem {
  name: string;
  category: 'ui' | 'media' | 'finance' | 'commerce' | 'devices' | 'navigation';
}

export const LUCIDE_ICONS_LIST: IconItem[] = [
  // UI & General
  { name: 'Sparkles', category: 'ui' },
  { name: 'Star', category: 'ui' },
  { name: 'Heart', category: 'ui' },
  { name: 'ThumbsUp', category: 'ui' },
  { name: 'Check', category: 'ui' },
  { name: 'CheckCircle2', category: 'ui' },
  { name: 'X', category: 'ui' },
  { name: 'XCircle', category: 'ui' },
  { name: 'AlertCircle', category: 'ui' },
  { name: 'Info', category: 'ui' },
  { name: 'HelpCircle', category: 'ui' },
  { name: 'Bell', category: 'ui' },
  { name: 'Settings', category: 'ui' },
  { name: 'Sliders', category: 'ui' },
  { name: 'Filter', category: 'ui' },
  { name: 'Search', category: 'ui' },
  { name: 'Trash2', category: 'ui' },
  { name: 'Edit3', category: 'ui' },
  { name: 'Plus', category: 'ui' },
  { name: 'Share2', category: 'ui' },
  { name: 'Copy', category: 'ui' },
  { name: 'ExternalLink', category: 'ui' },
  { name: 'Eye', category: 'ui' },
  { name: 'Lock', category: 'ui' },
  { name: 'Unlock', category: 'ui' },
  { name: 'Shield', category: 'ui' },
  { name: 'Zap', category: 'ui' },
  { name: 'Flame', category: 'ui' },
  { name: 'Moon', category: 'ui' },
  { name: 'Sun', category: 'ui' },

  // Finance & Business
  { name: 'CreditCard', category: 'finance' },
  { name: 'DollarSign', category: 'finance' },
  { name: 'Wallet', category: 'finance' },
  { name: 'TrendingUp', category: 'finance' },
  { name: 'TrendingDown', category: 'finance' },
  { name: 'PieChart', category: 'finance' },
  { name: 'BarChart3', category: 'finance' },
  { name: 'Receipt', category: 'finance' },
  { name: 'PiggyBank', category: 'finance' },
  { name: 'Banknote', category: 'finance' },
  { name: 'Landmark', category: 'finance' },

  // Commerce & Shopping
  { name: 'ShoppingBag', category: 'commerce' },
  { name: 'ShoppingCart', category: 'commerce' },
  { name: 'Package', category: 'commerce' },
  { name: 'Truck', category: 'commerce' },
  { name: 'Tag', category: 'commerce' },
  { name: 'Gift', category: 'commerce' },
  { name: 'Percent', category: 'commerce' },

  // Navigation & Places
  { name: 'Home', category: 'navigation' },
  { name: 'Compass', category: 'navigation' },
  { name: 'MapPin', category: 'navigation' },
  { name: 'Navigation', category: 'navigation' },
  { name: 'ArrowRight', category: 'navigation' },
  { name: 'ArrowLeft', category: 'navigation' },
  { name: 'ArrowUp', category: 'navigation' },
  { name: 'ArrowDown', category: 'navigation' },
  { name: 'ChevronRight', category: 'navigation' },
  { name: 'ChevronLeft', category: 'navigation' },
  { name: 'Menu', category: 'navigation' },
  { name: 'MoreHorizontal', category: 'navigation' },
  { name: 'MoreVertical', category: 'navigation' },
  { name: 'Globe', category: 'navigation' },

  // Media & Social
  { name: 'User', category: 'media' },
  { name: 'Users', category: 'media' },
  { name: 'UserPlus', category: 'media' },
  { name: 'MessageSquare', category: 'media' },
  { name: 'Mail', category: 'media' },
  { name: 'Phone', category: 'media' },
  { name: 'Camera', category: 'media' },
  { name: 'Image', category: 'media' },
  { name: 'Music', category: 'media' },
  { name: 'Video', category: 'media' },
  { name: 'Mic', category: 'media' },
  { name: 'Play', category: 'media' },
  { name: 'Pause', category: 'media' },

  // Devices & Tech
  { name: 'Smartphone', category: 'devices' },
  { name: 'Tablet', category: 'devices' },
  { name: 'Monitor', category: 'devices' },
  { name: 'Laptop', category: 'devices' },
  { name: 'Cpu', category: 'devices' },
  { name: 'Wifi', category: 'devices' },
  { name: 'BatteryCharging', category: 'devices' },
  { name: 'Cloud', category: 'devices' },
  { name: 'Database', category: 'devices' },
];

export interface StockPhoto {
  id: string;
  category: 'avatars' | 'products' | 'nature' | 'tech' | 'abstract';
  title: string;
  url: string;
}

export const STOCK_PHOTOS: StockPhoto[] = [
  // Avatars
  {
    id: 'av-1',
    category: 'avatars',
    title: 'Mujer Profesional',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av-2',
    category: 'avatars',
    title: 'Hombre Joven Ejecutivo',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av-3',
    category: 'avatars',
    title: 'Desarrolladora Tech',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av-4',
    category: 'avatars',
    title: 'Diseñador Creativo',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },

  // E-Commerce & Products
  {
    id: 'pr-1',
    category: 'products',
    title: 'Sneakers Deportivas',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pr-2',
    category: 'products',
    title: 'Reloj Minimalista',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pr-3',
    category: 'products',
    title: 'Audífonos Bluetooth Studio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pr-4',
    category: 'products',
    title: 'Cámara Fotográfica Vintage',
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
  },

  // Tech & Workspace
  {
    id: 'tc-1',
    category: 'tech',
    title: 'Escritorio Minimalista con Laptop',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tc-2',
    category: 'tech',
    title: 'Código y Monitor Oscuro',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tc-3',
    category: 'tech',
    title: 'Servidores & Cloud Infrastructure',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },

  // Abstract & Gradients
  {
    id: 'ab-1',
    category: 'abstract',
    title: 'Ondas de Luz Violeta Neón',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ab-2',
    category: 'abstract',
    title: 'Malla Degradada 3D',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ab-3',
    category: 'abstract',
    title: 'Vidrio Esmerilado Oscuro',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
  },
];
