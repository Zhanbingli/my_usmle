import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Alert, Button, Empty, message, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { ClockCircleOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';
import { PROVIDER_CONFIG } from '../constants';
import { useLanguage } from '../../../contexts/LanguageContext';

const { Text, Paragraph } = Typography;

interface AgentConversationFeedProps {
  runs: AgentRun[];
  activeRunId: string | null;
  onSelect: (id: string) => void;
  onReuse: (id: string) => void;
}

const statusTagColor: Record<NonNullable<AgentRun['status']>, string> = {
  loading: 'gold',
  ready: 'green',
  error: 'red',
};

const AgentConversationFeed: React.FC<AgentConversationFeedProps> = ({ runs, activeRunId, onSelect, onReuse }) => {
  const { t, language } = useLanguage();

  const orderedRuns = useMemo(() => {
    return [...runs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [runs]);

  const handleCopy = async (run: AgentRun) => {
    try {
      if (!run.response?.answer) {
        message.info(t('common.emptyState'));
        return;
      }
      if (!navigator.clipboard) {
        message.info(t('common.copyUnsupported'));
        return;
      }
      await navigator.clipboard.writeText(run.response.answer);
      message.success(t('common.copySuccess'));
    } catch (error) {
      console.warn('Copy failed', error);
      message.warning(t('common.copyFail'));
    }
  };

  if (orderedRuns.length === 0) {
    return (
      <div className="agent-chat-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" size={4} align="center">
              <Text>{t('agent.emptyTitle')}</Text>
              <Text type="secondary">{t('agent.emptySubtitle')}</Text>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div className="agent-chat-feed">
      {orderedRuns.map((run) => {
        const providerLabel = PROVIDER_CONFIG[run.provider]?.label || run.provider;
        const modeLabel = (run.response?.meta?.mode || run.mode || 'auto').toUpperCase();
        const modelLabel = run.response?.meta?.model || run.model;
        const offline = Boolean(run.response?.meta?.offline);
        const createdAtLabel = new Date(run.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US');
        const status = run.status || (run.response ? 'ready' : undefined);

        return (
          <div
            key={run.id}
            className={clsx('agent-chat-message', run.id === activeRunId && 'is-active')}
            onClick={() => onSelect(run.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onSelect(run.id);
              }
            }}
          >
            <div className="agent-chat-meta">
              <Space size={8} wrap>
                <Tag color="geekblue">{providerLabel}</Tag>
                <Tag color="blue">{modeLabel}</Tag>
                {modelLabel && <Tag>{modelLabel}</Tag>}
                {offline && <Tag color="orange">{t('agent.offline')}</Tag>}
                {status && (
                  <Tag color={statusTagColor[status] || 'blue'}>{t(`agent.status.${status}`)}</Tag>
                )}
              </Space>
              <Space size={8} align="center">
                <ClockCircleOutlined />
                <Text type="secondary">{createdAtLabel}</Text>
              </Space>
            </div>

            <div className="agent-chat-bubble agent-chat-bubble--user">
              <Paragraph style={{ marginBottom: 0 }}>{run.question}</Paragraph>
              {run.context && (
                <Text type="secondary" className="agent-chat-context">
                  {run.context}
                </Text>
              )}
            </div>

            <div className="agent-chat-bubble agent-chat-bubble--assistant">
              <div className="agent-chat-actions">
                <Space size={4}>
                  <Tooltip title={t('agent.reuse')}>
                    <Button
                      size="small"
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={(event) => {
                        event.stopPropagation();
                        onReuse(run.id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t('agent.copy')}>
                    <Button
                      size="small"
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopy(run);
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>

              {run.status === 'error' ? (
                <Alert
                  type="error"
                  message={run.error || t('agent.errorTitle')}
                  showIcon
                />
              ) : run.status === 'loading' ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : run.response?.answer ? (
                <Paragraph className="agent-chat-answer">{run.response.answer}</Paragraph>
              ) : (
                <Paragraph type="secondary" className="agent-chat-answer">
                  {t('agent.runThinking')}
                </Paragraph>
              )}

              {run.response?.citations && run.response.citations.length > 0 && (
                <div className="agent-chat-citations">
                  <Text type="secondary">{t('agent.runCitations')}</Text>
                  <Space direction="vertical" size={4} style={{ marginTop: 6 }}>
                    {run.response.citations.map((citation) => (
                      <a key={citation.pmid} href={citation.url} target="_blank" rel="noreferrer">
                        [{citation.pmid}] {citation.title}
                      </a>
                    ))}
                  </Space>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentConversationFeed;
