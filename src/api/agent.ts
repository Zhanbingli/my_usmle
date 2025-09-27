export type AgentProviderId = 'gemini' | 'openai' | 'claude';

export interface AgentModelOption {
  label: string;
  value: string;
  description?: string;
}

export interface AgentProviderConfig {
  id: AgentProviderId;
  label: string;
  description: string;
  models: AgentModelOption[];
  defaultModel: string;
}

export interface AgentRunOptions {
  prompt: string;
  provider: AgentProviderId;
  model?: string;
  context?: string;
  signal?: AbortSignal;
}

export interface AgentRunResult {
  answer: string;
  meta?: {
    provider?: string | null;
    model?: string | null;
    durationMs?: number | null;
    offline?: boolean;
  };
  offline?: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const providers: AgentProviderConfig[] = [
  {
    id: 'gemini',
    label: 'Google Gemini',
    description: '适合需要快速工具调用与长上下文的场景。',
    defaultModel: 'gemini-1.5-pro',
    models: [
      { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
      { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    description: '适合自然语言交互与通用回答。',
    defaultModel: 'gpt-4o-mini',
    models: [
      { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
      { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
    ],
  },
  {
    id: 'claude',
    label: 'Anthropic Claude',
    description: '擅长结构化总结与多轮推理。',
    defaultModel: 'claude-3-5-sonnet',
    models: [
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
      { label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku' },
    ],
  },
];

export async function runAgent({ prompt, provider, model, context, signal }: AgentRunOptions): Promise<AgentRunResult> {
  const body = {
    goal: prompt,
    context,
    mode: 'auto',
    provider,
    model,
  };

  const response = await fetch(`${API_BASE_URL}/agent/act`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Agent request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  if (!payload.success) {
    throw new Error(payload.error || 'Agent returned an error');
  }

  const data = payload.data as AgentRunResult;
  return {
    ...data,
    offline: payload.offline ?? data.meta?.offline ?? false,
  };
}
