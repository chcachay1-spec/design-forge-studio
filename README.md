# DesignForge Studio (Figma + Claude Design + Webflow Hybrid)

[![Production Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://design-forge-app.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/chcachay1-spec/design-forge-studio)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25_Ready-purple)](https://design-forge-app.vercel.app)
[![100% Free](https://img.shields.io/badge/Exportaciones-100%25_Gratis-brightgreen)](https://design-forge-app.vercel.app)

**DesignForge Studio** es una suite profesional de diseño visual, interactivo, sensorial y de prototipado rápido en tiempo real. Combina la potencia del canvas y auto-layout de **Figma**, la interacción contextual de **Claude Design**, el diseño responsivo de **Webflow** y un **Sound Design Studio** completo con síntesis procedural Web Audio API.

* 🌐 **Producción activa:** [https://design-forge-app.vercel.app](https://design-forge-app.vercel.app)
* 📦 **Exportación 100% gratuita:** Proyectos completos React + Vite + Tailwind CSS, archivos `.forge` nativos, assets PNG a 3x DPI y bundles ZIP autónomos offline.
* 💜 **Modelo de donación voluntaria:** Sin suscripciones ni pagos obligatorios. Al exportar un proyecto, se muestra una invitación a apoyar con una donación opcional para impulsar el desarrollo continuo.

---

## 🌟 Características y Módulos de la Aplicación

### 1. 💾 Persistencia Local, Auto-Guardado y Gestión de Proyectos
* **Auto-Save Reactivo:** Guardado asíncrono con debounce en `localStorage` en cada interacción. El progreso nunca se pierde al refrescar (`F5`) o cerrar la pestaña.
* **Puntos de Restauración (Snapshots):** Congela versiones del proyecto con nombre y fecha para volver atrás en el tiempo.
* **Formato de Archivo Nativo `.forge`:**
  * **Exportar `.forge`:** Descarga el árbol de nodos, pantallas, temas, sonidos y animaciones en un único archivo JSON estándar.
  * **Abrir `.forge`:** Carga proyectos completos en cualquier navegador al instante.

### 2. 📐 Auto Layout Pro (Matriz 3×3 & Flexbox Estilo Figma)
* **Matriz Espacial 3×3:** Alineación visual de contenido en 9 posiciones de coordenadas espaciales sin escribir CSS manual.
* **Dirección y Distribución:** Selector de dirección (Fila / Columna), modo *Packed* vs *Space Between* y toggle para *Stretch (Estirar Hijos)*.
* **Control de Gap:** Espaciador numérico con presets instantáneos (`0px`, `8px`, `16px`, `24px`).
* **Padding Cuadrante Independiente:** Alterna entre padding uniforme o control independiente por cada lado (Top, Right, Bottom, Left).

### 3. 👁️ Inspector de Accesibilidad & Ratio de Contraste WCAG (A11y)
* **Cálculo de Luminancia Relativa sRGB en Tiempo Real:** Evaluación continua de la legibilidad entre texto y fondo.
* **Badges Normativos:** WCAG AA (ratio ≥ 4.5:1), WCAG AAA (ratio ≥ 7.0:1), y Texto Grande (ratio ≥ 3.0:1).
* **Optimización con 1 Clic:** Botón inteligente que corrige automáticamente el tono del texto para máxima legibilidad.

### 4. ⚡ Generador IA de Pantallas Completas (Full Wireframe Generator)
* **Generación por Prompt:** Escribe una descripción en lenguaje natural y la IA compondrá un árbol estructurado.
* **Plantillas Rápidas con 1 Clic:** Checkout E-Commerce, Dashboard de Analíticas, Autenticación & Login, Perfil de Usuario, Billetera Digital Fintech y más.
* **Presets Estéticos Base:** *Modern Dark*, *Clean Light* y *Cyber Vibrant*.

### 5. 📏 Reglas Graduadas de Precisión & Guías del Lienzo (Canvas Rulers)
* **Reglas Graduadas Métricas:** Escalas en píxeles adaptadas al nivel de zoom dinámico en los ejes X e Y.
* **Líneas Guía de Cursor en Vivo:** Siguen la posición exacta del puntero para facilitar la alineación manual.

### 6. 📱 Breakpoints Responsive en Vivo
* **Móvil (390 × 844 px):** iPhone 16 Pro con Dynamic Notch.
* **Tablet (768 × 1024 px):** iPad Pro.
* **Web Desktop (1200 × 800 px):** Monitor de escritorio con fluid layout.

### 7. 🌗 Switch Global de Tema Claro / Oscuro (Theme Swapper)
* Botón Sol/Luna en la barra superior con inversión armónica de tokens de diseño para alternar todas las pantallas entre Dark Mode y Light Mode al instante.

### 8. 🧩 Catálogo Exhaustivo de 40+ Componentes
Organizados en 6 categorías con soporte Drag-and-Drop:
1. **Acción y Comando:** Botón, Botón de Icono, FAB, Toggle Segmentado, Hipervínculo.
2. **Entrada de Datos & Formularios:** Input, Textarea, Checkbox, Radio, Select, Date Picker, Color Picker, File Upload, Tags/Chips Input.
3. **Contención & Superficie:** Card, Grid Container, Modal, Sheet/Drawer, Accordion, Carousel.
4. **Navegación & Estructura:** Navbar, Tab Bar, Sidebar, Footer, Breadcrumbs, Pagination, Search Bar.
5. **Retroalimentación & Estado:** Toast, Banner/Alert, Spinner, Progress Bar, Skeleton, Badge, Tooltip.
6. **Presentación de Datos & Multimedia:** Imagen, Avatar, Media Player, Data Table, Slider, Metric, Divider, SVG Vector.

### 9. 📅 Componentes Interactivos Dinámicos
* **Calendario Interactivo:** Cuadrícula mensual con indicadores de tareas, triggers de alerta/modal al hacer clic en fechas y soporte para tareas programadas.
* **Contador Numérico (Stepper):** Botones `[-]` / `[+]` para entrada numérica interactiva.
* **Countdown Timer (HUD):** Temporizador regresivo en vivo para lanzamientos u ofertas flash.

### 10. 🖥️ Gestión Total de Pantallas
* **Renombrar:** Doble clic o botón de edición para renombrar cualquier pantalla.
* **Duplicar:** Clonar pantallas completas con todos sus nodos.
* **Eliminar:** Eliminar pantallas con validación (siempre queda al menos 1 activa) y confirmación.

### 11. 🔊 Sound Design Studio (Laboratorio de Sonido UI Profesional)
* **Generador de Audio por IA:** Prompts inteligentes de micro-efectos UI.
* **Variaciones Anti-Fatiga:** 4 micro-variaciones de tono por sonido.
* **Sintetizador Procedural Analógico:** Modulación de onda, envolventes y recortadores.
* **Generador Retro 8-Bits:** Efectos estilo vintage jsfxr.
* **Exportador de Código:** JavaScript (Web Audio), Swift (AVFoundation), Kotlin (SoundPool) y WAV PCM 16-bit.

### 12. 🎨 Claude Design & Herramientas de Vector
* **Modos de Interacción:** Select, Comment, Edit.
* **Estudio Vectorial:** Redes vectoriales con nodos Bézier, formas booleanas y Persona Píxel.
* **Animación y Profundidad:** Editor de keyframes CSS y control de Z-Index.
* **Exportador de Assets PNG a 3x DPI:** Exportación aislada con transparencia retina.

### 13. 🎬 Fondos de Video Animados & Interacción por Proximidad
* **Video de Fondo:** Carga directa de `.mp4`, `.webm` o URLs remotas.
* **Filtros en Tiempo Real:** Opacidad y desenfoque óptico Glassmorphism.
* **Interacción por Hover:** Activación de audio o play/pause por proximidad del cursor.

### 14. 📺 Reproductor de YouTube Integrado (IFrame Embed)
* Embebido en cualquier contenedor con URLs estándar, cortas o embed.
* Presets de prueba con 1 clic.

### 15. 🚀 Handoff & Exportación para Desarrolladores (100% Gratis)
* **Exportación React + Vite + Tailwind CSS:** Código fuente completo listo para producción.
* **Inspector de Código en Vivo:** Snippets en Tailwind CSS, CSS Puro o React JSX semántico.
* **Tokens de Diseño Globales:** Modal de tokens centralizados con propagación en cascada.
* **Sin suscripciones ni pagos:** Todas las exportaciones son gratuitas. Un modal de donación voluntaria permite apoyar el proyecto opcionalmente.

### 16. 💜 Modelo de Monetización: Donación Voluntaria
* **100% Gratuito:** Todas las funciones, plantillas y exportaciones son completamente gratuitas.
* **Donación Voluntaria:** Al exportar un proyecto, se muestra un modal amigable invitando a apoyar con una donación opcional (\$3, \$5, \$10 o \$25).
* **Sin Bloqueos:** El usuario siempre puede exportar sin donar. No hay limitaciones de ningún tipo.
* **Badge de Donador:** Los usuarios que donan reciben un badge "DONADOR 💜" en la interfaz como agradecimiento.

---

## 💻 Puesta en Marcha Local

```bash
# Clonar el repositorio
git clone https://github.com/chcachay1-spec/design-forge-studio.git
cd design-forge-studio/client

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 🛠️ Tecnologías Utilizadas

* **Core:** React 18, TypeScript, Vite, Tailwind CSS
* **Audio:** Web Audio API (Síntesis procedural analógica)
* **Iconografía:** Lucide Icons (400+ iconos integrados)
* **Gráficos & Render:** HTML5 Canvas, SVG Paths, html-to-image (3x Retina DPI)
* **Almacenamiento:** LocalStorage API persistente con debouncing reactivo
* **Despliegue Continuo:** GitHub Actions & Vercel Production
