import React from 'react';
import { Button, Divider, Empty, message, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { CopyOutlined, ReloadOutlined, FieldTimeOutlined, BookOutlined, ProfileOutlined } from '@ant-design/icons';
import { AgentRun } from '../types';

const { Title, Text, Paragraph } = Typography;

interface AgentRunDetailProps {
  run: AgentRun | null;
  isLoading: boolean;
  onReuse: (id: string) => void;
}

const AgentRunDetail: React.FC<AgentRunDetailProps> = ({ run, isLoading, onReuse }) => {
  if (!run) {
    return (
      <div className="agent-panel-empty">
        <Empty description={
          <Space direction="vertical" size={2}>
            <Text type="secondary">发送一个问题，Agent 将生成结构化的回答</Text>
            <Text type="secondary">提示：提供患者背景与目标可以获得更准确的建议</Text>
          </Space>
        } />
      </div>
    );
  }

  const meta = run.response.meta;
  const durationLabel = meta?.durationMs ? `${(meta.durationMs / 1000).toFixed(2)} 秒` : null;
  const usage = meta?.usage && typeof meta.usage === 'object' ? meta.usage : null;

  const handleCopyAnswer = async () => {
    try {
      if (!navigator.clipboard) {
        message.info('当前环境不支持一键复制');
        return;
      }
      await navigator.clipboard.writeText(run.response.answer);
      message.success('答案已复制到剪贴板');
    } catch (err) {
      console.warn('Clipboard copy failed', err);
      message.warning('复制失败，请手动复制');
    }
  };

  return (
    <div className="agent-run-detail">
      <div className="agent-run-detail__header">
        <div>
          <Text type="secondary">问题</Text>
          <Title level={4} style={{ marginBottom: 0 }}>{run.question}</Title>
        </div>
        <Space size={12}>
          <Tooltip title="返回编辑此问题">
            <Button icon={<ReloadOutlined />} onClick={() => onReuse(run.id)}>
              重新编辑
            </Button>
          </Tooltip>
          <Tooltip title="复制回答">
            <Button icon={<CopyOutlined />} onClick={handleCopyAnswer} type="text" />
          </Tooltip>
        </Space>
      </div>

      <div className="agent-run-detail__meta">
        <Space size={[8, 8]} wrap>
          <Tag color="geekblue">Provider: {meta?.provider ?? run.provider}</Tag>
          <Tag color="purple">Model: {meta?.model ?? run.model}</Tag>
          <Tag color="blue">Mode: {(meta?.mode ?? run.mode).toUpperCase()}</Tag>
          {meta?.offline && <Tag color="orange">离线模拟</Tag>}
          {durationLabel && (
            <Tag color="green" icon={<FieldTimeOutlined />}>
              耗时 {durationLabel}
            </Tag>
          )}
        </Space>
        {usage && (
          <Text type="secondary" className="agent-run-detail__usage">
            Token：
            {Object.entries(usage)
              .map(([key, value]) => `${key}: ${value as string | number}`)
              .join(' / ')}
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
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Paragraph className="agent-answer">{run.response.answer}</Paragraph>
        )}
      </div>

      {run.response.citations && run.response.citations.length > 0 && (
        <div className="agent-run-detail__citations">
          <Text type="secondary">引用来源</Text>
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
