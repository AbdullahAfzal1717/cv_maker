export type ChatRole = "user" | "model" | "system";

export interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: Date;
}

export interface MockSession {
  id: string;
  label: string;
}
