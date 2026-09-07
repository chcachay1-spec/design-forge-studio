# DesignForge Studio (Figma + Claude Design Offline Hybrid)

Una suite de diseño visual, interactivo y de audio 100% offline, diseñada para editar proyectos web y móviles, sincronizar diseño con agentes de Inteligencia Artificial mediante MCP o archivos de contexto markdown, y exportar proyectos completos en .zip listos para producción.

Desarrollado bajo la metodología **AI Orchestrator Starter Kit v3** (STANDARD Mode).

---

## Características Principales

1. **Canvas WYSIWYG Estilo Figma:**
   - Visualización responsiva intercambiable: **Móvil (iPhone 16 Pro)**, **Tablet (iPad)** y **Web Desktop**.
   - Zoom interactivo (40% a 200%) y navegación por canvas.
   - Selección directa haciendo clic en cualquier botón, card, texto o navbar con indicadores visuales de nodo.
   - Panel de capas ("Layers & Nodes Tree") para inspeccionar la jerarquía visual de la aplicación.

2. **Inspector de Diseño Estilo Claude Design:**
   - Modificación en tiempo real de tokens y estilos CSS:
     - Colores (Fondo, Texto, Bordes mediante selector visual y HEX).
     - Geometría (Border Radius para curvas pill/redondeadas, Padding, Spacing, Ancho/Alto).
     - Tipografía y sombras en vivo (ox-shadow, ackdrop-filter).
   - Edición inmediata de textos y etiquetas de la UI.

3. **Sound Design Studio (Laboratorio de Sonido UI Offline):**
   - Motor de síntesis procedural con **Web Audio API** (100% offline, sin requerir descargas ni archivos externos).
   - Generación de efectos de sonido:
     - click: Pulsación nítida UI.
     - pop: Toque burbuja moderno estilo iOS.
     - switch: Interruptor mecánico para toggles.
     - chime: Acorde armónico de éxito en Do Mayor.
     - ell: Campana de resonancia para notificaciones.
     - whoosh: Transición aérea por ruido filtrado.
     - lert: Doble pulso para alertas o errores.
   - Vinculación directa de sonidos a eventos de elementos (onClick, onHover).
   - Modo de prueba interactivo ("Testing Mode") para probar la app con sonidos y clics activos.

4. **Puente para Agentes de Inteligencia Artificial (AI Design Bridge):**
   - **Protocolo MCP (Model Context Protocol):**
     - Servidor MCP integrado en mcp-server/index.js para conectar agentes de Claude Desktop, Cursor, Antigravity o Claude Code vía stdio.
     - Herramientas: get_design_context, modify_element_style, ind_sound_effect, pply_theme_palette.
   - **Terminal de Prompts IA Integrada:**
     - Intérprete de lenguaje natural offline en la app: comandos como *"make transfer button emerald green"*, *"add chime sound to buttons"*, *"make corners extra rounded"*, o *"set black amoled background"*.
   - **Sincronización por Archivo Markdown (.design-context.md):**
     - Generación y copia instantánea de la especificación de tokens y componentes para alimentar a cualquier modelo de lenguaje.

5. **Exportación e Importación Offline:**
   - **Export ZIP:** Genera un archivo .zip que contiene:
     - index.html: La aplicación interactiva completamente funcional con el motor de audio Web Audio embebido offline.
     - 	heme.json: Todos los tokens de diseño y el árbol de componentes.
     - .design-context.md: Contexto listo para agentes.
   - **Import ZIP:** Permite subir un .zip previamente exportado para restaurar y continuar editando la UI y los sonidos.

---

## Cómo Ejecutarlo

### Opción 1: Lanzadores Rápidos
- Haz doble clic en start-app.bat para iniciar el estudio localmente.
- Abre tu navegador en http://localhost:5173.

### Opción 2: Desde la Terminal
`ash
# Iniciar la aplicación de diseño:
cd client
npm run preview -- --port 5173

# En otra terminal, si deseas activar el servidor MCP para Claude/Cursor:
cd mcp-server
node index.js
`

---

## Configuración del Servidor MCP en Claude Desktop / Cursor

Agrega lo siguiente a tu archivo de configuración de MCP (ejemplo claude_desktop_config.json):

`json
{
  "mcpServers": {
    "designforge": {
      "command": "node",
      "args": [
        "C:\\Users\\CrisACC\\.gemini\\antigravity\\scratch\\design-forge-app\\mcp-server\\index.js"
      ]
    }
  }
}
`
