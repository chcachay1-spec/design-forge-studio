import { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { LayersPanel } from './components/LayersPanel';
import { SoundLab } from './components/SoundLab';
import { AiBridge } from './components/AiBridge';
import { DesignTokensModal } from './components/DesignTokensModal';
import { TemplatesModal } from './components/TemplatesModal';
import { FlowView } from './components/FlowView';
import { PresentationModal } from './components/PresentationModal';
import { AnimationStudioModal } from './components/AnimationStudioModal';
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
  const [isGridActive, setIsGridActive] = useState(false);
  const [isFlowViewOpen, setIsFlowViewOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isAnimationStudioOpen, setIsAnimationStudioOpen] = useState(false);
  const [masterComponents, setMasterComponents] = useState<DesignNode[]>([]);
  const [customSounds, setCustomSounds] = useState<CustomSoundDefinition[]>([]);
  const [customAnimations, setCustomAnimations] = useState<CustomAnimationDefinition[]>(INITIAL_CUSTOM_ANIMATIONS);

  // Dynamically inject custom animation keyframes into document head
  useEffect(() => {
    injectCustomAnimationStyles(customAnimations);
  }, [customAnimations]);

  // Get active screen and its nodes
  const currentScreen = screens.find(s => s.id === activeScreenId) || screens[0];
  const nodes = [currentScreen.rootNode];

  // Helper to mutate nodes on the active screen with Undo/Redo history
  const setNodes = (updateFn: (prev: DesignNode[]) => DesignNode[]) => {
    setPastScreens(prevPast => [...prevPast.slice(-25), screens]);
    setFutureScreens([]);

    setScreens(prevScreens => {
      return prevScreens.map(s => {
        if (s.id === activeScreenId) {
          const updatedNodes = updateFn([s.rootNode]);
          return {
            ...s,
            rootNode: updatedNodes[0] || s.rootNode
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
    } catch (e) {
      alert('Error exporting project ZIP: ' + String(e));
    }
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

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Topbar with Screen Switcher & Drawing Mode */}
      <Topbar
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        zoom={zoom}
        setZoom={setZoom}
        onExportZip={handleExportZip}
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
        onExportReactProject={handleExportReactProject}
        onToggleAnimationStudio={() => setIsAnimationStudioOpen(true)}
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
        />

        {/* Interactive Modal Dialog (Interactive Testing Mode) */}
        {activeModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-slate-950/95 border border-slate-800/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>🪟</span>
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
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
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
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
