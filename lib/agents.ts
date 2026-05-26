import { Agent } from "./types";

export const defaultAgents: Agent[] = [
  {
    id: "claude-general",
    name: "Claude",
    model: "claude-sonnet-4-6",
    systemPrompt: "You are Claude, a helpful, harmless, and honest AI assistant. Be concise but thorough.",
    color: "#00d4ff",
    icon: "brain",
    status: "active",
    description: "General purpose assistant",
  },
  {
    id: "code-expert",
    name: "Code Expert",
    model: "claude-sonnet-4-6",
    systemPrompt: "You are an expert software engineer. Provide clean, well-structured code with brief explanations. Default to modern best practices.",
    color: "#10b981",
    icon: "code",
    status: "idle",
    description: "Software engineering specialist",
  },
  {
    id: "analyst",
    name: "Analyst",
    model: "claude-sonnet-4-6",
    systemPrompt: "You are a sharp analytical thinker. Break down complex problems with structured reasoning, data-driven insights, and clear recommendations.",
    color: "#8b5cf6",
    icon: "chart",
    status: "idle",
    description: "Strategic analysis & insights",
  },
  {
    id: "creative",
    name: "Creative",
    model: "claude-sonnet-4-6",
    systemPrompt: "You are a creative collaborator with a flair for original ideas. Help brainstorm, write, and explore creative possibilities.",
    color: "#f59e0b",
    icon: "sparkles",
    status: "idle",
    description: "Brainstorming & creative work",
  },
];
