import React from 'react';
import { Alert, Space, Typography, Tag } from 'antd';
import AgentPromptPanel from './AgentPromptPanel';
import AgentRunHistory from './AgentRunHistory';
import AgentRunDetail from './AgentRunDetail';
import AgentRunTimeline from './AgentRunTimeline';
import { useAgentWorkspace } from '../hooks/useAgentWorkspace';
import PageContainer from '../../../components/layout/PageContainer';
import '../styles/AgentWorkspace.css';

const AgentWorkspace: React.FC = () => {
  const {
    question,
    setQuestion,
    context,
    setContext,
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
    reuseRun,
    removeRun,
    clearRuns,
    isAuthenticated,
  } = useAgentWorkspace();

  return (
    <div className="agent-workspace">
      <PageContainer variant="gradient" padded className="agent-hero">
        <Space direction="vertical" size={12}>
          <Typography.Title level={2} style={{ color: 'white', marginBottom: 0 }}>
            临床决策智能助手
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}>
            将文献检索、诊断推理与病例拆解整合在一体的智能 Agent，支持快速生成循证回答并追踪工具调用链路。
          </Typography.Paragraph>
          <Space size={[8, 12]} wrap>
            <Tag color="gold">推理链可视化</Tag>
            <Tag color="cyan">PubMed 实时检索</Tag>
            <Tag color="green">病例演练模式</Tag>
          </Space>
        </Space>
      </PageContainer>

      <PageContainer variant="glass" padded>
        <AgentPromptPanel
          question={question}
          onQuestionChange={setQuestion}
          context={context}
          onContextChange={setContext}
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
          onClearHistory={clearRuns}
          runsCount={runs.length}
          loading={loading}
          isAuthenticated={isAuthenticated}
        />
        {error && (
          <Alert
            message="Agent 调用失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            className="agent-alert"
          />
        )}
      </PageContainer>

      <div className="agent-workspace__grid">
        <div className="agent-workspace__main">
          <PageContainer variant="surface" padded>
            <AgentRunDetail run={activeRun} isLoading={loading} onReuse={reuseRun} />
          </PageContainer>
        </div>
        <div className="agent-workspace__aside">
          <PageContainer variant="glass" padded>
            <AgentRunHistory
              runs={runs}
              activeRunId={activeRun?.id ?? null}
              onSelect={selectRun}
              onReuse={reuseRun}
              onRemove={removeRun}
              onClear={clearRuns}
            />
          </PageContainer>
          <PageContainer variant="glass" padded>
            <AgentRunTimeline run={activeRun} />
          </PageContainer>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;
