# DesignForge Studio (Figma + Claude Design + Webflow Hybrid)

[![Production Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://design-forge-app.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/chcachay1-spec/design-forge-studio)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25_Ready-purple)](https://design-forge-app.vercel.app)

**DesignForge Studio** es una suite profesional de diseño visual, interactivo, sensorial y de prototipado rápido en tiempo real. Combina la potencia del canvas y auto-layout de **Figma**, la interacción contextual de **Claude Design**, el diseño responsivo de **Webflow** y un **Sound Design Studio** completo con síntesis procedural Web Audio API.

* 🌐 **Producción activa:** [https://design-forge-app.vercel.app](https://design-forge-app.vercel.app)
* 📦 **Exportación:** Proyectos completos React + Vite + Tailwind CSS, archivos de proyecto `.forge` (JSON nativo), assets PNG a 3x DPI y bundles ZIP autónomos offline.

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
* **Dirección y Distribución:** Selector de dirección (Fila $\rightarrow$ / Columna $\downarrow$), modo *Packed* vs *Space Between* y toggle para *Stretch (Estirar Hijos)*.
* **Control de Gap:** Espaciador numérico con presets instantáneos (`0px`, `8px`, `16px`, `24px`).
* **Padding Cuadrante Independiente:** Alterna entre padding uniforme o control independiente por cada lado (`Top`, `Right`, `Bottom`, `Left`).

### 3. 👁️ Inspector de Accesibilidad & Ratio de Contraste WCAG (A11y)
* **Cálculo de Luminancia Relativa sRGB en Tiempo Real:** Evaluación continua de la legibilidad entre el color del texto y el fondo del componente seleccionado.
* **Badges Normativos:**
  * **WCAG AA:** Cumplimiento de ratio $\ge$ 4.5:1 para texto estándar.
  * **WCAG AAA:** Cumplimiento óptimo de ratio $\ge$ 7.0:1.
  * **Texto Grande:** Cumplimiento de ratio $\ge$ 3.0:1 para títulos y encabezados.
* **Optimización con 1 Clic:** Botón inteligente que corrige automáticamente el tono del texto para garantizar máxima legibilidad según el brillo del fondo.

### 4. ⚡ Generador IA de Pantallas Completas (Full Wireframe Generator)
* **Generación por Prompt:** Escribe una descripción en lenguaje natural y la IA compondrá un árbol estructurado de contenedores, tarjetas, inputs y botones interactivos.
* **Plantillas Rápidas con 1 Clic:**
  * *Checkout E-Commerce* (Resumen, tarjeta VISA y botón de compra seguro).
  * *Dashboard de Analíticas* (Métricas, KPIs y accesos directos).
  * *Autenticación & Login* (Inputs, botón Google y recuperación).
  * *Perfil de Usuario* (Avatar, estadísticas y configuración).
  * *Billetera Digital Fintech* (Balance, transferencias y movimientos).
* **Presets Estéticos Base:** *Modern Dark*, *Clean Light* y *Cyber Vibrant*.

### 5. 📏 Reglas Graduadas de Precisión & Guías del Lienzo (Canvas Rulers)
* **Reglas Graduadas Métricas:** Escalas en píxeles adaptadas al nivel de zoom dinámico en los ejes X e Y.
* **Líneas Guía de Cursor en Vivo:** Siguen la posición exacta $(X, Y)$ del puntero del mouse para facilitar la alineación manual de elementos.
* **Interruptor de Reglas:** Botón en la barra de herramientas para mostrar u ocultar las reglas a demanda.

### 6. 📱 Breakpoints Responsive en Vivo
* Alternancia fluida del viewport con soporte para:
  * **Móvil (390 × 844 px):** iPhone 16 Pro con Dynamic Notch.
  * **Tablet (768 × 1024 px):** iPad Pro.
  * **Web Desktop (1200 × 800 px):** Monitor de escritorio con fluid layout.

### 7. 🌗 Switch Global de Tema Claro / Oscuro (Theme Swapper)
* Botón Sol/Luna en la barra superior con un algoritmo de inversión armónica de tokens de diseño para alternar todas las pantallas del proyecto entre Dark Mode y Light Mode al instante.

### 8. 🧩 Catálogo Exhaustivo de 40+ Componentes (Sistemas Material Design & IBM Carbon)
Organizados en 6 categorías anatómicas con soporte Drag-and-Drop:
1. **Acción y Comando:** Botón Estándar, Botón de Icono, FAB (Floating Action Button), Botón Segmentado / Toggle, Hipervínculo.
2. **Entrada de Datos & Formularios:** Campo de Texto (Input), Área de Texto (Textarea), Casilla de Verificación (Checkbox), Botón de Radio, Menú Desplegable (Select), Selector de Fecha, Selector de Color, Cargador de Archivos, Entrada de Etiquetas (Chips Input).
3. **Contención & Superficie:** Tarjeta (Card), Cuadrícula / Contenedor Flex, Modal / Diálogo, Hoja Inferior / Lateral (Sheet / Drawer), Acordeón / Colapsable, Carrusel.
4. **Navegación & Estructura:** Barra de Navegación Superior (Navbar), Barra de Pestañas Inferior (Tab Bar / Bottom Nav), Barra Lateral (Sidebar), Pie de Página (Footer), Migas de Pan (Breadcrumbs), Paginación, Barra de Búsqueda (Search Bar).
5. **Retroalimentación & Estado:** Notificación Flotante (Toast), Banner / Alerta en Línea, Indicador de Carga Circular (Spinner), Barra de Progreso, Estado Esqueleto (Skeleton), Insignia (Badge), Información Emergente (Tooltip).
6. **Presentación de Datos & Multimedia:** Imagen, Avatar, Reproductor Multimedia, Tabla de Datos, Control Deslizante (Slider), Indicador Numérico / Métrica, Separador (Divider), Geometría Vectorial SVG.

### 9. 🔊 Sound Design Studio (Laboratorio de Sonido UI Profesional)
* **Generador de Audio por IA:** Prompts inteligentes de micro-efectos UI (< 1.5s).
* **Variaciones Anti-Fatiga:** 4 micro-variaciones de tono por sonido para evitar la monotonía auditiva.
* **Sintetizador Procedural Analógico:** Modulación de onda (senoidal, cuadrada, sierra, triangular), envolventes de ataque, decaimiento (fades) y recortadores de inicio/fin.
* **Generador Retro 8-Bits:** Efectos estilo sintetizador vintage jsfxr.
* **Exportador de Código:** Generación de snippets en JavaScript (Web Audio), Swift (AVFoundation) y Kotlin (SoundPool), con exportación directa a archivos WAV PCM de 16-bit.

### 10. 🎨 Píldora Flotante Claude Design & Herramientas de Vector
* **Modos de Interacción:**
  * **Select:** Selección y reorganización de elementos en el árbol.
  * **Comment:** Notas colaborativas contextuales con sugerencias de IA para mejorar elementos individuales.
  * **Edit:** Modificación visual instantánea de geometría, fuentes y layout.
* **Estudio Vectorial (Vector Studio):** Redes vectoriales con nodos y tiradores Bézier, creador de formas booleanas (Unión, Sustracción, Intersección) y Persona Píxel.
* **Estudio de Animación y Profundidad:** Editor de keyframes CSS y control de profundidad (`Z-Index` y reordenamiento de capas al frente / al fondo).
* **Exportador de Assets PNG a 3x DPI:** Exportación aislada de cualquier componente con transparencia y nitidez retina.

### 11. 🎬 Fondos de Video Animados (WebM / MP4) & Interacción por Proximidad
* **Soporte de Video de Fondo:** Carga directa de videos locales (`.mp4`, `.webm`) o URLs remotas para cualquier cuadro, tarjeta o contenedor.
* **Filtros en Tiempo Real:** Control deslizante de opacidad ($0\%$ a $100\%$) y desenfoque óptico *Glassmorphism* (`0px`, `2px`, `6px`, `12px`).
* **Interacción Inteligente por Hover / Proximidad:**
  * *Silencioso continuo:* Modo estándar para ambientación sutil.
  * *🔊 Activar audio al pasar mouse:* El video corre silenciado y activa el sonido únicamente al pasar el cursor sobre el elemento, silenciándose al salir.
  * *⏯️ Pausar animación/audio al salir:* El video permanece en pausa estática y solo se reproduce con sonido mientras el usuario mantiene el puntero encima.

### 12. 📺 Reproductor de YouTube Integrado (IFrame Embed)
* **Embebido en Cualquier Contenedor:** Soporta URLs en formato estándar (`watch?v=...`), enlaces cortos (`youtu.be/...`) y URLs embed.
* **Transformación de Media Player:** Si se asigna a un componente de reproductor multimedia, se convierte automáticamente en una pantalla de video en vivo.
* **Presets de Prueba:** Accesos rápidos con un solo clic a *Lofi Beats*, *UI Demo* y *Chill Music*.

### 13. 🚀 Handoff & Exportación para Desarrolladores
* **Exportación React + Vite + Tailwind CSS:** Descarga el código fuente completo listo para producción (`npm install && npm run dev`).
* **Inspector de Código en Vivo:** Genera y copia snippets en **Tailwind CSS**, **CSS Puro** o **React JSX semántico**.
* **Tokens de Diseño Globales:** Modal de tokens centralizados con propagación en cascada a todos los componentes.

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
