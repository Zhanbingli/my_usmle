import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';
import { PROVIDER_CONFIG } from '../constants';

const { Text } = Typography;

interface AgentRunHistoryProps {
  runs: AgentRun[];
  activeRunId: string | null;
  onSelect: (id: string) => void;
}

const AgentRunHistory: React.FC<AgentRunHistoryProps> = ({ runs, activeRunId, onSelect }) => {
  return (
    <Card title="历史对话" extra={<RobotOutlined />}> 
      {runs.length === 0 ? (
        <div className="agent-history-empty">
          <Text type="secondary">暂无对话记录，发送第一个问题试试 👇</Text>
        </div>
      ) : (
        runs.map((run) => (
          <Card
            key={run.id}
            className={`agent-history-item ${run.id === activeRunId ? 'is-active' : ''}`}
            size="small"
            onClick={() => onSelect(run.id)}
          >
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text strong ellipsis>
                {run.question}
              </Text>
              <Space size={8} wrap>
                <Tag>{PROVIDER_CONFIG[run.provider].label}</Tag>
                <Tag color="blue">{run.mode.toUpperCase()}</Tag>
                <Text type="secondary">
                  {new Date(run.createdAt).toLocaleString()}
                </Text>
              </Space>
            </Space>
          </Card>
        ))
      )}
    </Card>
  );
};

export default AgentRunHistory;
