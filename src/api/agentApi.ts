import { apiClient } from '../utils/api';

export interface AgentActRequest {
  goal: string;
  context?: string;
  mode?: 'auto' | 'literature' | 'case';
}

export interface AgentActResponse {
  answer: string;
  steps: number;
  actions: Array<{ step: number; tool: string; args: any; status: number; ok: boolean }>;
  citations?: Array<{ pmid: string; title: string; url: string }>;
}

export const agentApi = {
  async act(payload: AgentActRequest): Promise<AgentActResponse> {
    const resp = await apiClient.post<{ answer: string; steps: number; actions: any[] }>(`/agent/act`, payload);
    if (!resp.success) throw new Error(resp.error || 'Agent failed');
    return resp.data as AgentActResponse;
  },
};
