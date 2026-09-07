import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";

// Initialize MCP Server for DesignForge
const server = new Server(
  {
    name: "designforge-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const CONTEXT_FILE_PATH = path.resolve(process.cwd(), ".design-context.md");
const ACTIONS_FILE_PATH = path.resolve(process.cwd(), ".design-actions.json");

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_design_context",
        description: "Retrieves the current visual structure, design tokens, element styles, and sound mappings of the active DesignForge project.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "modify_element_style",
        description: "Modifies the visual CSS styles (background, textColor, borderRadius, padding, etc.) of a specific UI component in DesignForge.",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The unique identifier of the element to modify (e.g., 'primary-button', 'card-1', 'header-title')",
            },
            styles: {
              type: "object",
              description: "Key-value pair of style properties to update, e.g. { 'backgroundColor': '#6366f1', 'color': '#ffffff', 'borderRadius': '16px' }",
            },
          },
          required: ["nodeId", "styles"],
        },
      },
      {
        name: "bind_sound_effect",
        description: "Assigns a UI sound effect (synthesized Web Audio or audio file) to a component event in DesignForge.",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The unique identifier of the element to assign sound to",
            },
            trigger: {
              type: "string",
              enum: ["onClick", "onHover", "onSuccess", "onError"],
              description: "The interaction trigger event",
            },
            soundType: {
              type: "string",
              enum: ["click", "pop", "switch", "chime", "alert", "whoosh", "bell"],
              description: "The synthesized procedural sound effect type",
            },
          },
          required: ["nodeId", "trigger", "soundType"],
        },
      },
      {
        name: "apply_theme_palette",
        description: "Applies a cohesive theme palette (colors, radius, shadows, sounds) across the whole project.",
        inputSchema: {
          type: "object",
          properties: {
            themeName: {
              type: "string",
              description: "Name or preset of the theme (e.g. 'cyberpunk-neon', 'minimalist-mono', 'emerald-modern', 'ios-clean')",
            },
            primaryColor: { type: "string" },
            secondaryColor: { type: "string" },
            backgroundColor: { type: "string" },
            textColor: { type: "string" },
            borderRadius: { type: "string" },
            soundPack: { type: "string" }
          },
          required: ["themeName"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Queue actions into .design-actions.json so the client live-reloads them
  let actions = [];
  if (fs.existsSync(ACTIONS_FILE_PATH)) {
    try {
      actions = JSON.parse(fs.readFileSync(ACTIONS_FILE_PATH, "utf8"));
    } catch {
      actions = [];
    }
  }

  if (name === "get_design_context") {
    let content = "No active design context found.";
    if (fs.existsSync(CONTEXT_FILE_PATH)) {
      content = fs.readFileSync(CONTEXT_FILE_PATH, "utf8");
    }
    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }

  if (name === "modify_element_style") {
    const action = {
      type: "MODIFY_STYLE",
      id: "action-" + Date.now(),
      timestamp: new Date().toISOString(),
      nodeId: args.nodeId,
      styles: args.styles,
    };
    actions.push(action);
    fs.writeFileSync(ACTIONS_FILE_PATH, JSON.stringify(actions, null, 2), "utf8");

    return {
      content: [
        {
          type: "text",
          text: Success: Queued style modification for node ''. DesignForge client will apply it immediately.,
        },
      ],
    };
  }

  if (name === "bind_sound_effect") {
    const action = {
      type: "BIND_SOUND",
      id: "action-" + Date.now(),
      timestamp: new Date().toISOString(),
      nodeId: args.nodeId,
      trigger: args.trigger,
      soundType: args.soundType,
    };
    actions.push(action);
    fs.writeFileSync(ACTIONS_FILE_PATH, JSON.stringify(actions, null, 2), "utf8");

    return {
      content: [
        {
          type: "text",
          text: Success: Bound '' sound to '' on node ''.,
        },
      ],
    };
  }

  if (name === "apply_theme_palette") {
    const action = {
      type: "APPLY_THEME",
      id: "action-" + Date.now(),
      timestamp: new Date().toISOString(),
      theme: args,
    };
    actions.push(action);
    fs.writeFileSync(ACTIONS_FILE_PATH, JSON.stringify(actions, null, 2), "utf8");

    return {
      content: [
        {
          type: "text",
          text: Success: Theme '' queued for application in DesignForge.,
        },
      ],
    };
  }

  return {
    isError: true,
    content: [{ type: "text", text: Unknown tool:  }],
  };
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DesignForge MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running DesignForge MCP server:", error);
  process.exit(1);
});
