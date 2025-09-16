import { apiClient } from '../utils/api';
import { Article } from '../types';

interface PubMedSearchParams {
  query?: string;
  journal?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'relevance' | 'date' | 'citations';
}

export const pubmedApi = {
  // 搜索文章 - 使用GET请求
  async searchArticles(params: PubMedSearchParams): Promise<Article[]> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.journal) searchParams.append('journal', params.journal);
    if (params.author) searchParams.append('author', params.author);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);

    const response = await apiClient.get<Article[]>(`/pubmed/search?${searchParams}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to search articles');
    }
    return response.data!;
  },

  // 获取文章详情
  async getArticleDetails(pmid: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/pubmed/articles/${pmid}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get article details');
    }
    return response.data!;
  },

  // 获取相关文章
  async getRelatedArticles(pmid: string): Promise<Article[]> {
    const response = await apiClient.get<Article[]>(`/pubmed/articles/${pmid}/related`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get related articles');
    }
    return response.data!;
  },

  // 保存文章到收藏
  async saveArticle(pmid: string, userId: string): Promise<void> {
    const response = await apiClient.post(`/pubmed/articles/${pmid}/save`, {
      userId
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to save article');
    }
  },

  // 获取用户收藏的文章
  async getSavedArticles(userId: string): Promise<Article[]> {
    const response = await apiClient.get<Article[]>(`/pubmed/users/${userId}/saved`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get saved articles');
    }
    return response.data!;
  },
}; 
