# DECISIONS.md

## DEC-001 — Offline Architecture & AI Protocol Integration
**Status:** ACCEPTED  
**Context:** The app needs to function 100% offline, allow visual layout & sound editing, export/import project ZIPs, and communicate with AI agents.  
**Decision:** 
1. Client: React 18 + Vite + TypeScript + Tailwind CSS with pure client-side processing (JSZip for ZIP bundling, Web Audio API for zero-dependency sound synthesis).
2. AI Bridge: Dual-channel:
   a) Standardized .design-context.md generation and live parsing for file-based agents.
   b) Standalone Model Context Protocol (MCP) server script that external agents (Claude, Cursor, Antigravity) can connect to over stdio.
3. Audio: Built-in procedural synthesizers (biquad filters, oscillators, gain envelopes) so UI sound effects generate offline without downloading audio samples.
**Why:** Eliminates all network latency and external cloud dependencies while maintaining maximum interoperability with any AI coding agent.  
**Tradeoff:** Audio synthesis covers standard UI sound effects procedurally; custom sound tracks rely on user uploading local audio files.

## DEC-002 — Hybrid Architecture: Offline-First + Direct Cloud AI
**Status:** ACCEPTED  
**Context:** User requested direct online connection with AI models (Anthropic, OpenAI, Gemini, Ollama) directly from the application interface.  
**Decision:** 
1. Integrated a client-side direct API connector (i-cloud-service.ts) capable of calling Anthropic Claude, OpenAI GPT-4o, Google Gemini, and local Ollama instances.
2. Credentials stored strictly in localStorage in the user's browser, preventing any credential leak to external backend servers.
3. Structured JSON Action protocol (AIActionCommand) allowing Cloud models to output visual mutations (MODIFY_STYLE), audio triggers (BIND_SOUND), and theme transformations in real-time.
4. Preserved 100% of offline features: if no API key is set or no internet is available, DesignForge falls back gracefully to local offline heuristics and the local MCP server.
