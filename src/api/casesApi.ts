import { apiClient } from '../utils/api';
import { Case, PaginationParams } from '../types';

export interface CaseFilters {
  difficulty?: string;
  category?: string;
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
  diagnosis: string;
  isCorrect: boolean;
  feedback: string;
  timeSpent?: number; // in seconds
  createdAt: string;
  updatedAt?: string;
}

export interface DiagnosisResponse {
  isCorrect: boolean;
  correctDiagnosis: string;
  feedback: string;
}

export const casesApi = {
  // 获取病例列表（简化版，不需要分页参数）
  async getCases(filters?: CaseFilters): Promise<Case[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<Case[]>(`/cases?${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get cases');
    }
    return response.data!;
  },

  // 获取单个病例详情
  async getCaseById(id: string, includeAnswer: boolean = false): Promise<Case> {
    const params = new URLSearchParams();
    if (!includeAnswer) params.append('includeAnswer', 'false');

    const response = await apiClient.get<Case>(`/cases/${id}?${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get case');
    }
    return response.data!;
  },

  // 提交诊断
  async submitDiagnosis(caseId: string, diagnosis: string): Promise<DiagnosisResponse> {
    const response = await apiClient.post<DiagnosisResponse>(`/cases/${caseId}/diagnose`, {
      diagnosis,
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit diagnosis');
    }
    return response.data!;
  },

  // 获取用户的病例尝试记录
  async getUserAttempts(userId: string): Promise<CaseAttempt[]> {
    const response = await apiClient.get<CaseAttempt[]>(`/cases/users/${userId}/attempts`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get case attempts');
    }
    return response.data!;
  },

  // 保持旧的API兼容性
  async getCasesWithPagination(
    pagination: PaginationParams,
    filters?: CaseFilters
  ): Promise<CasesResponse> {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      pageSize: pagination.pageSize.toString(),
    });
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<CasesResponse>(`/cases/paginated?${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get cases');
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