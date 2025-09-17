import React from 'react';
import { Empty, Space, Tag, Timeline, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';

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
  const hasActions = Boolean(run && run.response.actions && run.response.actions.length > 0);

  return (
    <div className="agent-timeline">
      <div className="agent-timeline__header">
        <Space size={8} align="center">
          <ThunderboltOutlined style={{ color: '#6366f1' }} />
          <Title level={5} style={{ margin: 0 }}>执行轨迹</Title>
        </Space>
      </div>

      {!hasActions ? (
        <div className="agent-timeline__empty">
          <Empty description="暂无工具调用记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <Timeline
          items={run!.response.actions.map((action) => ({
            color: action.ok ? 'green' : 'red',
            children: (
              <div className="agent-timeline__item">
                <Space size={8} wrap align="start">
                  <Tag color="blue">STEP {action.step}</Tag>
                  <Text strong>{action.tool}</Text>
                  <Tag color={action.ok ? 'green' : 'red'}>{action.ok ? '成功' : '失败'}</Tag>
                </Space>
                <Text type="secondary">状态码：{action.status}</Text>
                {action.args && Object.keys(action.args).length > 0 && (
                  <Text type="secondary">参数：{formatValue(action.args)}</Text>
                )}
                {typeof action.output !== 'undefined' && action.output !== null && (
                  <Text type="secondary">输出：{formatValue(action.output)}</Text>
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
