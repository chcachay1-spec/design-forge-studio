import type { ScreenDefinition } from './types';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'Fintech' | 'E-Commerce' | 'SaaS' | 'Landing Page';
  description: string;
  icon: string;
  screens: ScreenDefinition[];
}

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'template-fintech',
    name: 'NeoBank Pro',
    category: 'Fintech',
    description: 'Banca digital moderna con saldo total, tarjeta virtual, transferencias y analíticas.',
    icon: '💳',
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
              secondaryContent: ',850.00 USD',
              styles: {
                backgroundColor: '#1e293b',
                padding: '16px',
                borderRadius: '18px',
                borderWidth: '1px',
                borderColor: '#334155',
              },
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
  {
    id: 'template-ecommerce',
    name: 'Urban Sneakers Shop',
    category: 'E-Commerce',
    description: 'Catálogo de calzado deportivo con buscador, slider de precios y botones de compra con confeti.',
    icon: '👟',
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
              content: 'Urban Kicks',
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
                  content: '.99 USD',
                  styles: { fontSize: '20px', fontWeight: '800', color: '#ec4899' },
                },
                {
                  id: 'ecom-btn-buy',
                  name: 'Botón Comprar Ahora',
                  type: 'button',
                  content: '🛍️ Comprar Ahora',
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
          ],
        },
      },
    ],
  },
  {
    id: 'template-saas',
    name: 'CloudMetrics SaaS',
    category: 'SaaS',
    description: 'Panel de métricas en vivo, control de suscripciones, switches y usuarios activos.',
    icon: '📊',
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
              content: 'CloudMetrics Portal',
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
              secondaryContent: ',120.00 /mes',
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
              content: 'Sincronización Automática',
              checked: true,
              styles: {
                backgroundColor: '#1e293b',
                padding: '12px 14px',
                borderRadius: '14px',
              },
            },
            {
              id: 'saas-avatar',
              name: 'Usuario Admin',
              type: 'avatar',
              content: 'Elena Vance',
              styles: {
                backgroundColor: '#1e293b',
                padding: '12px',
                borderRadius: '14px',
              },
            },
          ],
        },
      },
    ],
  },
];
