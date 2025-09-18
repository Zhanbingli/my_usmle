import React from 'react';
import { Alert, Button, Divider, Empty, message, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { CopyOutlined, ReloadOutlined, FieldTimeOutlined, BookOutlined, ProfileOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';

const { Title, Text, Paragraph } = Typography;

interface AgentRunDetailProps {
  run: AgentRun | null;
  isLoading: boolean;
  onReuse: (id: string) => void;
}

const AgentRunDetail: React.FC<AgentRunDetailProps> = ({ run, isLoading, onReuse }) => {
  const { t, language } = useLanguage();
  if (!run) {
    return (
      <div className="agent-panel-empty">
        <Empty description={
          <Space direction="vertical" size={2}>
            <Text type="secondary">{t('agent.emptyTitle')}</Text>
            <Text type="secondary">{t('agent.emptySubtitle')}</Text>
          </Space>
        } />
      </div>
    );
  }

  const meta = run.response?.meta || null;
  const durationSeconds = meta?.durationMs ? (meta.durationMs / 1000).toFixed(2) : null;
  const usage = meta?.usage && typeof meta.usage === 'object' ? meta.usage : null;
  const isLoadingRun = run.status === 'loading';
  const isErrorRun = run.status === 'error';

  const handleCopyAnswer = async () => {
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
    } catch (err) {
      console.warn('Clipboard copy failed', err);
      message.warning(t('common.copyFail'));
    }
  };

  return (
    <div className="agent-run-detail">
      <div className="agent-run-detail__header">
        <div>
          <Text type="secondary">{t('agent.runQuestion')}</Text>
          <Title level={4} style={{ marginBottom: 0 }}>{run.question}</Title>
        </div>
        <Space size={12}>
          <Tooltip title={t('agent.reuse')}>
            <Button icon={<ReloadOutlined />} onClick={() => onReuse(run.id)}>
              {t('agent.reuse')}
            </Button>
          </Tooltip>
          <Tooltip title={t('agent.copy')}>
            <Button icon={<CopyOutlined />} onClick={handleCopyAnswer} type="text" />
          </Tooltip>
        </Space>
      </div>

      <div className="agent-run-detail__meta">
        <Space size={[8, 8]} wrap>
          <Tag color="geekblue">Provider: {meta?.provider ?? run.provider}</Tag>
          <Tag color="purple">Model: {meta?.model ?? run.model}</Tag>
          <Tag color="blue">Mode: {(meta?.mode ?? run.mode).toUpperCase()}</Tag>
          {meta?.offline && <Tag color="orange">{t('agent.offline')}</Tag>}
          {durationSeconds && (
            <Tag color="green" icon={<FieldTimeOutlined />}>
              {language === 'zh'
                ? `耗时 ${durationSeconds} 秒`
                : t('agent.duration', { seconds: durationSeconds })}
            </Tag>
          )}
        </Space>
        {usage && (
          <Text type="secondary" className="agent-run-detail__usage">
            {t('agent.tokenUsage', {
              usage: Object.entries(usage)
                .map(([key, value]) => `${key}: ${value as string | number}`)
                .join(' / ')
            })}
          </Text>
        )}
        {run.context && (
          <div className="agent-run-detail__context">
            <Space align="start">
              <ProfileOutlined style={{ color: '#6366f1', marginTop: 4 }} />
              <Text type="secondary">{run.context}</Text>
            </Space>
          </div>
        )}
      </div>

      <Divider />

      <div className="agent-run-detail__body">
        {isErrorRun ? (
          <Alert type="error" message={run.error || t('agent.errorTitle')} showIcon />
        ) : isLoading || isLoadingRun ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : run.response?.answer ? (
          <Paragraph className="agent-answer">{run.response.answer}</Paragraph>
        ) : (
          <Paragraph className="agent-answer" type="secondary">
            {t('agent.runThinking')}
          </Paragraph>
        )}
      </div>

      {run.response?.citations && run.response.citations.length > 0 && (
        <div className="agent-run-detail__citations">
          <Text type="secondary">{t('agent.runCitations')}</Text>
          <Space direction="vertical" size={6} style={{ marginTop: 8 }}>
            {run.response.citations.map((citation) => (
              <a key={citation.pmid} href={citation.url} target="_blank" rel="noreferrer">
                <Space size={6}>
                  <BookOutlined />
                  <span>[{citation.pmid}] {citation.title}</span>
                </Space>
              </a>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default AgentRunDetail;
