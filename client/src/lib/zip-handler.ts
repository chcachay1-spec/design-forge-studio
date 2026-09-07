import JSZip from 'jszip';
import type { DesignNode, ProjectTheme, ScreenDefinition } from './types';

export async function exportProjectZip(nodes: DesignNode[], theme: ProjectTheme): Promise<Blob> {
  const zip = new JSZip();

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>DesignForge App</title><style>* { box-sizing: border-box; margin: 0; padding: 0; } body { background-color: ' + theme.backgroundColor + '; color: ' + theme.textColor + '; font-family: sans-serif; display: flex; justify-content: center; padding: 20px; } .viewport { width: 100%; max-width: 420px; min-height: 800px; background: ' + theme.backgroundColor + '; border-radius: ' + theme.borderRadius + '; overflow: hidden; } button { cursor: pointer; border: none; outline: none; } </style></head><body><div class="viewport">' + renderNodesToHtml(nodes) + '</div></body></html>';

  const themeJson = JSON.stringify({ theme, nodes, exportedAt: new Date().toISOString() }, null, 2);
  const md = generateMarkdownDesignContext(nodes, theme);

  zip.file('index.html', html);
  zip.file('theme.json', themeJson);
  zip.file('.design-context.md', md);
  zip.file('README.md', '# DesignForge Offline Project\n\nExported with theme tokens and layer trees.\n');

  return await zip.generateAsync({ type: 'blob' });
}

export async function exportFullViteReactProject(screens: ScreenDefinition[], theme: ProjectTheme): Promise<Blob> {
  const zip = new JSZip();

  // 1. package.json
  const packageJson = {
    name: "designforge-exported-app",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      preview: "vite preview"
    },
    dependencies: {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "lucide-react": "^0.460.0",
      "canvas-confetti": "^1.9.4"
    },
    devDependencies: {
      "@types/react": "^18.3.5",
      "@types/react-dom": "^18.3.0",
      "@types/canvas-confetti": "^1.9.0",
      "@vitejs/plugin-react": "^4.3.1",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.47",
      "tailwindcss": "^3.4.11",
      "typescript": "^5.5.3",
      "vite": "^5.4.2"
    }
  };
  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // 2. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
  zip.file("vite.config.ts", viteConfig);

  // 3. tsconfig.json & tsconfig.app.json
  const tsConfig = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`;
  const tsConfigApp = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`;
  const tsConfigNode = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": false
  },
  "include": ["vite.config.ts"]
}
`;
  zip.file("tsconfig.json", tsConfig);
  zip.file("tsconfig.app.json", tsConfigApp);
  zip.file("tsconfig.node.json", tsConfigNode);

  // 4. Tailwind & PostCSS configs
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
  zip.file("tailwind.config.js", tailwindConfig);
  zip.file("postcss.config.js", postcssConfig);

  // 5. index.html
  const indexHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DesignForge React App</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  zip.file("index.html", indexHtml);

  // 6. src/index.css
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  min-height: 100vh;
  background-color: ${theme.backgroundColor || '#0f172a'};
  color: ${theme.textColor || '#f8fafc'};
}
`;
  zip.file("src/index.css", indexCss);

  // 7. src/main.tsx
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
  zip.file("src/main.tsx", mainTsx);

  // 8. Generate React Screen Components
  const screenComponentsCode: string[] = [];
  screens.forEach((screen) => {
    const compName = sanitizeComponentName(screen.name || screen.id);
    const code = generateReactComponentForScreen(compName, screen.rootNode);
    zip.file(`src/screens/${compName}.tsx`, code);
    screenComponentsCode.push(compName);
  });

  // 9. src/App.tsx (Routing and Navigation Switcher)
  const appTsx = generateMasterAppTsx(screens, screenComponentsCode, theme);
  zip.file("src/App.tsx", appTsx);

  // 10. README.md with run instructions
  const readmeMd = `# 🚀 DesignForge Generated Project

Este proyecto fue generado automáticamente por **DesignForge UI/UX Studio** como una aplicación lista para producción con **React, Vite y Tailwind CSS**.

## 🛠️ Cómo ejecutar el proyecto:

1. Descomprime este archivo ZIP.
2. Abre una terminal en la carpeta extraída.
3. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`
4. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Abre el navegador en la URL indicada (usualmente \`http://localhost:5173\`).

## 📱 Pantallas Incluidas:
${screens.map(s => `- **${s.name}** (\`src/screens/${sanitizeComponentName(s.name || s.id)}.tsx\`)`).join('\n')}
`;
  zip.file("README.md", readmeMd);

  return await zip.generateAsync({ type: 'blob' });
}

function sanitizeComponentName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '');
  if (!cleaned) return 'Screen';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function generateReactComponentForScreen(componentName: string, rootNode: DesignNode): string {
  return `import React from 'react';
import * as Icons from 'lucide-react';

interface ScreenProps {
  onNavigate?: (screenId: string) => void;
  onOpenModal?: (title: string, content: string) => void;
  onTriggerConfetti?: () => void;
}

export const ${componentName}: React.FC<ScreenProps> = ({
  onNavigate,
  onOpenModal,
  onTriggerConfetti,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-start p-4">
      ${renderNodeToReact(rootNode, 3)}
    </div>
  );
};

export default ${componentName};
`;
}

function renderNodeToReact(node: DesignNode, indent: number): string {
  const pad = '  '.repeat(indent);
  const styleObj = node.styles || {};

  const styleAttr = `style={{ ${Object.entries(styleObj)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ')} }}`;

  let actionHandler = '';
  if (node.action) {
    if (node.action.type === 'navigate' && node.action.targetScreenId) {
      actionHandler = ` onClick={() => onNavigate?.('${node.action.targetScreenId}')}`;
    } else if (node.action.type === 'modal') {
      actionHandler = ` onClick={() => onOpenModal?.('${node.action.modalTitle || 'Aviso'}', '${node.action.modalContent || 'Información'}')}`;
    } else if (node.action.type === 'confetti') {
      actionHandler = ` onClick={() => onTriggerConfetti?.()}`;
    }
  }

  if (node.type === 'button') {
    const iconTag = node.iconName ? `<Icons.${node.iconName} className="w-4 h-4 inline-block mr-1.5" />` : '';
    return `${pad}<button className="active:scale-95 transition-transform inline-flex items-center justify-center cursor-pointer" ${styleAttr}${actionHandler}>\n${pad}  ${iconTag}${node.content || 'Botón'}\n${pad}</button>`;
  }

  if (node.type === 'badge') {
    const iconTag = node.iconName ? `<Icons.${node.iconName} className="w-3 h-3 inline-block mr-1" />` : '';
    return `${pad}<span className="inline-flex items-center" ${styleAttr}>\n${pad}  ${iconTag}${node.content || 'Insignia'}\n${pad}</span>`;
  }

  if (node.type === 'text') {
    return `${pad}<div ${styleAttr}>\n${pad}  ${node.content || ''}\n${pad}</div>`;
  }

  if (node.type === 'image') {
    const src = node.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    return `${pad}<div ${styleAttr} className="overflow-hidden">\n${pad}  <img src="${src}" alt="${node.name}" className="w-full h-full object-cover" />\n${pad}</div>`;
  }

  if (node.type === 'avatar') {
    const src = node.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    return `${pad}<div ${styleAttr} className="inline-flex items-center gap-3">\n${pad}  <img src="${src}" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />\n${pad}  <span className="font-semibold text-sm">${node.content || 'Usuario'}</span>\n${pad}</div>`;
  }

  if (node.type === 'input') {
    return `${pad}<div ${styleAttr}>\n${pad}  <input type="text" placeholder="${node.placeholder || 'Escribe aquí...'}" className="w-full bg-transparent outline-none text-inherit placeholder-slate-500 text-sm" />\n${pad}</div>`;
  }

  const childrenHtml = node.children && node.children.length > 0
    ? node.children.map(c => renderNodeToReact(c, indent + 1)).join('\n')
    : '';

  return `${pad}<div ${styleAttr}${actionHandler}>\n${node.content ? `${pad}  ${node.content}\n` : ''}${childrenHtml}\n${pad}</div>`;
}

function generateMasterAppTsx(screens: ScreenDefinition[], componentNames: string[], theme: ProjectTheme): string {
  const imports = componentNames
    .map(name => `import { ${name} } from './screens/${name}';`)
    .join('\n');

  const cases = screens.map((screen, index) => {
    const compName = componentNames[index];
    return `        {activeScreen === '${screen.id}' && (\n          <${compName} onNavigate={handleNavigate} onOpenModal={handleOpenModal} onTriggerConfetti={handleTriggerConfetti} />\n        )}`;
  }).join('\n');

  return `import React, { useState } from 'react';
import confetti from 'canvas-confetti';
${imports}

export function App() {
  const [activeScreen, setActiveScreen] = useState<string>('${screens[0]?.id || 'screen-home'}');
  const [modal, setModal] = useState<{ title: string; content: string } | null>(null);

  const handleNavigate = (screenId: string) => {
    setActiveScreen(screenId);
  };

  const handleOpenModal = (title: string, content: string) => {
    setModal({ title, content });
  };

  const handleTriggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 font-sans">
      {/* Device Shell */}
      <main 
        className="w-full max-w-[420px] min-h-[800px] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
        style={{ backgroundColor: '${theme.backgroundColor || '#0f172a'}' }}
      >
        {/* Status Bar */}
        <div className="h-7 border-b border-slate-800/60 px-5 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full" />
          <span>5G</span>
        </div>

        {/* Dynamic Screen Viewport */}
        <div className="flex-1 overflow-y-auto">
${cases}
        </div>
      </main>

      {/* Interactive Modal System */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-2">{modal.title}</h3>
            <p className="text-sm text-slate-300 mb-6">{modal.content}</p>
            <button
              onClick={() => setModal(null)}
              className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
`;
}

function renderNodesToHtml(nodes: DesignNode[]): string {
  return nodes.map(node => {
    const styleString = Object.entries(node.styles || {})
      .map(([k, v]) => k.replace(/([A-Z])/g, '-$1').toLowerCase() + ': ' + v)
      .join('; ');
    const soundAttr = node.sounds?.onClick ? ' data-sound="' + node.sounds.onClick + '"' : '';

    if (node.type === 'button') {
      return '<button id="' + node.id + '" style="' + styleString + '"' + soundAttr + '>' + (node.content || '') + '</button>';
    }
    if (node.type === 'text') {
      return '<div id="' + node.id + '" style="' + styleString + '">' + (node.content || '') + '</div>';
    }
    if (node.type === 'badge') {
      return '<span id="' + node.id + '" style="' + styleString + '"' + soundAttr + '>' + (node.content || '') + '</span>';
    }

    const children = node.children ? renderNodesToHtml(node.children) : '';
    return '<div id="' + node.id + '" style="' + styleString + '">' + (node.content || '') + children + '</div>';
  }).join('\n');
}

export function generateMarkdownDesignContext(nodes: DesignNode[], theme: ProjectTheme): string {
  return '# DesignForge Project Context & Tokens\n\n' +
    '## Global Theme Palette\n' +
    '- Primary Color: `' + theme.primaryColor + '`\n' +
    '- Secondary Color: `' + theme.secondaryColor + '`\n' +
    '- Background: `' + theme.backgroundColor + '`\n' +
    '- Surface / Cards: `' + theme.cardColor + '`\n' +
    '- Text: `' + theme.textColor + '`\n' +
    '- Border Radius: `' + theme.borderRadius + '`\n\n' +
    '## Component & Layer Structure\n' + describeTree(nodes, 0) + '\n\n' +
    '## Audio Sound Mappings\n' + describeSounds(nodes) + '\n\n' +
    '## Instructions for AI Agents (Claude / Antigravity / Cursor)\n' +
    '1. You can modify any element by its ID (e.g. transfer-button, balance-card).\n' +
    '2. You can suggest color shifts, typography scaling, or sound effect triggers (onClick: chime, pop, switch, alert).\n' +
    '3. Changes can be written to .design-actions.json or applied directly via MCP modify_element_style.\n';
}

function describeTree(nodes: DesignNode[], depth: number): string {
  const pad = '  '.repeat(depth);
  return nodes.map(node => {
    let desc = pad + '- **' + node.name + '** (`#' + node.id + '`, type: `' + node.type + '`)';
    if (node.content) desc += ' — Content: "' + node.content + '"';
    if (node.children && node.children.length > 0) {
      desc += '\n' + describeTree(node.children, depth + 1);
    }
    return desc;
  }).join('\n');
}

function describeSounds(nodes: DesignNode[]): string {
  const mappings: string[] = [];
  const walk = (node: DesignNode) => {
    if (node.sounds?.onClick || node.sounds?.onHover) {
      mappings.push('- **' + node.name + '** (`#' + node.id + '`): [Click: ' + (node.sounds.onClick || 'none') + ', Hover: ' + (node.sounds.onHover || 'none') + ']');
    }
    if (node.children) node.children.forEach(walk);
  };
  nodes.forEach(walk);
  return mappings.length > 0 ? mappings.join('\n') : '_No sound mappings yet._';
}
