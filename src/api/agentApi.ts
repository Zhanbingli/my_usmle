import { apiClient } from '../utils/api';
import { AgentActResponse, AgentMode, AgentProvider } from '../features/agent/types';

export interface AgentActRequest {
  goal: string;
  context?: string;
  mode?: AgentMode;
  provider?: AgentProvider;
  model?: string;
}

export const agentApi = {
  async act(payload: AgentActRequest): Promise<AgentActResponse> {
    const resp = await apiClient.post<{ answer: string; steps: number; actions: any[] }>(`/agent/act`, payload);
    if (!resp.success) throw new Error(resp.error || 'Agent failed');
    return resp.data as AgentActResponse;
  },
};

export type { AgentProvider, AgentMode, AgentActResponse };
