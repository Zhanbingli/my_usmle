import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runAgent, providers, AgentProviderId, AgentRunResult } from './api/agent';
import './App.css';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  pending?: boolean;
  error?: string;
  meta?: AgentRunResult['meta'];
}

function createMessage(role: ChatRole, content: string, pending = false): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: Date.now(),
    pending,
  };
}

function buildContext(messages: ChatMessage[]): string | undefined {
  if (messages.length === 0) return undefined;
  const recent = messages.slice(-6);
  const serialized = recent
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  return serialized || undefined;
}

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [providerId, setProviderId] = useState<AgentProviderId>('gemini');
  const [modelId, setModelId] = useState(() => {
    const config = providers.find((item) => item.id === 'gemini');
    return config?.defaultModel || '';
  });
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const providerConfig = useMemo(() => providers.find((item) => item.id === providerId), [providerId]);
  const availableModels = providerConfig?.models ?? [];

  const scrollToBottom = useCallback(() => {
    const viewport = document.querySelector('.chat-view');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  const handleSend = useCallback(async () => {
    const prompt = inputValue.trim();
    if (!prompt) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = createMessage('user', prompt);
    const pendingMessage = createMessage('assistant', '正在思考…', true);

    setChatMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInputValue('');
    composerRef.current?.focus();
    setIsSending(true);

    try {
      const context = buildContext([...chatMessages, userMessage]);
      const result = await runAgent({
        prompt,
        context,
        provider: providerId,
        model: modelId,
        signal: controller.signal,
      });
      const answerText = result.offline ? `${result.answer}\n\n（当前使用离线模式）` : result.answer;

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingMessage.id
            ? {
                ...msg,
                pending: false,
                content: answerText,
                error: undefined,
                meta: {
                  ...result.meta,
                  provider: result.meta?.provider ?? providerId,
                },
              }
            : msg
        )
      );
    } catch (error) {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingMessage.id
            ? {
                ...msg,
                pending: false,
                error: error instanceof Error ? error.message : String(error),
                content: '出错了，请稍后再试。',
              }
            : msg
        )
      );
      composerRef.current?.focus();
    } finally {
      setIsSending(false);
      scrollToBottom();
      abortRef.current = null;
    }
  }, [chatMessages, inputValue, modelId, providerId, scrollToBottom]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void handleSend();
    },
    [handleSend]
  );

  const handleProviderChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextProvider = event.target.value as AgentProviderId;
    setProviderId(nextProvider);
    const config = providers.find((item) => item.id === nextProvider);
    setModelId(config?.defaultModel || '');
  }, []);

  const handleModelChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setModelId(event.target.value);
  }, []);

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsSending(false);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                ...msg,
                pending: false,
                content: `${msg.content}\n\n已停止当前请求。`,
              }
            : msg
        )
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  return (
    <div className="app-root">
      <div className="agent-shell">
        <header className="agent-header">
          <div>
            <h1>USMLE AI Agent</h1>
            <p>选择模型，直接与智能 AI 进行对话。</p>
          </div>
          <div className="agent-presets">
            <label>
              Provider
              <select value={providerId} onChange={handleProviderChange}>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Model
              <select value={modelId} onChange={handleModelChange}>
                {availableModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {providerConfig?.description && (
            <p className="agent-provider-hint">{providerConfig.description}</p>
          )}
        </header>

        <section className="chat-view">
          {chatMessages.length === 0 ? (
            <div className="chat-empty">
              <h2>开始新的对话</h2>
              <p>输入你的临床问题或学习目标，AI 会提供一步步的解答。</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div key={message.id} className={`chat-message chat-message--${message.role}`}>
                <div className="chat-message__meta">
                  <span>{message.role === 'user' ? '你' : 'Agent'}</span>
                  <time>{new Date(message.timestamp).toLocaleTimeString()}</time>
                </div>
                <div className="chat-message__bubble">
                  {message.pending && <span className="chat-message__pending">思考中…</span>}
                  {message.content && <p>{message.content}</p>}
                  {message.error && <p className="chat-message__error">{message.error}</p>}
                  {message.role === 'assistant' && message.meta && (
                    <div className="chat-message__meta-note">
                      <span>{message.meta.provider?.toUpperCase() || providerId}</span>
                      {message.meta.model && <span>{message.meta.model}</span>}
                      {typeof message.meta.durationMs === 'number' && (
                        <span>{(message.meta.durationMs / 1000).toFixed(1)}s</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        <footer className="agent-composer">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={composerRef}
              value={inputValue}
              placeholder="描述你的问题，例如：请根据以下症状提供可能的诊断思路。"
              onChange={(event) => setInputValue(event.target.value)}
              rows={4}
              disabled={isSending}
            />
            <div className="agent-composer__actions">
              {isSending ? (
                <button type="button" onClick={handleStop} className="secondary">
                  停止
                </button>
              ) : (
                <button type="submit" disabled={!inputValue.trim()}>
                  发送
                </button>
              )}
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default App;
