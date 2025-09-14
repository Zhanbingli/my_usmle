import { useQuery } from '@tanstack/react-query';
import { pubmedApi } from '../api/pubmedApi';
import { Article } from '../types';

interface PubMedSearchParams {
  query?: string;
  journal?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'relevance' | 'date' | 'citations';
}

export const usePubMedSearch = (params: PubMedSearchParams) => {
  return useQuery({
    queryKey: ['pubmed-search', params],
    queryFn: () => pubmedApi.searchArticles(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

export const useArticleDetails = (pmid: string) => {
  return useQuery({
    queryKey: ['article-details', pmid],
    queryFn: () => pubmedApi.getArticleDetails(pmid),
    enabled: !!pmid,
  });
};

export const useSaveArticle = () => {
  // 这里可以添加保存文章的mutation
  // 暂时返回一个空的实现
  return {
    mutate: (article: Article) => {
      console.log('保存文章:', article);
    },
    isPending: false,
  };
}; 