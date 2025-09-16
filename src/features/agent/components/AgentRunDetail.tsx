import React from 'react';
import { Card, Divider, Space, Typography } from 'antd';
import { AgentRun } from '../types';

const { Title, Text, Paragraph } = Typography;

interface AgentRunDetailProps {
  run: AgentRun | null;
  isLoading: boolean;
}

const AgentRunDetail: React.FC<AgentRunDetailProps> = ({ run, isLoading }) => {
  if (isLoading && !run) {
    return (
      <div className="agent-placeholder">
        <Typography.Text type="secondary">Agent 正在思考中...</Typography.Text>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="agent-placeholder">
        <Typography.Text type="secondary">
          发送一个问题，Agent 将在这里呈现结构化的回答与引用。
        </Typography.Text>
      </div>
    );
  }

  return (
    <Card className="agent-run-detail" bordered={false}>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <section>
          <Text type="secondary">问题</Text>
          <Title level={4}>{run.question}</Title>
        </section>
        <Divider />
        <section>
          <Text type="secondary">Agent 回答</Text>
          <Paragraph className="agent-answer">{run.response.answer}</Paragraph>
        </section>
        {run.response.citations && run.response.citations.length > 0 && (
          <section>
            <Text type="secondary">引用来源</Text>
            <Space direction="vertical" size={6} style={{ marginTop: 8 }}>
              {run.response.citations.map((citation) => (
                <a key={citation.pmid} href={citation.url} target="_blank" rel="noreferrer">
                  [{citation.pmid}] {citation.title}
                </a>
              ))}
            </Space>
          </section>
        )}
      </Space>
    </Card>
  );
};

export default AgentRunDetail;
