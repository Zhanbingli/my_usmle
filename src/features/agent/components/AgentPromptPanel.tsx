import React from 'react';
import { Button, Input, Select, Space, Tag, Tooltip, Typography } from 'antd';
import {
  SendOutlined,
  CompassOutlined,
  DatabaseOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { AgentMode, AgentProvider } from '../types';
import { MODE_META, PROVIDER_CONFIG } from '../constants';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface AgentPromptPanelProps {
  question: string;
  onQuestionChange: (value: string) => void;
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
  loading: boolean;
}

const MODE_ICON: Record<AgentMode, React.ReactNode> = {
  auto: <CompassOutlined />,
  literature: <DatabaseOutlined />, 
  case: <ThunderboltOutlined />,
};

const AgentPromptPanel: React.FC<AgentPromptPanelProps> = ({
  question,
  onQuestionChange,
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
  loading,
}) => {
  return (
    <div className="agent-prompt-panel">
      <div className="agent-prompt-header">
        <Title level={2}>医学智能 Agent</Title>
        <Typography.Paragraph type="secondary">
          结合文献检索、病例推演与多模型推理，迅速获取可靠的医学洞察。
        </Typography.Paragraph>
      </div>

      <div className="agent-prompt-controls">
        <div className="control-item">
          <Text type="secondary">Provider</Text>
          <Select
            value={provider}
            onChange={onProviderChange}
            options={providerOptions}
            size="large"
          />
          <Typography.Text className="control-hint">
            {PROVIDER_CONFIG[provider].description}
          </Typography.Text>
        </div>

        <div className="control-item">
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
      </div>

      <div className="agent-mode-selector">
        {MODE_META.map((item) => (
          <Button
            key={item.value}
            type={item.value === mode ? 'primary' : 'default'}
            icon={MODE_ICON[item.value]}
            onClick={() => onModeChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="agent-prompt-input">
        <TextArea
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 4 }}
          placeholder="描述你的医学问题、检索需求或病例场景..."
          onPressEnter={(event) => {
            if (!event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          size="large"
          onClick={onSubmit}
          loading={loading}
          disabled={!question.trim()}
        >
          发送
        </Button>
      </div>

      <div className="agent-suggestions">
        <Text type="secondary">试试这些提示：</Text>
        <Space wrap>
          {suggestions.map((prompt) => (
            <Button key={prompt} onClick={() => onQuestionChange(prompt)}>
              {prompt}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default AgentPromptPanel;
