import React from 'react';
import { Alert } from 'antd';
import AgentPromptPanel from './AgentPromptPanel';
import AgentRunHistory from './AgentRunHistory';
import AgentRunDetail from './AgentRunDetail';
import AgentRunTimeline from './AgentRunTimeline';
import { useAgentWorkspace } from '../hooks/useAgentWorkspace';
import '../styles/AgentWorkspace.css';

const AgentWorkspace: React.FC = () => {
  const {
    question,
    setQuestion,
    provider,
    setProvider,
    providerOptions,
    model,
    setModel,
    modelOptions,
    mode,
    setMode,
    suggestions,
    submit,
    loading,
    error,
    clearError,
    runs,
    activeRun,
    selectRun,
  } = useAgentWorkspace();

  return (
    <div className="agent-workspace">
      <AgentPromptPanel
        question={question}
        onQuestionChange={setQuestion}
        provider={provider}
        onProviderChange={setProvider}
        providerOptions={providerOptions}
        model={model}
        onModelChange={setModel}
        modelOptions={modelOptions}
        mode={mode}
        onModeChange={setMode}
        suggestions={suggestions}
        onSubmit={submit}
        loading={loading}
      />

      {error && (
        <Alert
          message="Agent 调用失败"
          description={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}

      <div className="agent-layout">
        <div className="agent-layout__sidebar">
          <AgentRunHistory
            runs={runs}
            activeRunId={activeRun?.id ?? null}
            onSelect={selectRun}
          />
        </div>
        <div className="agent-layout__content">
          <AgentRunDetail run={activeRun} isLoading={loading} />
        </div>
        <div className="agent-layout__timeline">
          <AgentRunTimeline run={activeRun} />
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;
