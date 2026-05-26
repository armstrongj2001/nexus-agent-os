export type AgentStatus = "active" | "idle" | "offline";

export interface Agent {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  color: string;
  icon: string;
  status: AgentStatus;
  description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId: string;
}

export interface ActivityEvent {
  id: string;
  type: "message" | "response" | "switch" | "connect" | "error";
  label: string;
  timestamp: Date;
  agentId?: string;
}
