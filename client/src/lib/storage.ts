import type { ScreenDefinition, ProjectTheme, CustomSoundDefinition, CustomAnimationDefinition } from './types';

export interface ProjectSnapshot {
  id: string;
  name: string;
  timestamp: number;
  screensCount: number;
}

export interface DesignForgeProject {
  version: '1.0';
  id: string;
  name: string;
  updatedAt: number;
  screens: ScreenDefinition[];
  activeScreenId: string;
  theme: ProjectTheme;
  customSounds?: CustomSoundDefinition[];
  customAnimations?: CustomAnimationDefinition[];
  snapshots?: ProjectSnapshot[];
}

const STORAGE_KEY_CURRENT = 'designforge_active_project_v1';
const STORAGE_KEY_SNAPSHOTS = 'designforge_snapshots_v1';

export const storageEngine = {
  // Save current project state
  saveProject(project: Omit<DesignForgeProject, 'version' | 'updatedAt'>): void {
    try {
      const fullProject: DesignForgeProject = {
        ...project,
        version: '1.0',
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(fullProject));
    } catch (e) {
      console.warn('[DesignForge Storage] Failed to save project to localStorage:', e);
    }
  },

  // Load current project state
  loadProject(): DesignForgeProject | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as DesignForgeProject;
      if (parsed && Array.isArray(parsed.screens) && parsed.screens.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('[DesignForge Storage] Failed to load project from localStorage:', e);
    }
    return null;
  },

  // Clear current project (Reset to template)
  clearProject(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch (e) {
      console.warn('[DesignForge Storage] Failed to clear project:', e);
    }
  },

  // Snapshots / Version History
  getSnapshots(): Array<{ id: string; name: string; timestamp: number; data: string }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SNAPSHOTS);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createSnapshot(name: string, project: Omit<DesignForgeProject, 'version' | 'updatedAt'>): string {
    const snapshots = this.getSnapshots();
    const id = 'snap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const fullProject: DesignForgeProject = {
      ...project,
      version: '1.0',
      updatedAt: Date.now(),
    };
    snapshots.unshift({
      id,
      name: name || `Versión ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: Date.now(),
      data: JSON.stringify(fullProject),
    });
    // Keep max 15 snapshots
    const trimmed = snapshots.slice(0, 15);
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(trimmed));
    return id;
  },

  loadSnapshot(id: string): DesignForgeProject | null {
    const snapshots = this.getSnapshots();
    const found = snapshots.find(s => s.id === id);
    if (!found) return null;
    try {
      return JSON.parse(found.data) as DesignForgeProject;
    } catch {
      return null;
    }
  },

  deleteSnapshot(id: string): void {
    const snapshots = this.getSnapshots().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(snapshots));
  },

  // Export as .forge (JSON file)
  exportForgeFile(project: DesignForgeProject, filename?: string): void {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filename || project.name || 'proyecto_designforge').replace(/\s+/g, '_').toLowerCase() + '.forge';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Parse imported .forge or JSON file
  async importForgeFile(file: File): Promise<DesignForgeProject> {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed.screens || !Array.isArray(parsed.screens)) {
      throw new Error('El archivo no contiene pantallas válidas de DesignForge.');
    }
    return parsed as DesignForgeProject;
  }
};
