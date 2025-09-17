import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';

const { Text } = Typography;

interface AgentRunTimelineProps {
  run: AgentRun | null;
}

const formatValue = (value: unknown): string => {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    return stringified.length > 180 ? `${stringified.slice(0, 180)}…` : stringified;
  } catch (error) {
    return '[无法序列化结果]';
  }
};

const AgentRunTimeline: React.FC<AgentRunTimelineProps> = ({ run }) => {
  return (
    <Card title="执行轨迹" extra={<ThunderboltOutlined />}> 
      {!run || !run.response.actions || run.response.actions.length === 0 ? (
        <Text type="secondary">暂无工具调用记录。</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {run.response.actions.map((action) => (
            <Card key={`${action.tool}-${action.step}`} size="small" className="agent-action-item">
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space>
                  <Tag color="blue">STEP {action.step}</Tag>
                  <Text strong>{action.tool}</Text>
                  <Tag color={action.ok ? 'green' : 'red'}>{action.ok ? '成功' : '失败'}</Tag>
                </Space>
                <Text type="secondary">状态码：{action.status}</Text>
                {action.args && Object.keys(action.args).length > 0 && (
                  <Text type="secondary">
                    参数：{formatValue(action.args)}
                  </Text>
                )}
                {typeof action.output !== 'undefined' && action.output !== null && (
                  <Text type="secondary">
                    输出：{formatValue(action.output)}
                  </Text>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );
};

export default AgentRunTimeline;
