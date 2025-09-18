import React from 'react';
import { Alert, Empty, Skeleton, Space, Tag, Timeline, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';

const { Text, Title } = Typography;

interface AgentRunTimelineProps {
  run: AgentRun | null;
}

const formatValue = (value: unknown): string => {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    return stringified.length > 180 ? `${stringified.slice(0, 180)}…` : stringified;
  } catch (error) {
    return '[无法序列化结果]';
  }
};

const AgentRunTimeline: React.FC<AgentRunTimelineProps> = ({ run }) => {
  const { t } = useLanguage();
  const hasActions = Boolean(run && run.response?.actions && run.response.actions.length > 0);

  return (
    <div className="agent-timeline">
      <div className="agent-timeline__header">
        <Space size={8} align="center">
          <ThunderboltOutlined style={{ color: '#6366f1' }} />
          <Title level={5} style={{ margin: 0 }}>{t('agent.timelineTitle')}</Title>
        </Space>
      </div>

      {!run ? (
        <div className="agent-timeline__empty">
          <Empty description={t('agent.timelineEmpty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : run.status === 'loading' ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : run.status === 'error' ? (
        <Alert type="error" message={run.error || t('agent.errorTitle')} showIcon />
      ) : !hasActions ? (
        <div className="agent-timeline__empty">
          <Empty description={t('agent.timelineEmpty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <Timeline
          items={(run.response?.actions || []).map((action) => ({
            color: action.ok ? 'green' : 'red',
            children: (
              <div className="agent-timeline__item">
                <Space size={8} wrap align="start">
                  <Tag color="blue">STEP {action.step}</Tag>
                  <Text strong>{action.tool}</Text>
                  <Tag color={action.ok ? 'green' : 'red'}>{action.ok ? t('agent.actionSuccess') : t('agent.actionFailure')}</Tag>
                </Space>
                <Text type="secondary">{t('agent.statusCode')}：{action.status}</Text>
                {action.args && Object.keys(action.args).length > 0 && (
                  <Text type="secondary">{t('agent.params')}：{formatValue(action.args)}</Text>
                )}
                {typeof action.output !== 'undefined' && action.output !== null && (
                  <Text type="secondary">{t('agent.output')}：{formatValue(action.output)}</Text>
                )}
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
};

export default AgentRunTimeline;
