export type AgentMode = 'auto' | 'literature' | 'case';
export type AgentProvider = 'gemini' | 'openai' | 'claude';

export interface AgentActAction {
  step: number;
  tool: string;
  args: Record<string, unknown>;
  status: number;
  ok: boolean;
  output?: unknown;
}

export interface AgentActMeta {
  durationMs: number | null;
  provider: AgentProvider | null;
  model: string | null;
  mode: AgentMode | null;
  usage?: Record<string, unknown> | null;
  offline?: boolean;
}

export interface AgentActResponse {
  answer: string;
  steps: number;
  actions: AgentActAction[];
  citations?: Array<{ pmid: string; title: string; url: string }>;
  meta?: AgentActMeta;
}

export interface AgentModelOption {
  label: string;
  value: string;
  description?: string;
}

export interface AgentProviderConfig {
  label: string;
  description: string;
  models: AgentModelOption[];
}

export interface AgentRun {
  id: string;
  question: string;
  response: AgentActResponse;
  createdAt: string;
  provider: AgentProvider;
  model?: string;
  mode: AgentMode;
}
