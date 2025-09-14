import React, { useState } from 'react';
import { Card, Input, Button, Select, Typography, Space, Alert, Spin, Divider, List, Tag } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { agentApi, AgentActResponse } from '../api/agentApi';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const AgentPage: React.FC = () => {
  const [goal, setGoal] = useState('请检索近三年关于高血压一线治疗策略的系统综述并总结临床要点');
  const [context, setContext] = useState('');
  const [mode, setMode] = useState<'auto' | 'literature' | 'case'>('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentActResponse | null>(null);

  const runAgent = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await agentApi.act({ goal, context, mode });
      setResult(resp);
    } catch (e: any) {
      setError(e?.message || 'Agent 执行失败');
    } finally {
      setLoading(false);
    }
  };

  const renderAnswer = (text: string) => (
    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
      {text}
    </Paragraph>
  );

  return (
    <div style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
      <Card>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>Agent 智能助手</Title>
            <Text type="secondary">自动选择工具（PubMed/病例）进行多步推理与检索。</Text>
          </div>
          <RobotOutlined style={{ fontSize: 28, color: '#667eea' }} />
        </Space>

        <Divider />

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>目标</Text>
            <TextArea
              rows={3}
              placeholder="请输入你的任务目标（例如：检索某主题的系统综述并总结）"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <Space style={{ width: '100%' }} wrap>
            <div style={{ minWidth: 240 }}>
              <Text strong>模式</Text>
              <Select
                style={{ width: '100%' }}
                value={mode}
                onChange={(v) => setMode(v)}
                options={[
                  { value: 'auto', label: '自动' },
                  { value: 'literature', label: '文献' },
                  { value: 'case', label: '病例' },
                ]}
              />
            </div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <Text strong>上下文（可选）</Text>
              <Input
                placeholder="补充背景，如患者特征、关键词等"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div>
              <Button type="primary" icon={<ThunderboltOutlined />} onClick={runAgent} loading={loading}>
                运行 Agent
              </Button>
            </div>
          </Space>

          <Alert
            type="info"
            showIcon
            message="重要提示"
            description="该功能仅用于医学教育与信息检索辅助，不能替代专业医生诊断或治疗建议。紧急情况请立即就医。"
          />
        </Space>
      </Card>

      <div style={{ marginTop: 16 }}>
        {loading && (
          <Card><Spin /></Card>
        )}
        {error && (
          <Alert type="error" showIcon message="执行失败" description={error} />
        )}
        {result && (
          <Card title="Agent 结果" style={{ marginTop: 8 }}>
            <Title level={5}>最终答案</Title>
            {renderAnswer(result.answer)}
            <Divider />
            <Title level={5}>工具调用轨迹</Title>
            {(!result.actions || result.actions.length === 0) ? (
              <Text type="secondary">本次无需工具调用。</Text>
            ) : (
              <List
                size="small"
                dataSource={result.actions}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <Tag color="blue">Step {item.step}</Tag>
                      <Tag>{item.tool}</Tag>
                      <Text type="secondary">状态: {item.status}</Text>
                      <Tag color={item.ok ? 'green' : 'red'}>{item.ok ? 'OK' : 'FAIL'}</Tag>
                    </Space>
                  </List.Item>
                )}
              />
            )}
            {result.citations && result.citations.length > 0 && (
              <>
                <Divider />
                <Title level={5}>参考文献</Title>
                <List
                  size="small"
                  dataSource={result.citations}
                  renderItem={(c) => (
                    <List.Item>
                      <a href={c.url} target="_blank" rel="noreferrer">[{c.pmid}] {c.title}</a>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentPage;
