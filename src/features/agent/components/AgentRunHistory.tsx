import React from 'react';
import clsx from 'clsx';
import { Button, Empty, Space, Tag, Tooltip, Typography } from 'antd';
import { RobotOutlined, DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';
import { PROVIDER_CONFIG } from '../constants';
import { useLanguage } from '../../../contexts/LanguageContext';

const { Text, Title, Paragraph } = Typography;

interface AgentRunHistoryProps {
  runs: AgentRun[];
  activeRunId: string | null;
  onSelect: (id: string) => void;
  onReuse: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const AgentRunHistory: React.FC<AgentRunHistoryProps> = ({
  runs,
  activeRunId,
  onSelect,
  onReuse,
  onRemove,
  onClear,
}) => {
  const { t, language } = useLanguage();
  return (
    <div className="agent-history">
      <div className="agent-history__header">
        <Space size={8} align="center">
          <RobotOutlined style={{ color: '#6366f1' }} />
          <Title level={5} style={{ margin: 0 }}>{t('agent.historyTitle')}</Title>
          <Tag color="blue" bordered={false}>{runs.length}</Tag>
        </Space>
        <Tooltip title={t('agent.resetHistory')}>
          <Button type="text" onClick={onClear} disabled={runs.length === 0}>
            {t('agent.resetHistory')}
          </Button>
        </Tooltip>
      </div>

      {runs.length === 0 ? (
        <div className="agent-history__empty">
          <Empty description={t('agent.historyEmpty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div className="agent-history__list">
          {runs.map((run) => (
            <div
              key={run.id}
              className={clsx('agent-history__item', run.id === activeRunId && 'is-active')}
            >
              <button type="button" className="agent-history__item-main" onClick={() => onSelect(run.id)}>
                <Text strong ellipsis>{run.question}</Text>
                <Space size={8} wrap>
                  <Tag>{PROVIDER_CONFIG[run.provider].label}</Tag>
                  <Tag color="blue">{run.mode.toUpperCase()}</Tag>
                  <Text type="secondary" className="agent-history__timestamp">
                    <ClockCircleOutlined /> {new Date(run.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                  </Text>
                </Space>
                {run.response?.answer && (
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    className="agent-history__snippet"
                  >
                    {run.response.answer}
                  </Paragraph>
                )}
              </button>
              <Space className="agent-history__actions" size={8}>
                <Tooltip title={t('agent.reuse')}>
                  <Button type="text" icon={<EditOutlined />} onClick={() => onReuse(run.id)} />
                </Tooltip>
                <Tooltip title={t('common.clear')}>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(run.id)} />
                </Tooltip>
              </Space>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentRunHistory;
