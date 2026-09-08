import { useState, useEffect } from 'react';
import { storageEngine } from './lib/storage';
import { swapScreenTheme } from './lib/theme-swapper';
import { AiScreenGeneratorModal } from './components/AiScreenGeneratorModal';

import { Topbar } from './components/Topbar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { LayersPanel } from './components/LayersPanel';
import { SoundLab } from './components/SoundLab';
import { AiBridge } from './components/AiBridge';
import { DesignTokensModal } from './components/DesignTokensModal';
import { TemplatesModal } from './components/TemplatesModal';
import { ExportPaywallModal } from './components/ExportPaywallModal';
import { loadUserLicense, recordExportUsed, type UserLicense } from './lib/license';
import { FlowView } from './components/FlowView';
import { PresentationModal } from './components/PresentationModal';
import { AnimationStudioModal } from './components/AnimationStudioModal';
import { VectorStudioModal } from './components/VectorStudioModal';
import { ClaudeDesignPillBar, type ClaudeDesignMode } from './components/ClaudeDesignPillBar';
import { type ProjectTemplate } from './lib/templates';
import { toPng } from 'html-to-image';
import { 
  INITIAL_PROJECT_SCREENS, 
  DEFAULT_THEME, 
  type DesignNode, 
  type DeviceMode, 
  type ProjectTheme,
  type ScreenDefinition,
  type DrawingStroke,
  type CanvasComment,
  type CustomSoundDefinition,
  type CustomAnimationDefinition
} from './lib/types';
import { exportProjectZip, exportFullViteReactProject } from './lib/zip-handler';
import { soundEngine } from './lib/audio-engine';
import { INITIAL_CUSTOM_ANIMATIONS, injectCustomAnimationStyles } from './lib/animation-engine';
// @ts-ignore
import confetti from 'canvas-confetti';

export function App() {
  const [screens, setScreens] = useState<ScreenDefinition[]>(INITIAL_PROJECT_SCREENS);
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-home');
  const [theme, setTheme] = useState<ProjectTheme>(DEFAULT_THEME);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('transfer-button');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [zoom, setZoom] = useState<number>(1.0);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [isDesignTokensOpen, setIsDesignTokensOpen] = useState(false);
  const [isCommentsActive, setIsCommentsActive] = useState(false);
  const [comments, setComments] = useState<CanvasComment[]>([]);
  const [screenTransitionClass, setScreenTransitionClass] = useState<string>('');
  const [screenHistory, setScreenHistory] = useState<string[]>(['screen-home']);
  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo & Redo History
  const [pastScreens, setPastScreens] = useState<ScreenDefinition[][]>([]);
  const [futureScreens, setFutureScreens] = useState<ScreenDefinition[][]>([]);

  // Templates Modal, Grid & Flow State
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [pendingExportAction, setPendingExportAction] = useState<'react' | 'zip' | null>(null);
  const [userLicense, setUserLicense] = useState<UserLicense>(() => loadUserLicense());
  const [isGridActive, setIsGridActive] = useState(false);
  const [isFlowViewOpen, setIsFlowViewOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isAnimationStudioOpen, setIsAnimationStudioOpen] = useState(false);
  const [isVectorStudioOpen, setIsVectorStudioOpen] = useState(false);
  const [claudeMode, setClaudeMode] = useState<ClaudeDesignMode>('select');
  const [isElementAiLoading, setIsElementAiLoading] = useState(false);
  const [masterComponents, setMasterComponents] = useState<DesignNode[]>([]);
  const [customSounds, setCustomSounds] = useState<CustomSoundDefinition[]>([]);
  const [customAnimations, setCustomAnimations] = useState<CustomAnimationDefinition[]>(INITIAL_CUSTOM_ANIMATIONS);

  // Persistence & Auto-Save State
  const [isSaving, setIsSaving] = useState(false);
  const [isAiScreenModalOpen, setIsAiScreenModalOpen] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [currentThemeMode, setCurrentThemeMode] = useState<'dark' | 'light'>('dark');

  // Load project from localStorage on initial mount
  useEffect(() => {
    const saved = storageEngine.loadProject();
    if (saved && saved.screens && saved.screens.length > 0) {
      setScreens(saved.screens);
      if (saved.activeScreenId) setActiveScreenId(saved.activeScreenId);
      if (saved.theme) setTheme(saved.theme);
      if (saved.customSounds) setCustomSounds(saved.customSounds);
      if (saved.customAnimations) setCustomAnimations(saved.customAnimations);
      console.log('[DesignForge] Auto-restored project from local storage:', saved.name);
    }
  }, []);

  // Debounced auto-save project state to localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      storageEngine.saveProject({
        id: 'forge_active',
        name: 'Proyecto Principal DesignForge',
        screens,
        activeScreenId,
        theme,
        customSounds,
        customAnimations,
      });
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [screens, activeScreenId, theme, customSounds, customAnimations]);

  // Handle Save Snapshot
  const handleSaveSnapshot = () => {
    storageEngine.createSnapshot('', {
      id: 'forge_active',
      name: 'Proyecto Principal DesignForge',
      screens,
      activeScreenId,
      theme,
      customSounds,
      customAnimations,
    });
    soundEngine.playProceduralSound('chime');
    setToastMessage('¡Punto de restauración (Snapshot) guardado!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Export .forge JSON file
  const handleExportForgeFile = () => {
    storageEngine.exportForgeFile({
      version: '1.0',
      id: 'forge_' + Date.now(),
      name: 'proyecto_designforge',
      updatedAt: Date.now(),
      screens,
      activeScreenId,
      theme,
      customSounds,
      customAnimations,
    });
    soundEngine.playProceduralSound('chime');
    setToastMessage('¡Archivo de proyecto .forge descargado!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Import .forge JSON file
  const handleImportForgeFile = async (file: File) => {
    try {
      const project = await storageEngine.importForgeFile(file);
      setPastScreens(prev => [...prev.slice(-25), screens]);
      setFutureScreens([]);
      setScreens(project.screens);
      if (project.activeScreenId) setActiveScreenId(project.activeScreenId);
      if (project.theme) setTheme(project.theme);
      if (project.customSounds) setCustomSounds(project.customSounds);
      if (project.customAnimations) setCustomAnimations(project.customAnimations);
      soundEngine.playProceduralSound('chime');
      setToastMessage('¡Proyecto .forge cargado con éxito!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error al abrir archivo .forge: ' + err.message);
    }
  };

  // Handle Global Theme Toggle (Dark / Light)
  const handleToggleThemeMode = () => {
    const nextMode = currentThemeMode === 'dark' ? 'light' : 'dark';
    setCurrentThemeMode(nextMode);
    soundEngine.playProceduralSound('switch');
    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);
    setScreens(prevScreens => prevScreens.map(s => swapScreenTheme(s, nextMode)));
    setToastMessage(`Modo ${nextMode === 'dark' ? 'Oscuro' : 'Claro'} aplicado a todas las pantallas.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle AI Generated Screen
  const handleAiScreenGenerated = (newScreen: ScreenDefinition) => {
    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);
    setScreens(prev => [...prev, newScreen]);
    setActiveScreenId(newScreen.id);
    setSelectedNodeId(null);
    setToastMessage(`Pantalla IA "${newScreen.name}" generada e insertada.`);
    setTimeout(() => setToastMessage(null), 3000);
  };


  // Dynamically inject custom animation keyframes into document head
  useEffect(() => {
    injectCustomAnimationStyles(customAnimations);
  }, [customAnimations]);

  // Get active screen and its nodes with robust fallback
  const currentScreen = (screens && screens.length > 0)
    ? (screens.find(s => s.id === activeScreenId) || screens[0])
    : INITIAL_PROJECT_SCREENS[0];
    
  const nodes = currentScreen && currentScreen.rootNode ? [currentScreen.rootNode] : [INITIAL_PROJECT_SCREENS[0].rootNode];

  // Helper to mutate nodes on the active screen with Undo/Redo history
  const setNodes = (updateFn: (prev: DesignNode[]) => DesignNode[]) => {
    setPastScreens(prevPast => [...prevPast.slice(-25), screens]);
    setFutureScreens([]);

    setScreens(prevScreens => {
      const activeId = activeScreenId || (prevScreens[0] ? prevScreens[0].id : 'screen-home');
      return prevScreens.map(s => {
        if (s.id === activeId && s.rootNode) {
          const updatedNodes = updateFn([s.rootNode]);
          return {
            ...s,
            rootNode: (updatedNodes && updatedNodes[0]) ? updatedNodes[0] : s.rootNode
          };
        }
        return s;
      });
    });
  };

  // Undo Handler
  const handleUndo = () => {
    if (pastScreens.length === 0) return;
    const previous = pastScreens[pastScreens.length - 1];
    const newPast = pastScreens.slice(0, -1);
    setFutureScreens(prevFuture => [screens, ...prevFuture]);
    setPastScreens(newPast);
    setScreens(previous);
    soundEngine.playProceduralSound('pop');
  };

  // Redo Handler
  const handleRedo = () => {
    if (futureScreens.length === 0) return;
    const next = futureScreens[0];
    const newFuture = futureScreens.slice(1);
    setPastScreens(prevPast => [...prevPast, screens]);
    setFutureScreens(newFuture);
    setScreens(next);
    soundEngine.playProceduralSound('pop');
  };

  // Keyboard Shortcuts for Undo & Redo (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input, textarea or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pastScreens, futureScreens, screens]);

  // Apply Pre-designed UI Template
  const handleApplyTemplate = (template: ProjectTemplate) => {
    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);
    setScreens(template.screens);
    setActiveScreenId(template.screens[0].id);
    setSelectedNodeId(null);
    setToastMessage(`Plantilla "${template.name}" cargada con éxito.`);
    soundEngine.playProceduralSound('chime');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export High-Resolution PNG Snapshot of the Mockup
  const handleExportPng = async () => {
    const node = document.getElementById('device-mockup-frame');
    if (!node) {
      alert('Marco de dispositivo no encontrado.');
      return;
    }

    try {
      soundEngine.playProceduralSound('chime');
      setToastMessage('Generando captura PNG...');
      const dataUrl = await toPng(node, {
        quality: 0.95,
        pixelRatio: 2, // High DPI capture
        filter: (childNode) => {
          // Exclude comments or drawing tool overlays if any
          const element = childNode as HTMLElement;
          if (element.classList && element.classList.contains('exclude-from-capture')) {
            return false;
          }
          return true;
        }
      });

      const link = document.createElement('a');
      const sanitizedName = (currentScreen.name || 'mockup').toLowerCase().replace(/[^a-z0-9]/gi, '-');
      link.download = `${sanitizedName}-${deviceMode}-mockup.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage('¡Captura PNG descargada con éxito!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      alert('Error al exportar PNG: ' + String(err));
    }
  };

  // Export Individual Element / Node as isolated PNG Asset
  const handleExportNodePng = async (nodeId: string, nodeName: string) => {
    const el = document.getElementById(nodeId);
    if (!el) {
      alert('No se encontró el elemento en el lienzo para exportar.');
      return;
    }

    try {
      soundEngine.playProceduralSound('chime');
      setToastMessage(`Exportando "${nodeName}" como asset PNG...`);
      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 3, // Ultra-sharp asset capture
        filter: (child) => {
          const dom = child as HTMLElement;
          if (dom.classList && dom.classList.contains('exclude-from-capture')) return false;
          return true;
        }
      });

      const link = document.createElement('a');
      const sanitized = nodeName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
      link.download = `${sanitized}-asset.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage(`¡Asset "${nodeName}.png" exportado con éxito!`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Error al exportar asset PNG:', err);
      alert('Error al exportar asset PNG: ' + String(err));
    }
  };

  // Export Complete React + Vite + Tailwind Project as ZIP
  const handleExportReactProject = async () => {
    try {
      soundEngine.playProceduralSound('chime');
      setToastMessage('Generando proyecto React + Vite...');
      const blob = await exportFullViteReactProject(screens, theme);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `designforge-react-vite-project.zip`;
      link.click();
      URL.revokeObjectURL(url);

      const currentLic = loadUserLicense();
      const updatedLic = recordExportUsed(currentLic);
      setUserLicense(updatedLic);

      setToastMessage('¡Proyecto React + Vite exportado con éxito!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error al exportar proyecto React:', err);
      alert('Error al exportar proyecto React: ' + String(err));
    }
  };

  // Find selected node in recursive tree
  const findNode = (id: string, list: DesignNode[]): DesignNode | null => {
    for (const n of list) {
      if (n.id === id) return n;
      if (n.children) {
        const found = findNode(id, n.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNode(selectedNodeId, nodes) : null;

  // Immutably update style property
  const handleUpdateStyle = (nodeId: string, styleKey: string, value: string) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            styles: {
              ...n.styles,
              [styleKey]: value,
            },
          };
        }
        if (n.children) {
          return {
            ...n,
            children: updateRecursive(n.children),
          };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Immutably update multiple style properties at once
  const handleUpdateMultipleStyles = (nodeId: string, updates: Record<string, string>) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            styles: {
              ...n.styles,
              ...updates,
            },
          };
        }
        if (n.children) {
          return {
            ...n,
            children: updateRecursive(n.children),
          };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Immutably update sound triggers
  const handleUpdateSound = (
    nodeId: string,
    trigger: 'onClick' | 'onHover',
    soundType: string | undefined
  ) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            sounds: {
              ...n.sounds,
              [trigger]: soundType,
            },
          };
        }
        if (n.children) {
          return {
            ...n,
            children: updateRecursive(n.children),
          };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Immutably update text content
  const handleUpdateContent = (nodeId: string, content: string) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return { ...n, content };
        }
        if (n.children) {
          return { ...n, children: updateRecursive(n.children) };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Immutably update arbitrary node property (iconName, imageUrl, etc.)
  const handleUpdateProperty = (nodeId: string, key: keyof DesignNode, value: any) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return { ...n, [key]: value };
        }
        if (n.children) {
          return { ...n, children: updateRecursive(n.children) };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Immutably update interactive action flow (escalera de acciones)
  const handleUpdateAction = (nodeId: string, action: DesignNode['action']) => {
    const updateRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === nodeId) {
          return { ...n, action };
        }
        if (n.children) {
          return { ...n, children: updateRecursive(n.children) };
        }
        return n;
      });
    };
    setNodes(prev => updateRecursive(prev));
  };

  // Add a new element either to root or inside targeted container
  const handleAddNode = (type: DesignNode['type'], parentId?: string) => {
    const newId = `${type}-${Date.now().toString().slice(-4)}`;
    let defaultNode: DesignNode;

    if (type === 'button') {
      defaultNode = {
        id: newId,
        name: 'Nuevo Botón',
        type: 'button',
        content: 'Presionar',
        styles: {
          backgroundColor: '#6366f1',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          animation: 'none',
          hoverScale: true,
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else if (type === 'text') {
      defaultNode = {
        id: newId,
        name: 'Nuevo Texto',
        type: 'text',
        content: 'Nuevo Texto o Título',
        styles: {
          color: '#e2e8f0',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Inter',
        },
      };
    } else if (type === 'card') {
      defaultNode = {
        id: newId,
        name: 'Tarjeta Box',
        type: 'card',
        styles: {
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '16px',
          borderWidth: '1px',
          borderColor: '#334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        },
        children: [
          {
            id: `text-${Date.now().toString().slice(-4)}`,
            name: 'Título de Tarjeta',
            type: 'text',
            content: 'Título de la Sección',
            styles: {
              fontSize: '14px',
              fontWeight: '700',
              color: '#ffffff',
            },
          },
        ],
      };
    } else if (type === 'input') {
      defaultNode = {
        id: newId,
        name: 'Input de Texto',
        type: 'input',
        content: '',
        placeholder: 'Introduce tu correo o contraseña...',
        styles: {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '10px 14px',
          borderRadius: '10px',
          borderWidth: '1px',
          borderColor: '#334155',
          fontSize: '13px',
          width: '100%',
        },
      };
    } else if (type === 'switch') {
      defaultNode = {
        id: newId,
        name: 'Interruptor Switch',
        type: 'switch',
        content: 'Notificaciones Activas',
        checked: true,
        styles: {
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          borderWidth: '1px',
          borderColor: '#334155',
        },
        sounds: {
          onClick: 'switch',
        },
        action: {
          type: 'toggle_state',
        },
      };
    } else if (type === 'image') {
      defaultNode = {
        id: newId,
        name: 'Imagen / Asset PNG',
        type: 'image',
        styles: {
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
          height: '180px',
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else if (type === 'avatar') {
      defaultNode = {
        id: newId,
        name: 'Perfil Usuario',
        type: 'avatar',
        content: 'Sarah Connor',
        styles: {
          backgroundColor: '#1e293b',
          padding: '10px 14px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else if (type === 'badge') {
      defaultNode = {
        id: newId,
        name: 'Insignia Badge',
        type: 'badge',
        content: '★ PRO',
        styles: {
          backgroundColor: '#ec4899',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '10px',
          fontWeight: '700',
        },
        sounds: {
          onClick: 'click',
        },
      };
    } else if (type === 'navbar') {
      defaultNode = {
        id: newId,
        name: 'Barra de Navegación',
        type: 'navbar',
        content: 'Explorar Tienda',
        styles: {
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else if (type === 'tabbar') {
      defaultNode = {
        id: newId,
        name: 'Pestañas Inferiores',
        type: 'tabbar',
        styles: {
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '12px 16px',
          borderRadius: '18px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
        sounds: {
          onClick: 'click',
        },
      };
    } else if (type === 'searchbar') {
      defaultNode = {
        id: newId,
        name: 'Barra de Búsqueda',
        type: 'searchbar',
        placeholder: 'Buscar productos, diseñadores...',
        styles: {
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'click',
        },
      };
    } else if (type === 'slider') {
      defaultNode = {
        id: newId,
        name: 'Control Slider',
        type: 'slider',
        content: 'Volumen Master',
        value: 75,
        styles: {
          backgroundColor: '#1e293b',
          padding: '12px 14px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'switch',
        },
      };
    } else if (type === 'segmented') {
      defaultNode = {
        id: newId,
        name: 'Selector Segmentado',
        type: 'segmented',
        options: ['Mensual', 'Semestral', 'Anual'],
        styles: {
          backgroundColor: '#0f172a',
          padding: '4px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'switch',
        },
      };
    } else if (type === 'metric') {
      defaultNode = {
        id: newId,
        name: 'Tarjeta de Métrica KPI',
        type: 'metric',
        content: 'Ingresos Mensuales',
        secondaryContent: '$124,500 USD',
        styles: {
          backgroundColor: '#1e293b',
          padding: '14px 16px',
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else if (type === 'progress') {
      defaultNode = {
        id: newId,
        name: 'Barra de Progreso',
        type: 'progress',
        content: 'Meta de Recaudación',
        value: 84,
        styles: {
          backgroundColor: '#1e293b',
          padding: '12px 14px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: {
          onClick: 'switch',
        },
      };
    } else if (type === 'divider') {
      defaultNode = {
        id: newId,
        name: 'Separador Divisor',
        type: 'divider',
        content: 'O CONTINUAR CON',
        styles: {
          padding: '8px 0px',
          width: '100%',
        },
      };
    } else if (type === 'icon_button') {
      defaultNode = {
        id: newId,
        name: 'Botón de Icono',
        type: 'icon_button',
        iconName: 'Sparkles',
        styles: {
          backgroundColor: '#1e293b',
          color: '#818cf8',
          padding: '10px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'fab') {
      defaultNode = {
        id: newId,
        name: 'FAB Flotante',
        type: 'fab',
        content: 'Nuevo',
        iconName: 'Plus',
        styles: {
          backgroundColor: '#6366f1',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
        },
        sounds: { onClick: 'pop' },
      };
    } else if (type === 'toggle_button') {
      defaultNode = {
        id: newId,
        name: 'Botón de Alternancia',
        type: 'toggle_button',
        options: ['Lista', 'Cuadrícula'],
        styles: {
          backgroundColor: '#0f172a',
          padding: '4px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
        },
        sounds: { onClick: 'switch' },
      };
    } else if (type === 'hyperlink') {
      defaultNode = {
        id: newId,
        name: 'Enlace Web',
        type: 'hyperlink',
        content: 'Aprender más sobre DesignForge',
        styles: {
          color: '#60a5fa',
          fontSize: '13px',
          padding: '4px 0px',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'textarea') {
      defaultNode = {
        id: newId,
        name: 'Área de Texto',
        type: 'textarea',
        content: 'Descripción Detallada',
        placeholder: 'Escribe aquí tu mensaje o especificaciones...',
        styles: {
          width: '100%',
          padding: '4px 0px',
        },
      };
    } else if (type === 'checkbox') {
      defaultNode = {
        id: newId,
        name: 'Casilla de Verificación',
        type: 'checkbox',
        content: 'Recordar mis preferencias en esta sesión',
        checked: true,
        styles: {
          padding: '8px 0px',
        },
        sounds: { onClick: 'switch' },
      };
    } else if (type === 'radio') {
      defaultNode = {
        id: newId,
        name: 'Botón de Opción (Radio)',
        type: 'radio',
        content: 'Plan Anual con 20% de descuento',
        checked: true,
        styles: {
          padding: '8px 0px',
        },
        sounds: { onClick: 'switch' },
      };
    } else if (type === 'select') {
      defaultNode = {
        id: newId,
        name: 'Menú Desplegable',
        type: 'select',
        content: 'Selecciona una categoría...',
        options: ['Tecnología', 'Diseño', 'Finanzas', 'Marketing'],
        styles: {
          backgroundColor: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'calendar') {
      defaultNode = {
        id: newId,
        name: 'Calendario Mensual Interactivo',
        type: 'calendar',
        content: 'Septiembre 2026',
        styles: {
          backgroundColor: '#090e1a',
          padding: '16px',
          borderRadius: '20px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
        sounds: { onClick: 'chime' },
      };
    } else if (type === 'counter') {
      defaultNode = {
        id: newId,
        name: 'Contador Numérico Stepper',
        type: 'counter',
        content: 'Unidades:',
        value: 1,
        styles: {
          backgroundColor: '#0f172a',
          padding: '10px 14px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'pop' },
      };
    } else if (type === 'countdown') {
      defaultNode = {
        id: newId,
        name: 'Cuenta Regresiva HUD',
        type: 'countdown',
        content: 'LANZAMIENTO VIP EN VIVO',
        secondaryContent: '⚡ Código promocional disponible al expirar',
        styles: {
          backgroundColor: '#0f172a',
          padding: '16px',
          borderRadius: '20px',
          borderWidth: '1px',
          borderColor: '#4338ca',
          width: '100%',
        },
        sounds: { onClick: 'whoosh' },
      };
    } else if (type === 'datepicker') {
      defaultNode = {
        id: newId,
        name: 'Selector de Fecha y Hora',
        type: 'datepicker',
        content: '14 Octubre 2026 - 10:00 AM',
        styles: {
          backgroundColor: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'pop' },
      };
    } else if (type === 'colorpicker') {
      defaultNode = {
        id: newId,
        name: 'Selector de Color',
        type: 'colorpicker',
        content: 'Color de Acento',
        styles: {
          backgroundColor: '#6366f1',
          padding: '8px 12px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'file_uploader') {
      defaultNode = {
        id: newId,
        name: 'Cargador de Archivos',
        type: 'file_uploader',
        content: 'Arrastra tus archivos de diseño aquí',
        styles: {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          padding: '24px 16px',
          borderRadius: '16px',
          width: '100%',
        },
        sounds: { onClick: 'whoosh' },
      };
    } else if (type === 'chips_input') {
      defaultNode = {
        id: newId,
        name: 'Campos de Fichas (Chips)',
        type: 'chips_input',
        options: ['UI/UX', 'Figma', 'Material Design', 'React'],
        styles: {
          backgroundColor: '#0f172a',
          padding: '8px',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'pop' },
      };
    } else if (type === 'modal') {
      defaultNode = {
        id: newId,
        name: 'Ventana Modal Dialog',
        type: 'modal',
        content: 'Confirmar Eliminación',
        secondaryContent: '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
        styles: {
          backgroundColor: '#0f172a',
          padding: '18px',
          borderRadius: '20px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'alert' },
      };
    } else if (type === 'sheet') {
      defaultNode = {
        id: newId,
        name: 'Hoja Lateral (Sheet)',
        type: 'sheet',
        content: 'Filtros Avanzados',
        secondaryContent: 'Ajusta los parámetros de búsqueda, rango de precios y categorías.',
        styles: {
          backgroundColor: '#1e293b',
          padding: '16px',
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'whoosh' },
      };
    } else if (type === 'accordion') {
      defaultNode = {
        id: newId,
        name: 'Acordeón Colapsable',
        type: 'accordion',
        content: 'Preguntas Frecuentes: Licencias',
        secondaryContent: 'Nuestras licencias cubren proyectos personales y comerciales de forma ilimitada.',
        styles: {
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#334155',
          width: '100%',
        },
        sounds: { onClick: 'switch' },
      };
    } else if (type === 'carousel') {
      defaultNode = {
        id: newId,
        name: 'Contenedor Desplazable (Carrusel)',
        type: 'carousel',
        styles: {
          padding: '8px 0px',
          width: '100%',
        },
        sounds: { onClick: 'whoosh' },
      };
    } else if (type === 'sidebar') {
      defaultNode = {
        id: newId,
        name: 'Menú Lateral (Sidebar)',
        type: 'sidebar',
        content: 'Navegación Principal',
        styles: {
          backgroundColor: '#0f172a',
          padding: '16px 12px',
          borderRadius: '18px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
        sounds: { onClick: 'pop' },
      };
    } else if (type === 'footer') {
      defaultNode = {
        id: newId,
        name: 'Pie de Página (Footer)',
        type: 'footer',
        content: '© 2026 DesignForge Studio Inc. Construido con pasión para diseñadores.',
        styles: {
          backgroundColor: '#0b0f19',
          padding: '20px 16px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
      };
    } else if (type === 'breadcrumbs') {
      defaultNode = {
        id: newId,
        name: 'Migas de Pan (Breadcrumbs)',
        type: 'breadcrumbs',
        content: 'Configuración de Cuenta',
        styles: {
          padding: '6px 0px',
          width: '100%',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'pagination') {
      defaultNode = {
        id: newId,
        name: 'Control de Paginación',
        type: 'pagination',
        styles: {
          padding: '8px 0px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'spinner') {
      defaultNode = {
        id: newId,
        name: 'Indicador de Carga (Spinner)',
        type: 'spinner',
        styles: {
          display: 'flex',
          justifyContent: 'center',
          padding: '16px',
          width: '100%',
        },
      };
    } else if (type === 'skeleton') {
      defaultNode = {
        id: newId,
        name: 'Marcador Skeleton Screen',
        type: 'skeleton',
        styles: {
          width: '100%',
          padding: '12px',
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: '#1e293b',
        },
      };
    } else if (type === 'toast') {
      defaultNode = {
        id: newId,
        name: 'Notificación Toast',
        type: 'toast',
        content: 'Cambios guardados automáticamente en la nube',
        styles: {
          backgroundColor: '#0f172a',
          padding: '12px 16px',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          width: '100%',
        },
        sounds: { onClick: 'chime' },
      };
    } else if (type === 'banner') {
      defaultNode = {
        id: newId,
        name: 'Mensaje de Línea (Banner)',
        type: 'banner',
        content: 'Actualización disponible: DesignForge v3.2 ya está lista para instalar.',
        styles: {
          width: '100%',
        },
        sounds: { onClick: 'bell' },
      };
    } else if (type === 'tooltip') {
      defaultNode = {
        id: newId,
        name: 'Información Tooltip',
        type: 'tooltip',
        content: 'Atajo de teclado: Ctrl + Shift + P para paleta rápida',
        styles: {
          padding: '4px 0px',
        },
      };
    } else if (type === 'table') {
      defaultNode = {
        id: newId,
        name: 'Tabla de Datos',
        type: 'table',
        styles: {
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
        sounds: { onClick: 'click' },
      };
    } else if (type === 'media_player') {
      defaultNode = {
        id: newId,
        name: 'Reproductor Multimedia',
        type: 'media_player',
        content: 'Demo Synth Wave UI Sound',
        styles: {
          backgroundColor: '#0f172a',
          padding: '14px',
          borderRadius: '18px',
          borderWidth: '1px',
          borderColor: '#1e293b',
          width: '100%',
        },
        sounds: { onClick: 'pop' },
      };

    } else if (type === 'vector') {
      defaultNode = {
        id: newId,
        name: 'Forma Vectorial',
        type: 'vector',
        svgPath: 'M 100 80 L 220 80 L 160 180 Z',
        styles: {
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          borderWidth: '2px',
          width: '100%',
          height: '140px',
          borderRadius: '16px',
          padding: '12px',
        },
        sounds: {
          onClick: 'pop',
        },
      };
    } else {
      defaultNode = {
        id: newId,
        name: 'Contenedor',
        type: 'container',
        styles: {
          padding: '12px',
          display: 'flex',
          gap: '8px',
        },
        children: [],
      };
    }

    soundEngine.playProceduralSound('pop');

    // Insert into selected container or root
    const targetParent = parentId || currentScreen.rootNode.id;
    const insertRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === targetParent) {
          return {
            ...n,
            children: [...(n.children || []), defaultNode],
          };
        }
        if (n.children) {
          return {
            ...n,
            children: insertRecursive(n.children),
          };
        }
        return n;
      });
    };

    setNodes(prev => insertRecursive(prev));
    setSelectedNodeId(defaultNode.id);
  };

  // Delete node by ID (preserving root)
  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === currentScreen.rootNode.id) {
      alert('La ventana o pantalla principal no se puede eliminar directamente.');
      return;
    }

    soundEngine.playProceduralSound('switch');

    const deleteRecursive = (list: DesignNode[]): DesignNode[] => {
      return list
        .filter(n => n.id !== nodeId)
        .map(n => {
          if (n.children) {
            return {
              ...n,
              children: deleteRecursive(n.children),
            };
          }
          return n;
        });
    };

    setNodes(prev => deleteRecursive(prev));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Reorder nodes hierarchically
  const handleReorderNodes = (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    soundEngine.playProceduralSound('switch');

    setNodes(prev => {
      let extractedNode: DesignNode | null = null;

      // 1. Remove dragged node
      const removeNode = (list: DesignNode[]): DesignNode[] => {
        const result: DesignNode[] = [];
        for (const item of list) {
          if (item.id === draggedId) {
            extractedNode = item;
          } else {
            const copy = { ...item };
            if (copy.children) {
              copy.children = removeNode(copy.children);
            }
            result.push(copy);
          }
        }
        return result;
      };

      const treeWithoutDragged = removeNode(prev);
      if (!extractedNode) return prev;

      // 2. Insert at target position
      const insertAtTarget = (list: DesignNode[]): DesignNode[] => {
        const result: DesignNode[] = [];
        for (const item of list) {
          if (item.id === targetId) {
            if (position === 'before') {
              result.push(extractedNode!);
              result.push(item);
            } else if (position === 'after') {
              result.push(item);
              result.push(extractedNode!);
            } else if (position === 'inside') {
              const updatedItem = {
                ...item,
                children: [...(item.children || []), extractedNode!],
              };
              result.push(updatedItem);
            }
          } else {
            const copy = { ...item };
            if (copy.children) {
              copy.children = insertAtTarget(copy.children);
            }
            result.push(copy);
          }
        }
        return result;
      };

      return insertAtTarget(treeWithoutDragged);
    });
  };

  // Reorder node in array depth (Front, Back, Forward, Backward)
  const handleMoveDepth = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    if (!selectedNodeId || selectedNodeId === currentScreen.rootNode.id) return;

    soundEngine.playProceduralSound('pop');

    setNodes(prev => {
      const moveInChildren = (list: DesignNode[]): DesignNode[] => {
        const index = list.findIndex(item => item.id === selectedNodeId);
        if (index !== -1) {
          const newList = [...list];
          const [target] = newList.splice(index, 1);
          if (direction === 'front') {
            newList.push(target); // End of array renders on top
          } else if (direction === 'back') {
            newList.unshift(target); // Beginning of array renders beneath
          } else if (direction === 'forward') {
            const newIndex = Math.min(newList.length, index + 1);
            newList.splice(newIndex, 0, target);
          } else if (direction === 'backward') {
            const newIndex = Math.max(0, index - 1);
            newList.splice(newIndex, 0, target);
          }
          return newList;
        }

        return list.map(item => {
          if (item.children) {
            return { ...item, children: moveInChildren(item.children) };
          }
          return item;
        });
      };

      return moveInChildren(prev);
    });
  };

  // Convert an element into a Master Component ❖
  const handleConvertToMaster = (nodeId: string) => {
    const target = findNode(nodeId, nodes);
    if (!target) return;
    const masterCopy: DesignNode = JSON.parse(JSON.stringify(target));
    masterCopy.isMasterComponent = true;
    setMasterComponents(prev => [...prev.filter(m => m.id !== nodeId), masterCopy]);
    handleUpdateProperty(nodeId, 'isMasterComponent', true);
    setToastMessage(`Componente "${target.name}" convertido en Maestro ❖`);
    soundEngine.playProceduralSound('chime');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Instantiate a Master Component into active screen
  const handleInstantiateMaster = (master: DesignNode) => {
    const instance: DesignNode = JSON.parse(JSON.stringify(master));
    instance.id = `${master.type}-${Date.now().toString().slice(-4)}`;
    instance.isMasterComponent = false;
    instance.masterComponentId = master.id;

    // Helper to generate new ids for all children
    const renewIds = (node: DesignNode) => {
      if (node.children) {
        node.children = node.children.map(child => {
          const newChild = { ...child, id: `${child.type}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}` };
          renewIds(newChild);
          return newChild;
        });
      }
    };
    renewIds(instance);

    const targetParent = selectedNodeId || currentScreen.rootNode.id;
    const insertRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === targetParent) {
          return {
            ...n,
            children: [...(n.children || []), instance],
          };
        }
        if (n.children) {
          return {
            ...n,
            children: insertRecursive(n.children),
          };
        }
        return n;
      });
    };

    setNodes(prev => insertRecursive(prev));
    setSelectedNodeId(instance.id);
    setToastMessage(`Instancia de "${master.name}" creada ❖`);
    soundEngine.playProceduralSound('pop');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Execute interactive action (Live Testing Mode)
  const handleExecuteAction = (action: DesignNode['action']) => {
    if (!action || action.type === 'none') return;

    if (action.type === 'navigate' && action.targetScreenId) {
      const target = screens.find(s => s.id === action.targetScreenId);
      if (target) {
        soundEngine.playProceduralSound('whoosh');
        const transitionType = action.transition || 'fade';
        if (transitionType === 'slide') {
          setScreenTransitionClass('transition-screen-slide');
        } else if (transitionType === 'fade') {
          setScreenTransitionClass('transition-screen-fade');
        } else {
          setScreenTransitionClass('');
        }
        setScreenHistory(prev => [...prev, action.targetScreenId!]);
        setActiveScreenId(action.targetScreenId);
        setTimeout(() => setScreenTransitionClass(''), 400);
      } else {
        alert(`La pantalla destino "${action.targetScreenId}" no existe.`);
      }
    } else if (action.type === 'back') {
      soundEngine.playProceduralSound('switch');
      if (screenHistory.length > 1) {
        const newHistory = [...screenHistory];
        newHistory.pop(); // Remove current screen
        const prevScreenId = newHistory[newHistory.length - 1];
        setScreenTransitionClass('transition-screen-slide');
        setScreenHistory(newHistory);
        setActiveScreenId(prevScreenId);
        setTimeout(() => setScreenTransitionClass(''), 400);
      } else {
        setToastMessage('Ya estás en la pantalla inicial.');
        setTimeout(() => setToastMessage(null), 2000);
      }
    } else if (action.type === 'scroll_to_top') {
      soundEngine.playProceduralSound('whoosh');
      const viewport = document.querySelector('.viewport, [class*="overflow-y-auto"]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setToastMessage('⬆️ Desplazado arriba');
      setTimeout(() => setToastMessage(null), 1500);
    } else if (action.type === 'sound_fx') {
      const sfx = action.soundEffect || 'chime';
      soundEngine.playProceduralSound(sfx);
    } else if (action.type === 'download_file') {
      soundEngine.playProceduralSound('chime');
      const filename = action.fileName || 'recurso.txt';
      const content = action.fileContent || 'Exportado desde DesignForge.';
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setToastMessage(`Descargando "${filename}"...`);
      setTimeout(() => setToastMessage(null), 2500);
    } else if (action.type === 'toggle_theme') {
      soundEngine.playProceduralSound('pop');
      const isCurrentlyDark = theme.backgroundColor.startsWith('#0') || theme.backgroundColor.startsWith('#1');
      const newTheme: ProjectTheme = isCurrentlyDark ? {
        name: 'Modo Claro',
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5',
        backgroundColor: '#f8fafc',
        cardColor: '#ffffff',
        textColor: '#0f172a',
        mutedColor: '#64748b',
        borderRadius: theme.borderRadius,
      } : {
        name: 'Modo Oscuro',
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
        backgroundColor: '#0f172a',
        cardColor: '#1e293b',
        textColor: '#f8fafc',
        mutedColor: '#94a3b8',
        borderRadius: theme.borderRadius,
      };
      setTheme(newTheme);
      handlePropagateThemeToAllNodes(newTheme);
      setToastMessage(`Tema cambiado a ${newTheme.name}`);
      setTimeout(() => setToastMessage(null), 2000);
    } else if (action.type === 'confetti') {
      soundEngine.playProceduralSound('chime');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (action.type === 'modal') {
      soundEngine.playProceduralSound('pop');
      setActiveModal({
        title: action.modalTitle || 'Diálogo Interactivo',
        content: action.modalContent || 'Mensaje del diálogo emergente.',
      });
    } else if (action.type === 'copy_clipboard') {
      soundEngine.playProceduralSound('chime');
      if (action.clipboardText) {
        navigator.clipboard.writeText(action.clipboardText);
      }
      setToastMessage('¡Copiado al portapapeles!');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (action.type === 'alert') {
      alert(action.alertMessage || '¡Acción interactiva disparada!');
    } else if (action.type === 'link' && action.url) {
      window.open(action.url, '_blank');
    }
  };

  // Create a brand new screen/window
  const handleAddScreen = () => {
    const screenIndex = screens.length + 1;
    const newScreenId = `screen-${Date.now().toString().slice(-4)}`;
    const newScreen: ScreenDefinition = {
      id: newScreenId,
      name: `Ventana ${screenIndex}`,
      rootNode: {
        id: `root-${newScreenId}`,
        name: `Ventana ${screenIndex} Root`,
        type: 'container',
        styles: {
          backgroundColor: '#090d16',
          color: '#f8fafc',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          height: '100%',
        },
        children: [
          {
            id: `header-${newScreenId}`,
            name: 'Barra Superior',
            type: 'container',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              borderWidth: '1px',
              borderColor: '#334155',
            },
            children: [
              {
                id: `back-btn-${newScreenId}`,
                name: 'Botón Volver',
                type: 'button',
                content: '← Volver',
                styles: {
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                },
                sounds: { onClick: 'switch' },
                action: { type: 'navigate', targetScreenId: screens[0]?.id },
              },
              {
                id: `title-${newScreenId}`,
                name: 'Título Ventana',
                type: 'text',
                content: `Nueva Ventana ${screenIndex}`,
                styles: {
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#ffffff',
                },
              },
            ],
          },
          {
            id: `card-${newScreenId}`,
            name: 'Contenedor Principal',
            type: 'card',
            styles: {
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              padding: '20px',
              borderWidth: '1px',
              borderColor: '#334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            },
            children: [
              {
                id: `text-desc-${newScreenId}`,
                name: 'Descripción',
                type: 'text',
                content: 'Esta es una nueva ventana en blanco conectada al flujo interactivo. Arrastra componentes aquí para diseñarla.',
                styles: { color: '#94a3b8', fontSize: '13px' },
              },
            ],
          },
        ],
      },
    };

    soundEngine.playProceduralSound('chime');
    setScreens(prev => [...prev, newScreen]);
    setActiveScreenId(newScreenId);
  };

  // Rename screen
  const handleRenameScreen = (screenId: string, newName: string) => {
    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);
    setScreens(prev => prev.map(s => s.id === screenId ? { ...s, name: newName } : s));
    soundEngine.playProceduralSound('pop');
    setToastMessage(`Pantalla renombrada a "${newName}"`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Delete screen (supports deleting any screen while keeping at least 1)
  const handleDeleteScreen = (screenId: string) => {
    if (screens.length <= 1) {
      alert('El proyecto debe contener al menos 1 pantalla activa.');
      return;
    }
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta pantalla y todos sus componentes?');
    if (!confirmed) return;

    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);

    const remainingScreens = screens.filter(s => s.id !== screenId);
    setScreens(remainingScreens);

    // If active screen was deleted, switch to the first remaining screen
    if (activeScreenId === screenId) {
      setActiveScreenId(remainingScreens[0].id);
      setSelectedNodeId(null);
    }
    soundEngine.playProceduralSound('pop');
    setToastMessage('Pantalla eliminada del proyecto.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Duplicate screen
  const handleDuplicateScreen = (screenId: string) => {
    const target = screens.find(s => s.id === screenId);
    if (!target) return;

    setPastScreens(prev => [...prev.slice(-25), screens]);
    setFutureScreens([]);

    const newScreenId = `screen-${Date.now().toString().slice(-4)}`;
    const cloned = JSON.parse(JSON.stringify(target)) as ScreenDefinition;
    cloned.id = newScreenId;
    cloned.name = `${target.name} (Copia)`;

    // Re-generate root ID
    const reId = (node: DesignNode) => {
      node.id = `node-${Math.random().toString(36).substr(2, 7)}`;
      if (node.children) node.children.forEach(reId);
    };
    reId(cloned.rootNode);

    setScreens(prev => [...prev, cloned]);
    setActiveScreenId(newScreenId);
    soundEngine.playProceduralSound('chime');
    setToastMessage(`Pantalla duplicada: "${cloned.name}"`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Propagate global design system tokens to all nodes in all screens
  const handlePropagateThemeToAllNodes = (newTheme: ProjectTheme) => {
    const propagateToTree = (node: DesignNode): DesignNode => {
      const updated = { ...node, styles: { ...node.styles } };

      if (node.type === 'container' && node.id.includes('root')) {
        updated.styles.backgroundColor = newTheme.backgroundColor;
      } else if (node.type === 'button') {
        updated.styles.backgroundColor = newTheme.primaryColor;
        updated.styles.borderRadius = newTheme.borderRadius;
      } else if (node.type === 'card' || node.type === 'navbar' || node.type === 'metric') {
        updated.styles.backgroundColor = newTheme.cardColor;
        updated.styles.borderRadius = newTheme.borderRadius;
      }

      if (node.children) {
        updated.children = node.children.map(propagateToTree);
      }
      return updated;
    };

    setScreens(prev => prev.map(s => ({
      ...s,
      rootNode: propagateToTree(s.rootNode),
    })));
  };

  // Collaboration Canvas Comments Handlers
  const handleAddComment = (newComment: CanvasComment) => {
    setComments(prev => [...prev, newComment]);
  };

  const handleResolveComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  };

  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  // Mass apply sound effect
  const handleApplySoundToAllButtons = (soundType: string) => {
    const applyRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        const updated = { ...n };
        if (n.type === 'button') {
          updated.sounds = { ...updated.sounds, onClick: soundType };
        }
        if (n.children) {
          updated.children = applyRecursive(n.children);
        }
        return updated;
      });
    };
    setNodes(prev => applyRecursive(prev));
  };

  // Export ZIP handler
  const handleExportZip = async () => {
    try {
      soundEngine.playProceduralSound('chime');
      await exportProjectZip(nodes, theme);
      const currentLic = loadUserLicense();
      const updatedLic = recordExportUsed(currentLic);
      setUserLicense(updatedLic);
    } catch (e) {
      alert('Error exporting project ZIP: ' + String(e));
    }
  };

  // Show donation modal before export (export is always free)
  const handleRequestExportReact = () => {
    setPendingExportAction('react');
    setIsPaywallOpen(true);
  };

  const handleRequestExportZip = () => {
    setPendingExportAction('zip');
    setIsPaywallOpen(true);
  };

  const handleDonationProceedExport = () => {
    if (pendingExportAction === 'react') {
      handleExportReactProject();
    } else if (pendingExportAction === 'zip') {
      handleExportZip();
    }
    setPendingExportAction(null);
  };

  // Import ZIP handler
  const handleImportZip = async (file: File) => {
    try {
      soundEngine.playProceduralSound('switch');
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(file);
      const themeFile = zip.file('theme.json');
      if (themeFile) {
        const text = await themeFile.async('text');
        const data = JSON.parse(text);
        if (data.nodes) setNodes(() => data.nodes);
        if (data.theme) setTheme(data.theme);
        alert('¡Proyecto importado con éxito!');
      } else {
        alert('ZIP importado, pero no contiene theme.json.');
      }
    } catch (e) {
      alert('Error al importar ZIP: ' + String(e));
    }
  };

  // Local Natural Language AI Command Executor
  const handleExecuteAiCommand = (command: string): { success: boolean; message: string } => {
    const cmd = command.toLowerCase();

    if (cmd.includes('add button') || cmd.includes('añadir boton') || cmd.includes('agrega un boton') || cmd.includes('crear boton')) {
      handleAddNode('button', selectedNodeId || undefined);
      return { success: true, message: 'Se ha agregado un nuevo botón interactivo.' };
    }

    if (cmd.includes('add card') || cmd.includes('añadir tarjeta') || cmd.includes('crear card') || cmd.includes('agrega una tarjeta')) {
      handleAddNode('card', selectedNodeId || undefined);
      return { success: true, message: 'Se ha agregado una nueva tarjeta contenedor.' };
    }

    if (cmd.includes('add text') || cmd.includes('añadir texto') || cmd.includes('agrega texto')) {
      handleAddNode('text', selectedNodeId || undefined);
      return { success: true, message: 'Se ha agregado un nuevo bloque de texto.' };
    }

    if (cmd.includes('delete') || cmd.includes('eliminar') || cmd.includes('borrar') || cmd.includes('quitar')) {
      if (selectedNodeId && selectedNodeId !== currentScreen.rootNode.id) {
        const idToDelete = selectedNodeId;
        handleDeleteNode(idToDelete);
        return { success: true, message: `Elemento #${idToDelete} eliminado.` };
      }
      return { success: false, message: 'Por favor selecciona primero un elemento para borrarlo.' };
    }

    if (cmd.includes('emerald') || cmd.includes('green') || cmd.includes('verde')) {
      handleUpdateStyle('transfer-button', 'backgroundColor', '#10b981');
      soundEngine.playProceduralSound('pop');
      return { success: true, message: 'Botón actualizado a Verde Esmeralda (#10b981).' };
    }

    if (selectedNodeId) {
      handleUpdateStyle(selectedNodeId, 'backgroundColor', '#8b5cf6');
      soundEngine.playProceduralSound('pop');
      return {
        success: true,
        message: `Estilo aplicado al elemento #${selectedNodeId}.`,
      };
    }

    return {
      success: false,
      message: 'Comando procesado. Selecciona un elemento para modificarlo.',
    };
  };

  // Preset Themes
  const handleApplyPresetTheme = (themeId: string) => {
    if (themeId === 'neon-cyberpunk') {
      handleUpdateStyle('app-root', 'backgroundColor', '#090a0f');
      handleUpdateStyle('header-bar', 'backgroundColor', '#121124');
      handleUpdateStyle('header-bar', 'borderColor', '#ec4899');
      handleApplySoundToAllButtons('switch');
    } else if (themeId === 'emerald-luxury') {
      handleUpdateStyle('app-root', 'backgroundColor', '#06201b');
      handleUpdateStyle('header-bar', 'backgroundColor', '#0b3029');
      handleUpdateStyle('header-bar', 'borderColor', '#10b981');
      handleApplySoundToAllButtons('chime');
    } else if (themeId === 'clean-slate') {
      handleUpdateStyle('app-root', 'backgroundColor', '#0f172a');
      handleApplySoundToAllButtons('pop');
    } else if (themeId === 'sunset-gradient') {
      handleUpdateStyle('app-root', 'backgroundColor', '#1c1018');
      handleApplySoundToAllButtons('bell');
    }
  };

  // Cloud AI Action Handler
  const handleApplyAiAction = (action: any) => {
    if (action.type === 'MODIFY_STYLE' && action.nodeId && action.styleKey && action.value) {
      handleUpdateStyle(action.nodeId, action.styleKey, action.value);
      soundEngine.playProceduralSound('pop');
    } else if (action.type === 'BIND_SOUND' && action.nodeId && action.soundType) {
      handleUpdateSound(action.nodeId, action.trigger || 'onClick', action.soundType);
      soundEngine.playProceduralSound(action.soundType);
    } else if (action.type === 'ADD_NODE' && action.nodeType) {
      handleAddNode(action.nodeType, action.parentId || selectedNodeId || undefined);
    } else if (action.type === 'DELETE_NODE' && action.nodeId) {
      handleDeleteNode(action.nodeId);
    }
  };

  // Insert Vector Node from Vector Studio
  const handleInsertVectorNode = (svgPath: string, name: string) => {
    const newId = `vector-${Date.now().toString().slice(-4)}`;
    const newVectorNode: DesignNode = {
      id: newId,
      name: name || 'Arte Vectorial',
      type: 'vector',
      svgPath: svgPath,
      styles: {
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        borderWidth: '2px',
        borderRadius: '16px',
        padding: '16px',
        width: '100%',
        height: '160px',
      },
      sounds: {
        onClick: 'pop',
      },
    };

    const targetParent = selectedNodeId || currentScreen.rootNode.id;
    const insertRecursive = (list: DesignNode[]): DesignNode[] => {
      return list.map(n => {
        if (n.id === targetParent) {
          return {
            ...n,
            children: [...(n.children || []), newVectorNode],
          };
        }
        if (n.children) {
          return {
            ...n,
            children: insertRecursive(n.children),
          };
        }
        return n;
      });
    };

    setNodes(prev => insertRecursive(prev));
    setSelectedNodeId(newId);
    setToastMessage('¡Elemento vectorial insertado en el lienzo!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Claude Design Targeted Element AI Edit (Comment mode)
  const handleApplyElementAiChange = async (nodeId: string, userPrompt: string) => {
    setIsElementAiLoading(true);
    soundEngine.playProceduralSound('chime');
    try {
      const targetNode = findNode(nodeId, nodes);
      if (!targetNode) {
        setIsElementAiLoading(false);
        return;
      }

      const pLower = userPrompt.toLowerCase();
      // Targeted heuristics applied immediately without modifying whole project
      if (pLower.includes('verde') || pLower.includes('green') || pLower.includes('emerald')) {
        handleUpdateStyle(nodeId, 'backgroundColor', '#10b981');
        handleUpdateStyle(nodeId, 'boxShadow', '0 4px 14px rgba(16, 185, 129, 0.4)');
      } else if (pLower.includes('azul') || pLower.includes('blue') || pLower.includes('indigo')) {
        handleUpdateStyle(nodeId, 'backgroundColor', '#6366f1');
        handleUpdateStyle(nodeId, 'boxShadow', '0 4px 14px rgba(99, 102, 241, 0.4)');
      } else if (pLower.includes('rosa') || pLower.includes('pink') || pLower.includes('morado') || pLower.includes('purple')) {
        handleUpdateStyle(nodeId, 'backgroundColor', '#ec4899');
        handleUpdateStyle(nodeId, 'boxShadow', '0 4px 14px rgba(236, 72, 153, 0.4)');
      } else if (pLower.includes('oscuro') || pLower.includes('dark') || pLower.includes('negro')) {
        handleUpdateStyle(nodeId, 'backgroundColor', '#0f172a');
        handleUpdateStyle(nodeId, 'borderColor', '#334155');
      } else if (pLower.includes('redondo') || pLower.includes('pill') || pLower.includes('circular')) {
        handleUpdateStyle(nodeId, 'borderRadius', '9999px');
      }

      // Check text change intent
      const textMatch = userPrompt.match(/['"](.*?)['"]/);
      if (textMatch && textMatch[1]) {
        handleUpdateContent(nodeId, textMatch[1]);
      }

      // Check animation intent
      if (pLower.includes('brillo') || pLower.includes('glow')) {
        handleUpdateStyle(nodeId, 'animation', 'glow');
      } else if (pLower.includes('pulso') || pLower.includes('pulse')) {
        handleUpdateStyle(nodeId, 'animation', 'pulse');
      } else if (pLower.includes('flotar') || pLower.includes('float')) {
        handleUpdateStyle(nodeId, 'animation', 'float');
      }

      // Check sound intent
      if (pLower.includes('sonido campana') || pLower.includes('bell')) {
        handleUpdateSound(nodeId, 'onClick', 'bell');
      } else if (pLower.includes('sonido pop') || pLower.includes('pop')) {
        handleUpdateSound(nodeId, 'onClick', 'pop');
      } else if (pLower.includes('sonido chime') || pLower.includes('chime')) {
        handleUpdateSound(nodeId, 'onClick', 'chime');
      }

      setToastMessage(`✓ IA aplicó cambios directos a "${targetNode.name}"`);
      setTimeout(() => setToastMessage(null), 3000);
      soundEngine.playProceduralSound('pop');
    } catch (err) {
      console.error('Error aplicando cambio con IA:', err);
    } finally {
      setIsElementAiLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050811] text-slate-100 overflow-hidden font-sans select-none antialiased">
      {/* Topbar with Screen Switcher & Drawing Mode */}
      <Topbar
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        zoom={zoom}
        setZoom={setZoom}
        onExportZip={handleRequestExportZip}
        onImportZip={handleImportZip}
        onToggleAiPanel={() => setIsAiPanelOpen(!isAiPanelOpen)}
        isAiPanelOpen={isAiPanelOpen}
        onToggleSoundLab={() => setIsSoundLabOpen(!isSoundLabOpen)}
        isSoundLabOpen={isSoundLabOpen}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        screens={screens}
        activeScreenId={activeScreenId}
        onSelectScreen={setActiveScreenId}
        onAddScreen={handleAddScreen}
        onRenameScreen={handleRenameScreen}
        onDeleteScreen={handleDeleteScreen}
        onDuplicateScreen={handleDuplicateScreen}
        isDrawingActive={isDrawingActive}
        onToggleDrawing={() => setIsDrawingActive(!isDrawingActive)}
        onToggleDesignTokens={() => setIsDesignTokensOpen(true)}
        isCommentsActive={isCommentsActive}
        onToggleComments={() => setIsCommentsActive(!isCommentsActive)}
        canUndo={pastScreens.length > 0}
        canRedo={futureScreens.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        isGridActive={isGridActive}
        onToggleGrid={() => setIsGridActive(!isGridActive)}
        onExportPng={handleExportPng}
        isFlowViewOpen={isFlowViewOpen}
        onToggleFlowView={() => setIsFlowViewOpen(!isFlowViewOpen)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onExportReactProject={handleRequestExportReact}
        userLicense={userLicense}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onToggleAnimationStudio={() => setIsAnimationStudioOpen(true)}
        onToggleVectorStudio={() => setIsVectorStudioOpen(true)}
        onSaveSnapshot={handleSaveSnapshot}
        onExportForgeFile={handleExportForgeFile}
        onImportForgeFile={handleImportForgeFile}
        onOpenAiScreenGenerator={() => setIsAiScreenModalOpen(true)}
        onToggleThemeMode={handleToggleThemeMode}
        currentThemeMode={currentThemeMode}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers(!showRulers)}
        isSaving={isSaving}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Component Drag-and-Drop & Layer Tree */}
        <LayersPanel
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={(node) => setSelectedNodeId(node.id)}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
          onReorderNodes={handleReorderNodes}
          masterComponents={masterComponents}
          onConvertToMaster={handleConvertToMaster}
          onInstantiateMaster={handleInstantiateMaster}
        />

        {/* Center: Infinite Canvas or Multi-Screen Flow View */}
        {isFlowViewOpen ? (
          <FlowView
            screens={screens}
            activeScreenId={activeScreenId}
            onSelectScreen={(id) => {
              setActiveScreenId(id);
              setIsFlowViewOpen(false);
            }}
            deviceMode={deviceMode}
            onCloseFlow={() => setIsFlowViewOpen(false)}
          />
        ) : (
          <Canvas
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={(node) => setSelectedNodeId(node ? node.id : null)}
            deviceMode={deviceMode}
            zoom={zoom}
            isPreviewMode={isPreviewMode}
            onExecuteAction={handleExecuteAction}
            onAddNode={handleAddNode}
            isDrawingActive={isDrawingActive}
            onCloseDrawing={() => setIsDrawingActive(false)}
            strokes={strokes}
            onUpdateStrokes={setStrokes}
            screenTransitionClass={screenTransitionClass}
            isCommentsActive={isCommentsActive}
            comments={comments}
            onAddComment={handleAddComment}
            onResolveComment={handleResolveComment}
            onDeleteComment={handleDeleteComment}
            isGridActive={isGridActive}
            showRulers={showRulers}
            onUpdateStyle={handleUpdateStyle}
            onUpdateMultipleStyles={handleUpdateMultipleStyles}
          />
        )}

        {/* Floating Claude Design Interaction Bar (Select, Comment/AI, Edit) */}
        {!isFlowViewOpen && (
          <ClaudeDesignPillBar
            activeMode={claudeMode}
            onModeChange={(m) => {
              setClaudeMode(m);
              if (m === 'comment') {
                setIsCommentsActive(true);
              } else {
                setIsCommentsActive(false);
              }
            }}
            selectedNode={selectedNode}
            onOpenVectorStudio={() => setIsVectorStudioOpen(true)}
            onApplyElementAiChange={handleApplyElementAiChange}
            isAiLoading={isElementAiLoading}
          />
        )}

        {/* Right: Visual Property, Geometry, Actions & Sound Inspector */}
        <Inspector
          selectedNode={selectedNode}
          screens={screens}
          onUpdateStyle={handleUpdateStyle}
          onUpdateSound={handleUpdateSound}
          onUpdateContent={handleUpdateContent}
          onUpdateAction={handleUpdateAction}
          onUpdateProperty={handleUpdateProperty}
          onDeleteNode={handleDeleteNode}
          customAnimations={customAnimations}
          onMoveDepth={handleMoveDepth}
          onOpenAnimationStudio={() => setIsAnimationStudioOpen(true)}
          onOpenSoundLab={() => setIsSoundLabOpen(true)}
          onOpenVectorStudio={() => setIsVectorStudioOpen(true)}
          onExportNodePng={handleExportNodePng}
        />

        {/* Slide-in Sound Lab */}
        <SoundLab
          isOpen={isSoundLabOpen}
          onClose={() => setIsSoundLabOpen(false)}
          onApplySoundToAllButtons={handleApplySoundToAllButtons}
          customSounds={customSounds}
          onAddCustomSound={(s) => setCustomSounds(prev => [...prev.filter(x => x.id !== s.id), s])}
          onDeleteCustomSound={(id) => setCustomSounds(prev => prev.filter(x => x.id !== id))}
          selectedNode={selectedNode}
          onAssignSoundToSelected={(trigger, soundId) => {
            if (selectedNode) {
              handleUpdateSound(selectedNode.id, trigger, soundId);
            }
          }}
        />

        {/* Animation Studio & Depth Modal */}
        <AnimationStudioModal
          isOpen={isAnimationStudioOpen}
          onClose={() => setIsAnimationStudioOpen(false)}
          animations={customAnimations}
          onAddAnimation={(anim) => setCustomAnimations(prev => [...prev.filter(x => x.id !== anim.id), anim])}
          selectedNode={selectedNode}
          onAssignAnimationToSelected={(animationClass, duration) => {
            if (selectedNode) {
              handleUpdateStyle(selectedNode.id, 'animation', animationClass);
              if (duration) {
                handleUpdateStyle(selectedNode.id, 'animationDuration', duration);
              }
            }
          }}
          onMoveDepth={handleMoveDepth}
        />

        {/* Vector Studio Modal (Figma Vector Networks, Shaper Tool & Pixel Persona) */}
        <VectorStudioModal
          isOpen={isVectorStudioOpen}
          onClose={() => setIsVectorStudioOpen(false)}
          onInsertVectorNode={handleInsertVectorNode}
          selectedNode={selectedNode}
        />

        {/* Slide-in AI Bridge */}
        <AiBridge
          isOpen={isAiPanelOpen}
          onClose={() => setIsAiPanelOpen(false)}
          nodes={nodes}
          theme={theme}
          onExecuteAiCommand={handleExecuteAiCommand}
          onApplyPresetTheme={handleApplyPresetTheme}
          onApplyAiAction={handleApplyAiAction}
        />

        {/* Global Design System & Tokens Modal */}
        <DesignTokensModal
          isOpen={isDesignTokensOpen}
          onClose={() => setIsDesignTokensOpen(false)}
          theme={theme}
          onUpdateTheme={setTheme}
          onPropagateThemeToAllNodes={handlePropagateThemeToAllNodes}
        />

        {/* 1-Click UI Project Templates Modal */}
        <TemplatesModal
          isOpen={isTemplatesOpen}
          onClose={() => setIsTemplatesOpen(false)}
          onApplyTemplate={handleApplyTemplate}
          currentScreens={screens}
        />

        {/* Donation Modal — voluntary donation before free export */}
        <ExportPaywallModal
          isOpen={isPaywallOpen}
          onClose={() => {
            setIsPaywallOpen(false);
            setPendingExportAction(null);
          }}
          onProceedExport={handleDonationProceedExport}
          exportType={pendingExportAction}
        />

        {/* AI Full Screen & Wireframe Generator Modal */}
        <AiScreenGeneratorModal
          isOpen={isAiScreenModalOpen}
          onClose={() => setIsAiScreenModalOpen(false)}
          onScreenGenerated={handleAiScreenGenerated}
        />

        {/* Interactive Modal Dialog (Interactive Testing Mode) */}
        {activeModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="neo-glass-panel border-cyan-500/30 rounded-2xl p-5 max-w-sm w-full shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.2)] space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span>{activeModal.title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModal.content}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    soundEngine.playProceduralSound('pop');
                    setActiveModal(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 rounded-xl transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full-Screen Immersive Presentation Mode Modal */}
        <PresentationModal
          isOpen={isPresentationOpen}
          onClose={() => setIsPresentationOpen(false)}
          screens={screens}
          activeScreenId={activeScreenId}
          onSelectScreen={setActiveScreenId}
          deviceMode={deviceMode}
          onExecuteAction={handleExecuteAction}
        />

        {/* Toast Notification Notification Overlay */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 neo-glass-panel border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="font-sans font-medium text-slate-100">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
