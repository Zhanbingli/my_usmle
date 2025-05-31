import { apiClient } from '../utils/api';
import { QuerySession } from '../types';

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

export interface SendMessageResponse {
  response: string;
  sessionId: string;
}

export const geminiApi = {
  // 发送消息给AI
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>('/gemini/query', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send message');
    }
    return response.data!;
  },

  // 获取查询会话历史
  async getSessionHistory(sessionId: string): Promise<QuerySession> {
    const response = await apiClient.get<QuerySession>(`/gemini/sessions/${sessionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get session history');
    }
    return response.data!;
  },

  // 获取用户的所有查询会话
  async getUserSessions(userId: string): Promise<QuerySession[]> {
    const response = await apiClient.get<QuerySession[]>(`/gemini/users/${userId}/sessions`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user sessions');
    }
    return response.data!;
  },

  // 删除查询会话
  async deleteSession(sessionId: string): Promise<void> {
    const response = await apiClient.delete(`/gemini/sessions/${sessionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete session');
    }
  },

  // 更新会话标题
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    const response = await apiClient.patch(`/gemini/sessions/${sessionId}`, { title });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update session title');
    }
  },
}; 