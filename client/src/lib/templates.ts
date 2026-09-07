import type { ScreenDefinition } from './types';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'Fintech' | 'E-Commerce' | 'SaaS & Web' | 'Social & Chat' | 'Salud & Fitness' | 'Landing & Portfolio';
  platform: 'mobile' | 'web';
  description: string;
  icon: string;
  tags: string[];
  isCustom?: boolean;
  screens: ScreenDefinition[];
}

export const OFFICIAL_TEMPLATES: ProjectTemplate[] = [
  // ==========================================
  // 1. MOBILE: FINTECH & CRYPTO WALLET
  // ==========================================
  {
    id: 'template-fintech-pro',
    name: 'NeoBank & Crypto Pro',
    category: 'Fintech',
    platform: 'mobile',
    description: 'Banca digital de alta fidelidad con balance en vivo, tarjeta virtual, transferencias y analíticas.',
    icon: '💳',
    tags: ['Fintech', 'Crypto', 'Banca Móvil'],
    screens: [
      {
        id: 'screen-fintech-home',
        name: 'Dashboard Financiero',
        rootNode: {
          id: 'root-fintech-home',
          name: 'Dashboard Root',
          type: 'container',
          styles: {
            backgroundColor: '#090d16',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'fin-nav',
              name: 'Cabecera de Cuenta',
              type: 'navbar',
              content: 'Banca Móvil Pro',
              styles: {
                backgroundColor: '#131b2e',
                borderRadius: '16px',
                padding: '12px 16px',
                borderWidth: '1px',
                borderColor: '#1e293b',
              },
            },
            {
              id: 'fin-metric',
              name: 'Saldo Disponible',
              type: 'metric',
              content: 'Saldo Principal',
              secondaryContent: '$12,850.00 USD',
              styles: {
                backgroundColor: '#1e293b',
                padding: '16px',
                borderRadius: '18px',
                borderWidth: '1px',
                borderColor: '#334155',
              },
            },
            {
              id: 'fin-card-crypto',
              name: 'Tarjeta Virtual Black',
              type: 'card',
              styles: {
                backgroundColor: '#1e1b4b',
                borderRadius: '20px',
                padding: '18px',
                borderWidth: '1px',
                borderColor: '#4338ca',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: [
                {
                  id: 'fin-card-chip',
                  name: 'Tipo de Tarjeta',
                  type: 'text',
                  content: '💳 TITANIUM VIRTUAL •••• 4829',
                  styles: { fontSize: '11px', color: '#c7d2fe', fontWeight: '700' },
                },
                {
                  id: 'fin-card-exp',
                  name: 'Expiración',
                  type: 'text',
                  content: 'EXP 08/29 - CVC 912',
                  styles: { fontSize: '12px', color: '#818cf8', fontFamily: 'monospace' },
                },
              ],
            },
            {
              id: 'fin-btn-transfer',
              name: 'Botón Transferir',
              type: 'button',
              content: '⚡ Transferir Dinero',
              styles: {
                backgroundColor: '#6366f1',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '14px',
                width: '100%',
              },
              action: { type: 'modal', modalTitle: 'Nueva Transferencia', modalContent: 'Ingresa el monto y cuenta destino para transferir fondos instantáneamente.' },
              sounds: { onClick: 'chime' },
            },
            {
              id: 'fin-progress',
              name: 'Ahorro Mensual',
              type: 'progress',
              content: 'Meta de Vacaciones',
              value: 78,
              styles: {
                backgroundColor: '#1e293b',
                padding: '14px',
                borderRadius: '16px',
              },
            },
            {
              id: 'fin-tabbar',
              name: 'Navegación Móvil',
              type: 'tabbar',
              styles: {
                backgroundColor: '#0f172a',
                padding: '12px',
                borderRadius: '18px',
                borderWidth: '1px',
                borderColor: '#1e293b',
              },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 2. MOBILE: E-COMMERCE / SNEAKERS & FASHION
  // ==========================================
  {
    id: 'template-ecommerce-kicks',
    name: 'Urban Kicks Store',
    category: 'E-Commerce',
    platform: 'mobile',
    description: 'Catálogo de calzado deportivo con buscador, tabs de categoría, tarjetas de producto y checkout confeti.',
    icon: '👟',
    tags: ['E-Commerce', 'Tienda', 'Moda', 'Mobile'],
    screens: [
      {
        id: 'screen-ecom-home',
        name: 'Tienda Online',
        rootNode: {
          id: 'root-ecom-home',
          name: 'Store Root',
          type: 'container',
          styles: {
            backgroundColor: '#0b0f19',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            width: '100%',
          },
          children: [
            {
              id: 'ecom-nav',
              name: 'Barra de Tienda',
              type: 'navbar',
              content: 'Urban Kicks Drop',
              styles: {
                backgroundColor: '#161f30',
                borderRadius: '14px',
                padding: '12px 16px',
              },
            },
            {
              id: 'ecom-search',
              name: 'Buscador de Zapatillas',
              type: 'searchbar',
              placeholder: 'Buscar Jordan, Yeezy, Nike...',
              styles: {
                backgroundColor: '#0f172a',
                padding: '10px 14px',
                borderRadius: '12px',
                borderWidth: '1px',
                borderColor: '#334155',
              },
            },
            {
              id: 'ecom-segmented',
              name: 'Categorías',
              type: 'segmented',
              options: ['Hombre', 'Mujer', 'Colección'],
              styles: {
                backgroundColor: '#0f172a',
                padding: '4px',
                borderRadius: '12px',
              },
            },
            {
              id: 'ecom-card-product',
              name: 'Tarjeta Producto Destacado',
              type: 'card',
              styles: {
                backgroundColor: '#1e293b',
                borderRadius: '18px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderWidth: '1px',
                borderColor: '#334155',
              },
              children: [
                {
                  id: 'ecom-p-title',
                  name: 'Nombre Producto',
                  type: 'text',
                  content: 'Air Retro Cyber Edition',
                  styles: { fontSize: '16px', fontWeight: '700', color: '#ffffff' },
                },
                {
                  id: 'ecom-p-price',
                  name: 'Precio Producto',
                  type: 'text',
                  content: '$189.99 USD',
                  styles: { fontSize: '20px', fontWeight: '800', color: '#ec4899' },
                },
                {
                  id: 'ecom-btn-buy',
                  name: 'Botón Comprar Ahora',
                  type: 'button',
                  content: '🛍️ Añadir al Carrito',
                  styles: {
                    backgroundColor: '#ec4899',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '700',
                  },
                  action: { type: 'confetti' },
                  sounds: { onClick: 'pop' },
                },
              ],
            },
            {
              id: 'ecom-tabbar',
              name: 'Menú Tienda',
              type: 'tabbar',
              styles: {
                backgroundColor: '#0f172a',
                padding: '12px',
                borderRadius: '18px',
              },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 3. MOBILE: SOCIAL MEDIA & STORIES (FEED)
  // ==========================================
  {
    id: 'template-social-feed',
    name: 'Pulse Social Feed',
    category: 'Social & Chat',
    platform: 'mobile',
    description: 'Red social estilo Instagram con barra de historias, tarjeta de post, botones de interacción y comentarios.',
    icon: '📸',
    tags: ['Social', 'Feed', 'Historias', 'Mobile'],
    screens: [
      {
        id: 'screen-social-home',
        name: 'Feed Principal',
        rootNode: {
          id: 'root-social-home',
          name: 'Social Root',
          type: 'container',
          styles: {
            backgroundColor: '#030712',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'soc-nav',
              name: 'Barra Superior',
              type: 'navbar',
              content: 'Pulse Network',
              styles: {
                backgroundColor: '#111827',
                borderRadius: '14px',
                padding: '12px 16px',
              },
            },
            {
              id: 'soc-stories',
              name: 'Barra de Historias',
              type: 'card',
              styles: {
                backgroundColor: '#111827',
                padding: '12px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                borderWidth: '1px',
                borderColor: '#1f2937',
              },
              children: [
                {
                  id: 'soc-avatar-1',
                  name: 'Tu Historia',
                  type: 'avatar',
                  content: 'Tu Historia',
                  styles: { backgroundColor: '#374151', padding: '6px', borderRadius: '50%' },
                },
                {
                  id: 'soc-avatar-2',
                  name: 'Sara K.',
                  type: 'avatar',
                  content: 'Sara K.',
                  styles: { backgroundColor: '#ec4899', padding: '6px', borderRadius: '50%' },
                },
                {
                  id: 'soc-avatar-3',
                  name: 'Alex D.',
                  type: 'avatar',
                  content: 'Alex D.',
                  styles: { backgroundColor: '#8b5cf6', padding: '6px', borderRadius: '50%' },
                },
              ],
            },
            {
              id: 'soc-post-card',
              name: 'Tarjeta de Publicación',
              type: 'card',
              styles: {
                backgroundColor: '#111827',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderWidth: '1px',
                borderColor: '#1f2937',
              },
              children: [
                {
                  id: 'soc-post-author',
                  name: 'Autor',
                  type: 'avatar',
                  content: 'Elena Rostova • Hace 2h',
                  styles: { backgroundColor: 'transparent' },
                },
                {
                  id: 'soc-post-desc',
                  name: 'Texto del Post',
                  type: 'text',
                  content: '¡Nuevo lanzamiento de software diseñado en DesignForge Studio! 🚀 El futuro del diseño visual.',
                  styles: { fontSize: '13px', color: '#e5e7eb', lineHeight: '1.5' },
                },
                {
                  id: 'soc-post-btn-like',
                  name: 'Botón Me Gusta',
                  type: 'button',
                  content: '❤️ 1,420 Me Gusta',
                  styles: {
                    backgroundColor: '#1f2937',
                    color: '#f43f5e',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: '700',
                  },
                  action: { type: 'confetti' },
                  sounds: { onClick: 'pop' },
                },
              ],
            },
            {
              id: 'soc-tabbar',
              name: 'Barra Inferior',
              type: 'tabbar',
              styles: {
                backgroundColor: '#111827',
                padding: '12px',
                borderRadius: '18px',
              },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 4. MOBILE: FITNESS & SALUD TRACKER
  // ==========================================
  {
    id: 'template-fitness-pulse',
    name: 'FitPulse Tracker',
    category: 'Salud & Fitness',
    platform: 'mobile',
    description: 'Seguimiento de entrenamientos, conteo de calorías, meta de pasos y rutinas de cardio.',
    icon: '⚡',
    tags: ['Fitness', 'Salud', 'Tracker', 'Gym'],
    screens: [
      {
        id: 'screen-fit-home',
        name: 'Dashboard Entrenamiento',
        rootNode: {
          id: 'root-fit-home',
          name: 'Fit Root',
          type: 'container',
          styles: {
            backgroundColor: '#0a0f0d',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'fit-nav',
              name: 'Barra Fitness',
              type: 'navbar',
              content: 'FitPulse Tracker',
              styles: { backgroundColor: '#14231c', borderRadius: '16px', padding: '12px' },
            },
            {
              id: 'fit-kpi-calories',
              name: 'Calorías Quemadas',
              type: 'metric',
              content: 'Calorías Activas',
              secondaryContent: '840 / 1,000 kcal',
              styles: { backgroundColor: '#14231c', padding: '16px', borderRadius: '18px', borderColor: '#10b981' },
            },
            {
              id: 'fit-progress',
              name: 'Meta de Pasos Diarios',
              type: 'progress',
              content: '8,420 de 10,000 Pasos',
              value: 84,
              styles: { backgroundColor: '#14231c', padding: '14px', borderRadius: '16px' },
            },
            {
              id: 'fit-btn-start',
              name: 'Comenzar Entrenamiento',
              type: 'button',
              content: '🔥 Iniciar Sesión Cardio',
              styles: {
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '14px',
              },
              action: { type: 'modal', modalTitle: 'Entrenamiento Iniciado', modalContent: 'Cronómetro activo y sensores de ritmo cardíaco calibrados.' },
              sounds: { onClick: 'chime' },
            },
            {
              id: 'fit-tabbar',
              name: 'Barra Inferior',
              type: 'tabbar',
              styles: { backgroundColor: '#14231c', padding: '12px', borderRadius: '18px' },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 5. MOBILE: FOOD DELIVERY & RESTAURANT
  // ==========================================
  {
    id: 'template-food-delivery',
    name: 'BiteDrop Food Delivery',
    category: 'E-Commerce',
    platform: 'mobile',
    description: 'App de pedidos de comida con menú de platos, tiempos estimados de entrega y botón de orden.',
    icon: '🍔',
    tags: ['Delivery', 'Comida', 'Restaurante', 'Mobile'],
    screens: [
      {
        id: 'screen-food-home',
        name: 'Menú del Restaurante',
        rootNode: {
          id: 'root-food-home',
          name: 'Food Root',
          type: 'container',
          styles: {
            backgroundColor: '#180a0a',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'food-nav',
              name: 'Barra Delivery',
              type: 'navbar',
              content: 'BiteDrop Gourmet',
              styles: { backgroundColor: '#2d1212', borderRadius: '16px', padding: '12px' },
            },
            {
              id: 'food-banner',
              name: 'Tiempo Estimado',
              type: 'banner',
              content: '🛵 Entrega estimada en 25-35 min a tu ubicación',
              styles: { backgroundColor: '#3b1818', padding: '10px 14px', borderRadius: '12px', color: '#fca5a5' },
            },
            {
              id: 'food-card-1',
              name: 'Burger Angus Deluxe',
              type: 'card',
              styles: {
                backgroundColor: '#260f0f',
                padding: '16px',
                borderRadius: '18px',
                borderWidth: '1px',
                borderColor: '#451a1a',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: [
                {
                  id: 'food-title-1',
                  name: 'Nombre Plato',
                  type: 'text',
                  content: '🍔 Truffle Angus Burger',
                  styles: { fontSize: '15px', fontWeight: '700', color: '#ffffff' },
                },
                {
                  id: 'food-price-1',
                  name: 'Precio',
                  type: 'text',
                  content: '$14.50 USD',
                  styles: { fontSize: '16px', fontWeight: '800', color: '#f87171' },
                },
                {
                  id: 'food-btn-add',
                  name: 'Añadir Plato',
                  type: 'button',
                  content: '+ Agregar a la Orden',
                  styles: { backgroundColor: '#ef4444', color: '#ffffff', padding: '10px', borderRadius: '10px', fontWeight: '700' },
                  action: { type: 'confetti' },
                  sounds: { onClick: 'pop' },
                },
              ],
            },
            {
              id: 'food-tabbar',
              name: 'Barra Inferior',
              type: 'tabbar',
              styles: { backgroundColor: '#2d1212', padding: '12px', borderRadius: '18px' },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 6. WEB/DESKTOP: SAAS ANALYTICS DASHBOARD
  // ==========================================
  {
    id: 'template-saas-cloudmetrics',
    name: 'CloudMetrics SaaS Dashboard',
    category: 'SaaS & Web',
    platform: 'web',
    description: 'Suite completa de telemetría y métricas SaaS con KPIs de ingresos, switches y tabla de transacciones.',
    icon: '📊',
    tags: ['SaaS', 'Dashboard', 'Analytics', 'Web'],
    screens: [
      {
        id: 'screen-saas-home',
        name: 'Dashboard Analytics',
        rootNode: {
          id: 'root-saas-home',
          name: 'SaaS Root',
          type: 'container',
          styles: {
            backgroundColor: '#0f172a',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'saas-nav',
              name: 'Barra SaaS',
              type: 'navbar',
              content: 'CloudMetrics Enterprise Portal',
              styles: {
                backgroundColor: '#1e293b',
                padding: '14px',
                borderRadius: '14px',
              },
            },
            {
              id: 'saas-metric',
              name: 'Ingresos Recurrentes (MRR)',
              type: 'metric',
              content: 'MRR Global',
              secondaryContent: '$48,120.00 /mes (+18.4%)',
              styles: {
                backgroundColor: '#1e293b',
                padding: '16px',
                borderRadius: '16px',
              },
            },
            {
              id: 'saas-switch',
              name: 'Sincronización en la Nube',
              type: 'switch',
              content: 'Auto-Scaling Multi-Región Activo',
              checked: true,
              styles: {
                backgroundColor: '#1e293b',
                padding: '12px 14px',
                borderRadius: '14px',
              },
            },
            {
              id: 'saas-table',
              name: 'Últimas Transacciones',
              type: 'table',
              content: 'Registro de Clientes',
              styles: {
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '16px',
              },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 7. WEB/DESKTOP: AI CHAT & PROMPT STUDIO
  // ==========================================
  {
    id: 'template-ai-prompt-studio',
    name: 'NeuroPrompt AI Studio',
    category: 'SaaS & Web',
    platform: 'web',
    description: 'Entorno conversacional tipo ChatGPT / Claude con barra de prompts flotante, selección de modelo y respuestas.',
    icon: '🤖',
    tags: ['IA', 'Chatbot', 'LLM', 'Web'],
    screens: [
      {
        id: 'screen-ai-home',
        name: 'Workspace de Chat IA',
        rootNode: {
          id: 'root-ai-home',
          name: 'AI Root',
          type: 'container',
          styles: {
            backgroundColor: '#090a0f',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          },
          children: [
            {
              id: 'ai-nav',
              name: 'Barra de Modelo',
              type: 'navbar',
              content: 'NeuroPrompt Studio • GPT-4o / Claude 3.5',
              styles: { backgroundColor: '#13151f', borderRadius: '16px', padding: '14px' },
            },
            {
              id: 'ai-card-message',
              name: 'Respuesta Asistente',
              type: 'card',
              styles: {
                backgroundColor: '#171a29',
                padding: '20px',
                borderRadius: '20px',
                borderWidth: '1px',
                borderColor: '#232840',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              },
              children: [
                {
                  id: 'ai-badge-model',
                  name: 'Insignia Modelo',
                  type: 'badge',
                  content: '✦ NEURAL AGENT v2',
                  styles: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '4px 8px', borderRadius: '8px' },
                },
                {
                  id: 'ai-text-reply',
                  name: 'Texto Respuesta',
                  type: 'text',
                  content: '¡Listo! He generado el código completo en React y Tailwind CSS para tu interfaz con arquitectura de componentes optimizada.',
                  styles: { fontSize: '14px', color: '#e0e7ff', lineHeight: '1.6' },
                },
              ],
            },
            {
              id: 'ai-input-prompt',
              name: 'Barra de Prompts',
              type: 'input',
              placeholder: 'Escribe tu solicitud de código o diseño aquí...',
              styles: {
                backgroundColor: '#11131c',
                padding: '16px',
                borderRadius: '16px',
                borderWidth: '1px',
                borderColor: '#312e81',
                color: '#ffffff',
              },
            },
            {
              id: 'ai-btn-generate',
              name: 'Botón Enviar Prompt',
              type: 'button',
              content: '✨ Generar Respuesta',
              styles: {
                backgroundColor: '#6366f1',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: '700',
              },
              action: { type: 'confetti' },
              sounds: { onClick: 'pop' },
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // 8. WEB/DESKTOP: MODERN STARTUP LANDING PAGE
  // ==========================================
  {
    id: 'template-startup-landing',
    name: 'Apex Launchpad',
    category: 'Landing & Portfolio',
    platform: 'web',
    description: 'Landing page moderna con Hero section, badges de lanzamiento, llamada a la acción (CTA) y características.',
    icon: '🚀',
    tags: ['Landing Page', 'Startup', 'SaaS', 'Marketing'],
    screens: [
      {
        id: 'screen-landing-home',
        name: 'Página de Inicio',
        rootNode: {
          id: 'root-landing-home',
          name: 'Landing Root',
          type: 'container',
          styles: {
            backgroundColor: '#050811',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          },
          children: [
            {
              id: 'land-nav',
              name: 'Navegación Web',
              type: 'navbar',
              content: 'Apex Next-Gen UI',
              styles: { backgroundColor: '#0d1326', padding: '16px', borderRadius: '16px' },
            },
            {
              id: 'land-badge',
              name: 'Badge de Novedad',
              type: 'badge',
              content: '🚀 VERSIÓN 2.5 AHORA DISPONIBLE',
              styles: { backgroundColor: '#1e1b4b', color: '#a5b4fc', padding: '6px 12px', borderRadius: '999px' },
            },
            {
              id: 'land-hero-title',
              name: 'Título Principal',
              type: 'text',
              content: 'Diseña interfaces visuales y expórtalas a código React en segundos.',
              styles: { fontSize: '28px', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' },
            },
            {
              id: 'land-hero-subtitle',
              name: 'Subtítulo',
              type: 'text',
              content: 'La suite de diseño moderna para creadores, desarrolladores e ingenieros de producto.',
              styles: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.5' },
            },
            {
              id: 'land-cta-btn',
              name: 'Botón CTA',
              type: 'button',
              content: '🔥 Comenzar Gratis Ahora',
              styles: {
                backgroundColor: '#6366f1',
                color: '#ffffff',
                padding: '16px',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '15px',
              },
              action: { type: 'confetti' },
              sounds: { onClick: 'chime' },
            },
          ],
        },
      },
    ],
  },
];

// Helper to load user custom templates from localStorage
export const loadCustomTemplates = (): ProjectTemplate[] => {
  try {
    const raw = localStorage.getItem('designforge_custom_templates');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading custom templates:', err);
  }
  return [];
};

// Helper to save a custom template to localStorage
export const saveCustomTemplate = (template: ProjectTemplate): ProjectTemplate[] => {
  try {
    const existing = loadCustomTemplates();
    const updated = [template, ...existing.filter(t => t.id !== template.id)];
    localStorage.setItem('designforge_custom_templates', JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving custom template:', err);
    return [];
  }
};

// Helper to delete a custom template from localStorage
export const deleteCustomTemplate = (templateId: string): ProjectTemplate[] => {
  try {
    const existing = loadCustomTemplates();
    const updated = existing.filter(t => t.id !== templateId);
    localStorage.setItem('designforge_custom_templates', JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting custom template:', err);
    return [];
  }
};

// Backward-compatible default export
export const TEMPLATES = OFFICIAL_TEMPLATES;