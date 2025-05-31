import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { geminiApi, SendMessageRequest } from '../api/geminiApi';
import { useQueryStore } from '../stores/useQueryStore';
import { MessageRole } from '../types';

// 发送消息到AI
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { addMessage, currentSession } = useQueryStore();

  return useMutation({
    mutationFn: geminiApi.sendMessage,
    onMutate: async (variables: SendMessageRequest) => {
      // 乐观更新：立即添加用户消息
      if (currentSession) {
        addMessage(currentSession.id, {
          role: MessageRole.USER,
          content: variables.message,
        });
      }
    },
    onSuccess: (data, variables) => {
      // 添加AI回复
      if (currentSession) {
        addMessage(currentSession.id, {
          role: MessageRole.ASSISTANT,
          content: data.response,
        });
      }
      
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['gemini-sessions'] });
    },
    onError: (error, variables) => {
      console.error('Failed to send message:', error);
      // 可以在这里处理错误，比如显示错误消息
    },
  });
};

// 获取用户的查询会话列表
export const useUserSessions = (userId: string) => {
  return useQuery({
    queryKey: ['gemini-sessions', userId],
    queryFn: () => geminiApi.getUserSessions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 获取单个会话历史
export const useSessionHistory = (sessionId: string) => {
  return useQuery({
    queryKey: ['gemini-session', sessionId],
    queryFn: () => geminiApi.getSessionHistory(sessionId),
    enabled: !!sessionId,
  });
};

// 删除会话
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: geminiApi.deleteSession,
    onSuccess: () => {
      // 使会话列表查询失效
      queryClient.invalidateQueries({ queryKey: ['gemini-sessions'] });
    },
  });
};

// 更新会话标题
export const useUpdateSessionTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      geminiApi.updateSessionTitle(sessionId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gemini-sessions'] });
    },
  });
}; 