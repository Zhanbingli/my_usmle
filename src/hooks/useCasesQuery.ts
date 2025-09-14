import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesApi, DiagnosisResponse } from '../api/casesApi';
import { Case } from '../types';

interface CaseFilters {
  category?: string;
  difficulty?: string;
  search?: string;
}

export const useCases = (filters: CaseFilters = {}) => {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => casesApi.getCases(filters),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

export const useCase = (caseId: string, includeAnswer: boolean = false) => {
  return useQuery({
    queryKey: ['case', caseId, includeAnswer],
    queryFn: () => casesApi.getCaseById(caseId, includeAnswer),
    enabled: !!caseId,
  });
};

export const useSubmitDiagnosis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, diagnosis }: { caseId: string; diagnosis: string }) => 
      casesApi.submitDiagnosis(caseId, diagnosis),
    onSuccess: (data: DiagnosisResponse, variables) => {
      // 更新病例详情缓存，包含答案
      queryClient.setQueryData(
        ['case', variables.caseId, true],
        (oldData: Case | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              correctDiagnosis: data.correctDiagnosis
            };
          }
          return oldData;
        }
      );
    },
  });
};

export const useCaseAttempts = (userId: string) => {
  return useQuery({
    queryKey: ['case-attempts', userId],
    queryFn: () => casesApi.getUserAttempts(userId),
    enabled: !!userId,
  });
}; 