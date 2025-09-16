import { useCallback, useMemo, useState } from 'react';
import { agentApi } from '../../../api/agentApi';
import { AgentMode, AgentProvider, AgentRun } from '../types';
import { PROVIDER_CONFIG, SUGGESTED_PROMPTS } from '../constants';
import { useAuth } from '../../../contexts/AuthContext';

interface UseAgentWorkspaceResult {
  question: string;
  setQuestion: (value: string) => void;
  mode: AgentMode;
  setMode: (value: AgentMode) => void;
  provider: AgentProvider;
  setProvider: (value: AgentProvider) => void;
  model?: string;
  setModel: (value: string) => void;
  runs: AgentRun[];
  activeRun: AgentRun | null;
  selectRun: (id: string) => void;
  submit: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  suggestions: string[];
  providerOptions: Array<{ value: AgentProvider; label: string }>;
  modelOptions: Array<{ label: string; value: string; description?: string }>;
  isAuthenticated: boolean;
}

export const useAgentWorkspace = (): UseAgentWorkspaceResult => {
  const { isLoggedIn } = useAuth();
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<AgentMode>('auto');
  const [provider, setProvider] = useState<AgentProvider>('gemini');
  const [model, setModel] = useState<string | undefined>(PROVIDER_CONFIG.gemini.models[0]?.value);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerOptions = useMemo(
    () => (Object.keys(PROVIDER_CONFIG) as AgentProvider[]).map((key) => ({
      value: key,
      label: PROVIDER_CONFIG[key].label,
    })),
    []
  );

  const modelOptions = useMemo(() => PROVIDER_CONFIG[provider].models, [provider]);

  const activeRun = useMemo(
    () => runs.find((run) => run.id === activeRunId) ?? runs[0] ?? null,
    [runs, activeRunId]
  );

  const submit = useCallback(async () => {
    if (!question.trim()) return;

    if (!isLoggedIn) {
      setError('请先登录再使用智能 Agent 功能');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await agentApi.act({ goal: question, mode, provider, model });
      const run: AgentRun = {
        id: `${Date.now()}`,
        question: question.trim(),
        response,
        createdAt: new Date().toISOString(),
        provider,
        model,
        mode,
      };
      setRuns((prev) => [run, ...prev]);
      setActiveRunId(run.id);
      setQuestion('');
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Agent 调用失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [question, mode, provider, model, isLoggedIn]);

  const selectRun = useCallback((id: string) => {
    setActiveRunId(id);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    question,
    setQuestion,
    mode,
    setMode,
    provider,
    setProvider: (value: AgentProvider) => {
      setProvider(value);
      setModel(PROVIDER_CONFIG[value].models[0]?.value);
    },
    model,
    setModel,
    runs,
    activeRun,
    selectRun,
    submit,
    loading,
    error,
    clearError,
    suggestions: SUGGESTED_PROMPTS,
    providerOptions,
    modelOptions,
    isAuthenticated: isLoggedIn,
  };
};
