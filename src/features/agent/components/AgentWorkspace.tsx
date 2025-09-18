import React from 'react';
import { Alert, Space, Typography, Tag } from 'antd';
import AgentPromptPanel from './AgentPromptPanel';
import AgentRunHistory from './AgentRunHistory';
import AgentRunDetail from './AgentRunDetail';
import AgentRunTimeline from './AgentRunTimeline';
import { useAgentWorkspace } from '../hooks/useAgentWorkspace';
import PageContainer from '../../../components/layout/PageContainer';
import { useLanguage } from '../../../contexts/LanguageContext';
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
    templates,
    applyTemplate,
  } = useAgentWorkspace();
  const { t } = useLanguage();

  return (
    <div className="agent-workspace">
      <PageContainer variant="gradient" padded className="agent-hero">
        <Space direction="vertical" size={12}>
          <Typography.Title level={2} style={{ color: 'white', marginBottom: 0 }}>
            {t('agent.heroTitle')}
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}>
            {t('agent.heroSubtitle')}
          </Typography.Paragraph>
          <Space size={[8, 12]} wrap>
            <Tag color="gold">{t('agent.heroTags.reasoning')}</Tag>
            <Tag color="cyan">{t('agent.heroTags.pubmed')}</Tag>
            <Tag color="green">{t('agent.heroTags.cases')}</Tag>
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
          templates={templates}
          onApplyTemplate={applyTemplate}
        />
        {error && (
          <Alert
            message={t('agent.errorTitle')}
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
