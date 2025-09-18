import { useCallback, useMemo, useState } from 'react';
import { agentApi } from '../../../api/agentApi';
import { AgentMode, AgentProvider, AgentPromptTemplate, AgentRun } from '../types';
import { AGENT_TEMPLATES, PROVIDER_CONFIG, SUGGESTED_PROMPTS } from '../constants';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';

interface UseAgentWorkspaceResult {
  question: string;
  setQuestion: (value: string) => void;
  context: string;
  setContext: (value: string) => void;
  mode: AgentMode;
  setMode: (value: AgentMode) => void;
  provider: AgentProvider;
  setProvider: (value: AgentProvider) => void;
  model?: string;
  setModel: (value: string) => void;
  runs: AgentRun[];
  activeRun: AgentRun | null;
  selectRun: (id: string) => void;
  reuseRun: (id: string) => void;
  removeRun: (id: string) => void;
  clearRuns: () => void;
  submit: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  suggestions: string[];
  providerOptions: Array<{ value: AgentProvider; label: string }>;
  modelOptions: Array<{ label: string; value: string; description?: string }>;
  isAuthenticated: boolean;
  templates: AgentPromptTemplate[];
  applyTemplate: (template: AgentPromptTemplate) => void;
}

export const useAgentWorkspace = (): UseAgentWorkspaceResult => {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [mode, setMode] = useState<AgentMode>('auto');
  const [provider, setProviderState] = useState<AgentProvider>('gemini');
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
      const response = await agentApi.act({ goal: question, context: context || undefined, mode, provider, model });
      const responseMeta = response.meta;
      const resolvedProvider = (responseMeta?.provider as AgentProvider | null) || provider;
      const resolvedModel = responseMeta?.model ?? model;
      const resolvedMode = (responseMeta?.mode as AgentMode | null) || mode;
      const run: AgentRun = {
        id: `${Date.now()}`,
        question: question.trim(),
        response,
        createdAt: new Date().toISOString(),
        provider: resolvedProvider,
        model: resolvedModel,
        mode: resolvedMode,
        context: context?.trim() || undefined,
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
  }, [question, context, mode, provider, model, isLoggedIn]);

  const selectRun = useCallback((id: string) => {
    setActiveRunId(id);
  }, []);

  const reuseRun = useCallback(
    (id: string) => {
      const target = runs.find((run) => run.id === id);
      if (!target) return;
      setQuestion(target.question);
      setMode(target.mode);
      setProviderState(target.provider);
      if (target.model) {
        setModel(target.model);
      } else {
        setModel(PROVIDER_CONFIG[target.provider].models[0]?.value);
      }
      setContext(target.context || '');
    },
    [runs, setMode, setProviderState, setModel, setContext]
  );

  const removeRun = useCallback((id: string) => {
    setRuns((prev) => {
      const nextRuns = prev.filter((run) => run.id !== id);
      setActiveRunId((prevActive) => {
        if (prevActive === id) {
          return nextRuns[0]?.id ?? null;
        }
        return prevActive;
      });
      return nextRuns;
    });
  }, []);

  const clearRuns = useCallback(() => {
    setRuns([]);
    setActiveRunId(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const applyTemplate = useCallback((template: AgentPromptTemplate) => {
    setQuestion(template.question);
    setContext(template.context || '');
    if (template.mode) {
      setMode(template.mode);
    }
    if (template.provider) {
      setProviderState(template.provider);
      setModel(PROVIDER_CONFIG[template.provider].models[0]?.value);
    }
  }, []);

  return {
    question,
    setQuestion,
    context,
    setContext,
    mode,
    setMode,
    provider,
    setProvider: (value: AgentProvider) => {
      setProviderState(value);
      setModel(PROVIDER_CONFIG[value].models[0]?.value);
    },
    model,
    setModel,
    runs,
    activeRun,
    selectRun,
    reuseRun,
    removeRun,
    clearRuns,
    submit,
    loading,
    error,
    clearError,
    suggestions: SUGGESTED_PROMPTS[language],
    providerOptions,
    modelOptions,
    isAuthenticated: isLoggedIn,
    templates: AGENT_TEMPLATES,
    applyTemplate,
  };
};
