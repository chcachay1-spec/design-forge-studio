export interface DesignNode {
  id: string;
  name: string;
  type: 
    | 'container' 
    | 'button' 
    | 'text' 
    | 'card' 
    | 'input' 
    | 'badge' 
    | 'image' 
    | 'switch' 
    | 'avatar'
    | 'navbar'
    | 'tabbar'
    | 'searchbar'
    | 'slider'
    | 'segmented'
    | 'metric'
    | 'progress'
    | 'divider'
    | 'vector';
  content?: string;
  secondaryContent?: string;
  placeholder?: string;
  checked?: boolean;
  value?: number;
  options?: string[];
  avatarUrl?: string;
  imageUrl?: string;
  iconName?: string;
  svgPath?: string;
  vectorData?: {
    nodes?: Array<{ id: string; x: number; y: number; connections?: string[] }>;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  isMasterComponent?: boolean;
  masterComponentId?: string;
  children?: DesignNode[];
  styles: {
    backgroundColor?: string;
    backgroundGradient?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: 'Inter' | 'Poppins' | 'Roboto' | 'Fira Code' | 'Playfair Display' | 'sans-serif';
    letterSpacing?: string;
    lineHeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    boxShadow?: string;
    backdropFilter?: string;
    display?: string;
    flexDirection?: string;
    alignItems?: string;
    justifyContent?: string;
    gap?: string;
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    opacity?: string;
    animation?: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow' | 'float' | string;
    hoverScale?: boolean;
    zIndex?: string | number;
    position?: 'relative' | 'absolute' | 'static';
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    customAnimation?: string;
    animationDuration?: string;
    animationTiming?: string;
    animationIteration?: 'infinite' | '1' | '2' | '3';
  };
  sounds?: {
    onClick?: string;
    onHover?: string;
  };
  action?: {
    type: 
      | 'none' 
      | 'navigate' 
      | 'back'
      | 'modal' 
      | 'scroll_to_top'
      | 'confetti' 
      | 'copy_clipboard' 
      | 'toggle_state' 
      | 'sound_fx'
      | 'download_file'
      | 'toggle_theme'
      | 'alert' 
      | 'link';
    targetScreenId?: string;
    transition?: 'instant' | 'fade' | 'slide';
    alertMessage?: string;
    url?: string;
    clipboardText?: string;
    modalTitle?: string;
    modalContent?: string;
    soundEffect?: 'click' | 'pop' | 'switch' | 'chime' | 'alert' | 'whoosh' | 'bell';
    fileName?: string;
    fileContent?: string;
  };
}

export interface CanvasComment {
  id: string;
  x: number;
  y: number;
  author: string;
  content: string;
  createdAt: string;
  resolved?: boolean;
}

export interface ScreenDefinition {
  id: string;
  name: string;
  rootNode: DesignNode;
}

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export interface ProjectTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  borderRadius: string;
}

export type AIProvider = 'offline' | 'anthropic' | 'openai' | 'gemini' | 'ollama';

export interface CustomSynthParams {
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  startFreq: number; // in Hz
  endFreq: number; // in Hz
  duration: number; // in seconds (e.g. 0.05 to 1.5)
  ramp: 'exponential' | 'linear';
  gain: number; // 0 to 1
  name?: string;
  notes?: number[]; // optional arpeggio chord freqs
}

export interface CustomSoundDefinition {
  id: string;
  name: string;
  type: 'synth' | 'audio_file';
  description?: string;
  synthParams?: CustomSynthParams;
  audioDataUrl?: string; // base64 / dataUrl for imported sound files
  createdDate?: string;
}

export interface CustomAnimationDefinition {
  id: string;
  name: string;
  description?: string;
  keyframesCss: string; // CSS keyframe content
  animationClass: string;
  defaultDuration: string;
  defaultTiming: string;
  category?: 'motion' | 'glow' | 'attention' | 'fade';
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  endpointUrl?: string; // for Ollama or custom proxy
}

export const DEFAULT_THEME: ProjectTheme = {
  name: 'Modern Violet',
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  backgroundColor: '#0f172a',
  cardColor: '#1e293b',
  textColor: '#f8fafc',
  mutedColor: '#94a3b8',
  borderRadius: '16px',
};

// Initial interactive Mobile Banking / Web App mockup
export const INITIAL_PROJECT_NODES: DesignNode[] = [
  {
    id: 'app-root',
    name: 'App Root Screen',
    type: 'container',
    styles: {
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      height: '100%',
      borderRadius: '0px'
    },
    children: [
      {
        id: 'header-bar',
        name: 'Header Navbar',
        type: 'container',
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: '#334155'
        },
        children: [
          {
            id: 'brand-title',
            name: 'Brand Title',
            type: 'text',
            content: 'DesignForge Pay',
            styles: {
              fontSize: '18px',
              fontWeight: '700',
              color: '#ffffff'
            }
          },
          {
            id: 'status-badge',
            name: 'Live Status Badge',
            type: 'badge',
            content: '● OFFLINE READY',
            styles: {
              fontSize: '11px',
              fontWeight: '600',
              color: '#34d399',
              backgroundColor: '#064e3b',
              padding: '4px 10px',
              borderRadius: '9999px'
            },
            sounds: {
              onClick: 'pop'
            }
          }
        ]
      },
      {
        id: 'balance-card',
        name: 'Balance Card',
        type: 'card',
        styles: {
          backgroundColor: '#1e293b',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
        },
        sounds: {
          onHover: 'whoosh'
        },
        children: [
          {
            id: 'balance-label',
            name: 'Balance Label',
            type: 'text',
            content: 'Total Balance',
            styles: {
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '500'
            }
          },
          {
            id: 'balance-amount',
            name: 'Balance Amount',
            type: 'text',
            content: ',592.50',
            styles: {
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff'
            }
          },
          {
            id: 'card-actions-row',
            name: 'Card Actions Row',
            type: 'container',
            styles: {
              display: 'flex',
              gap: '12px',
              margin: '8px 0 0 0'
            },
            children: [
              {
                id: 'transfer-button',
                name: 'Transfer Button',
                type: 'button',
                content: 'Transfer',
                styles: {
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)'
                },
                sounds: {
                  onClick: 'chime',
                  onHover: 'pop'
                },
                action: {
                  type: 'navigate',
                  targetScreenId: 'screen-details'
                }
              },
              {
                id: 'receive-button',
                name: 'Receive Button',
                type: 'button',
                content: 'Deposit',
                styles: {
                  backgroundColor: '#334155',
                  color: '#f8fafc',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: '600'
                },
                sounds: {
                  onClick: 'click'
                },
                action: {
                  type: 'alert',
                  alertMessage: 'Tu dirección de depósito es: 0x71C...9B4'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'recent-section',
        name: 'Recent Activity',
        type: 'container',
        styles: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        },
        children: [
          {
            id: 'recent-heading',
            name: 'Section Heading',
            type: 'text',
            content: 'Recent Activity',
            styles: {
              fontSize: '16px',
              fontWeight: '700',
              color: '#e2e8f0'
            }
          },
          {
            id: 'transaction-item-1',
            name: 'Transaction Item (Claude Design)',
            type: 'card',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              padding: '16px',
              borderRadius: '16px',
              borderWidth: '1px',
              borderColor: '#334155'
            },
            sounds: {
              onClick: 'switch'
            },
            children: [
              {
                id: 'item-1-title',
                name: 'Item Title',
                type: 'text',
                content: 'Claude Pro Plan',
                styles: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff'
                }
              },
              {
                id: 'item-1-price',
                name: 'Item Price',
                type: 'text',
                content: '-.00',
                styles: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f43f5e'
                }
              }
            ]
          },
          {
            id: 'transaction-item-2',
            name: 'Transaction Item (Figma Pro)',
            type: 'card',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              padding: '16px',
              borderRadius: '16px',
              borderWidth: '1px',
              borderColor: '#334155'
            },
            sounds: {
              onClick: 'switch'
            },
            children: [
              {
                id: 'item-2-title',
                name: 'Item Title',
                type: 'text',
                content: 'Figma Enterprise',
                styles: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff'
                }
              },
              {
                id: 'item-2-price',
                name: 'Item Price',
                type: 'text',
                content: '-.00',
                styles: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f43f5e'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export const INITIAL_PROJECT_SCREENS: ScreenDefinition[] = [
  {
    id: 'screen-home',
    name: 'Home Dashboard',
    rootNode: INITIAL_PROJECT_NODES[0]
  },
  {
    id: 'screen-details',
    name: 'Transfer & Details',
    rootNode: {
      id: 'app-root-details',
      name: 'Details Window',
      type: 'container',
      styles: {
        backgroundColor: '#090d16',
        color: '#f8fafc',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        height: '100%',
        borderRadius: '0px'
      },
      children: [
        {
          id: 'details-header',
          name: 'Details Header',
          type: 'container',
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            borderWidth: '1px',
            borderColor: '#334155'
          },
          children: [
            {
              id: 'back-btn',
              name: 'Back Button',
              type: 'button',
              content: '← Volver',
              styles: {
                backgroundColor: '#334155',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600'
              },
              sounds: {
                onClick: 'switch'
              },
              action: {
                type: 'navigate',
                targetScreenId: 'screen-home'
              }
            },
            {
              id: 'details-title',
              name: 'Window Title',
              type: 'text',
              content: 'Detalles de Cuenta',
              styles: {
                fontSize: '15px',
                fontWeight: '700',
                color: '#ffffff'
              }
            }
          ]
        },
        {
          id: 'card-details-info',
          name: 'Info Card',
          type: 'card',
          styles: {
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            borderWidth: '1px',
            borderColor: '#6366f1',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          },
          children: [
            {
              id: 'info-amount-label',
              name: 'Amount Label',
              type: 'text',
              content: 'Balance Disponible',
              styles: {
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '500'
              }
            },
            {
              id: 'info-amount-val',
              name: 'Amount Value',
              type: 'text',
              content: '$24,580.00 USD',
              styles: {
                color: '#10b981',
                fontSize: '28px',
                fontWeight: '800'
              }
            },
            {
              id: 'info-desc',
              name: 'Info Description',
              type: 'text',
              content: 'Transfiere fondos de manera instantánea con cero comisiones a cualquier cuenta verificada.',
              styles: {
                color: '#cbd5e1',
                fontSize: '13px'
              }
            },
            {
              id: 'confirm-pay-btn',
              name: 'Confirm Transfer Button',
              type: 'button',
              content: 'Confirmar Transferencia ✨',
              styles: {
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '14px 20px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              },
              sounds: {
                onClick: 'chime'
              },
              action: {
                type: 'alert',
                alertMessage: '¡Transferencia realizada con éxito!'
              }
            }
          ]
        }
      ]
    }
  }
];
