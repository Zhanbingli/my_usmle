import { apiClient } from '../utils/api';
import { Case, Difficulty, Specialty, PaginationParams } from '../types';

export interface CaseFilters {
  difficulty?: Difficulty;
  specialty?: Specialty;
  search?: string;
}

export interface CasesResponse {
  cases: Case[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CaseAttempt {
  id: string;
  caseId: string;
  userId: string;
  answers: Record<string, any>;
  score: number;
  completed: boolean;
  timeSpent: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export const casesApi = {
  // 获取病例列表
  async getCases(
    pagination: PaginationParams,
    filters?: CaseFilters
  ): Promise<CasesResponse> {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      pageSize: pagination.pageSize.toString(),
      ...filters,
    });

    const response = await apiClient.get<CasesResponse>(`/cases?${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get cases');
    }
    return response.data!;
  },

  // 获取单个病例详情
  async getCaseById(id: string): Promise<Case> {
    const response = await apiClient.get<Case>(`/cases/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get case');
    }
    return response.data!;
  },

  // 获取用户的病例尝试记录
  async getUserCaseAttempts(userId: string): Promise<CaseAttempt[]> {
    const response = await apiClient.get<CaseAttempt[]>(`/cases/users/${userId}/attempts`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get case attempts');
    }
    return response.data!;
  },

  // 提交病例答案
  async submitCaseAttempt(
    caseId: string,
    answers: Record<string, any>
  ): Promise<CaseAttempt> {
    const response = await apiClient.post<CaseAttempt>(`/cases/${caseId}/submit`, {
      answers,
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit case attempt');
    }
    return response.data!;
  },

  // 获取病例统计信息
  async getCaseStats(caseId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
  }> {
    const response = await apiClient.get(`/cases/${caseId}/stats`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get case stats');
    }
    return response.data!;
  },

  // 获取推荐病例
  async getRecommendedCases(userId: string): Promise<Case[]> {
    const response = await apiClient.get<Case[]>(`/cases/users/${userId}/recommended`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get recommended cases');
    }
    return response.data!;
  },
}; 