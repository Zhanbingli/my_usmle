import React from 'react';
import { Button, Divider, Input, Select, Segmented, Space, Tag, Tooltip, Typography, Badge } from 'antd';
import {
  SendOutlined,
  CompassOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  BulbOutlined,
  LockOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { AgentMode, AgentProvider } from '../types';
import { MODE_META, PROVIDER_CONFIG } from '../constants';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface AgentPromptPanelProps {
  question: string;
  onQuestionChange: (value: string) => void;
  context: string;
  onContextChange: (value: string) => void;
  provider: AgentProvider;
  onProviderChange: (value: AgentProvider) => void;
  providerOptions: Array<{ value: AgentProvider; label: string }>;
  model?: string;
  onModelChange: (value: string) => void;
  modelOptions: Array<{ label: string; value: string; description?: string }>;
  mode: AgentMode;
  onModeChange: (value: AgentMode) => void;
  suggestions: string[];
  onSubmit: () => void;
  onClearHistory: () => void;
  runsCount: number;
  loading: boolean;
  isAuthenticated: boolean;
}

const MODE_ICON: Record<AgentMode, React.ReactNode> = {
  auto: <CompassOutlined />,
  literature: <DatabaseOutlined />, 
  case: <ThunderboltOutlined />,
};

const AgentPromptPanel: React.FC<AgentPromptPanelProps> = ({
  question,
  onQuestionChange,
  context,
  onContextChange,
  provider,
  onProviderChange,
  providerOptions,
  model,
  onModelChange,
  modelOptions,
  mode,
  onModeChange,
  suggestions,
  onSubmit,
  onClearHistory,
  runsCount,
  loading,
  isAuthenticated,
}) => {
  const canSubmit = Boolean(question.trim());

  const segmentedOptions = MODE_META.map((item) => ({
    label: (
      <div className="agent-mode-option">
        <span className="agent-mode-option__title">{item.label}</span>
        <span className="agent-mode-option__hint">{item.hint}</span>
      </div>
    ),
    value: item.value,
    icon: MODE_ICON[item.value],
  }));

  return (
    <div className="agent-composer">
      <div className="agent-composer__header">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>医学智能 Agent</Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            结合文献检索、病例推演与多模型推理，帮助你快速获得可行的医学洞察。
          </Typography.Paragraph>
        </div>
        <Space size={12} align="center">
          <Tag color="purple" icon={<RocketOutlined />}>多模态推理 Beta</Tag>
          <Tooltip title="清空当前会话历史">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={onClearHistory}
              disabled={runsCount === 0}
            >
              清空
            </Button>
          </Tooltip>
          <Badge count={runsCount} size="small" color="#6366f1" title="已保存的回答数" />
        </Space>
      </div>

      <div className="agent-composer__meta">
        <div className="agent-composer__meta-item">
          <Text type="secondary">Provider</Text>
          <Select
            value={provider}
            onChange={onProviderChange}
            options={providerOptions}
            size="large"
            dropdownMatchSelectWidth={200}
          />
          <Typography.Text className="control-hint">
            {PROVIDER_CONFIG[provider].description}
          </Typography.Text>
        </div>

        <div className="agent-composer__meta-item">
          <Text type="secondary">Model</Text>
          <Select value={model} onChange={onModelChange} size="large">
            {modelOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <Space>
                  <span>{option.label}</span>
                  {option.description && (
                    <Tooltip title={option.description}>
                      <Tag color="blue" bordered={false}>
                        {option.description}
                      </Tag>
                    </Tooltip>
                  )}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="agent-composer__meta-item">
          <Text type="secondary">模式</Text>
          <Segmented
            value={mode}
            onChange={(value) => onModeChange(value as AgentMode)}
            options={segmentedOptions}
            size="large"
            block
          />
        </div>
      </div>

      <div className="agent-composer__inputs">
        <div className="agent-composer__question">
          <TextArea
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="描述你的临床问题、检索需求或病例场景..."
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <div className="agent-composer__hint-row">
            <Text type="secondary">
              按 Enter 直接发送，Shift + Enter 换行。
            </Text>
            {!isAuthenticated && (
              <Space size={4}>
                <LockOutlined style={{ color: '#f87171' }} />
                <Text type="secondary">登录后可保存历史与引用</Text>
              </Space>
            )}
          </div>
        </div>

        <div className="agent-composer__context">
          <div className="agent-composer__context-header">
            <Space size={8}>
              <BulbOutlined />
              <Text strong>附加背景 (可选)</Text>
            </Space>
            <Text type="secondary">添加实验室指标、患者特征或约束条件</Text>
          </div>
          <TextArea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder="例：患者 32 岁女性，怀孕 24 周，既往有 Ⅰ 型糖尿病史..."
          />
        </div>
      </div>

      <div className="agent-composer__actions">
        <Space size={12}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={onSubmit}
            loading={loading}
            disabled={!canSubmit}
          >
            生成回答
          </Button>
        </Space>
        <Text type="secondary">平均响应耗时 ~8 秒</Text>
      </div>

      <Divider dashed style={{ margin: '28px 0' }} />

      <div className="agent-composer__suggestions">
        <Space size={12} align="start">
          <Text type="secondary" style={{ paddingTop: 6 }}>
            试试这些提示：
          </Text>
          <Space size={[8, 12]} wrap>
            {suggestions.map((prompt) => (
              <Button key={prompt} onClick={() => onQuestionChange(prompt)} icon={<BulbOutlined />}>
                {prompt}
              </Button>
            ))}
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default AgentPromptPanel;
