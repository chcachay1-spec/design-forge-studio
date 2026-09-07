# SPEC.md — DesignForge (Figma + Claude Design Hybrid)

## Purpose & Vision
DesignForge is an offline-capable visual UI/UX design studio that bridges WYSIWYG visual manipulation (like Figma) and AI-driven generative design/theme refactoring (like Claude Design). It empowers developers and designers to inspect UI components, modify styling/tokens visually, assign and synthesize UI sound effects, and interact with AI agents using local files (.design-context.md) and Model Context Protocol (MCP).

## Scope & Capabilities

### 1. Offline Project Management
- Import project bundles via .zip upload or local folder loading.
- Pre-packaged ready-to-edit project templates:
  - Mobile App (FinTech / Social iOS & Android frame)
  - Web Application (SaaS Dashboard & Responsive Landing)
  - E-Commerce Mobile/Web
- Export full project as .zip with all modified CSS, visual tokens, and embedded audio files.

### 2. Canvas & Visual Inspector (Figma-style)
- Infinite canvas with smooth panning and zooming (viewport controls).
- Device frame presets:
  - Phone (iOS iPhone 16 Pro / Android Pixel)
  - Tablet (iPad Pro)
  - Desktop Web (1440px / Responsive full width)
- Direct Element Inspection:
  - Click any element in the canvas to select it with a bounding box and label indicator.
  - Layer hierarchy tree showing the nested DOM / component structure.
  - Visual property editor: Colors (Background, Text, Border), Typography (Size, Weight, Line Height), Spacing (Padding, Margin), Geometry (Border Radius, Width, Height), Visual FX (Box Shadow, Backdrop Blur, Opacity).

### 3. Sound Design Studio (Audio UI Engine)
- Fully offline Web Audio API sound synthesis engine (generates clean UI sounds without needing external files):
  - Click / Tap
  - Pop / Bubble
  - Switch / Toggle
  - Soft Success Chime
  - Gentle Error Alert
  - Whoosh / Transition
- Custom audio upload support (.mp3, .wav, .ogg).
- Audio binding: Attach synthesized or imported sounds to interactive node triggers (onClick, onHover, onSuccess).
- Live preview testing with audio playback during canvas interaction.

### 4. AI Agent Communication Bridge (MCP & Markdown Context)
- MCP Server (@modelcontextprotocol/sdk):
  - Exposes tools: get_design_tree, modify_element_style, apply_design_theme, bind_sound_effect, export_project_bundle.
- In-App AI Assistant / Prompt Runner:
  - Local natural language prompt executor for design instructions.
- Universal Sync File (.design-context.md):
  - Formatted markdown describing the design tokens, active layers, and sound mappings for agents.
