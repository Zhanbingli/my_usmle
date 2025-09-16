import React, { useMemo, useState } from 'react';
import { Tabs, Typography, message } from 'antd';
import { useLocation } from 'react-router-dom';
import AgentChatPanel from '../components/Agent/AgentChatPanel';
import AgentWorkflowPanel from '../components/Agent/AgentWorkflowPanel';
import { AgentProvider } from '../api/agentApi';

const { Title, Paragraph } = Typography;

type AgentTabKey = 'consult' | 'agent';

interface AgentPageProps {
  initialTab?: AgentTabKey;
}

const AgentPage: React.FC<AgentPageProps> = ({ initialTab = 'agent' }) => {
  const location = useLocation();
  const stateTab = (location.state as { tab?: AgentTabKey } | undefined)?.tab;
  const defaultTab: AgentTabKey = stateTab && (stateTab === 'consult' || stateTab === 'agent')
    ? stateTab
    : initialTab;
  const [activeKey, setActiveKey] = useState<AgentTabKey>(defaultTab);

  const tabItems = useMemo(
    () => [
      {
        key: 'consult',
        label: 'AI问诊训练',
        children: <AgentChatPanel />,
      },
      {
        key: 'agent',
        label: '多模型智能Agent',
        children: (
          <AgentWorkflowPanel
            onProviderMissing={(provider: AgentProvider) => {
              message.warning(`请先在环境中配置 ${provider.toUpperCase()} 的 API Key 后再试。`);
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 24px' }}>
        <Title level={2} style={{ marginBottom: 8 }}>医学AI Agent 工作台</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          在一个界面中完成问诊训练与多模型智能Agent推理，快速对接临床问题与文献检索。
        </Paragraph>
      </div>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as AgentTabKey)}
        items={tabItems}
      />
    </div>
  );
};

export default AgentPage;
