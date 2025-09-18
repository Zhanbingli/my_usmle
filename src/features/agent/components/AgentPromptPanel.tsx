import React from 'react';
import { Button, Card, Divider, Input, Select, Segmented, Space, Tag, Tooltip, Typography, Badge } from 'antd';
import {
  SendOutlined,
  CompassOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  BulbOutlined,
  LockOutlined,
  RocketOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { AgentMode, AgentProvider, AgentPromptTemplate } from '../types';
import { MODE_META, PROVIDER_CONFIG } from '../constants';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  templates: AgentPromptTemplate[];
  onApplyTemplate: (template: AgentPromptTemplate) => void;
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
  templates,
  onApplyTemplate,
}) => {
  const canSubmit = Boolean(question.trim());
  const { t, language } = useLanguage();

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
          <Title level={3} style={{ marginBottom: 4 }}>{t('agent.composerTitle')}</Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('agent.composerSubtitle')}
          </Typography.Paragraph>
        </div>
        <Space size={12} align="center">
          <Tag color="purple" icon={<RocketOutlined />}>{t('agent.badges.multimodal')}</Tag>
          <Tooltip title={t('agent.resetHistory')}>
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={onClearHistory}
              disabled={runsCount === 0}
            >
              {t('agent.resetHistory')}
            </Button>
          </Tooltip>
          <Badge count={runsCount} size="small" color="#6366f1" title={t('agent.historyCountTooltip')} />
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
          <Text type="secondary">Mode</Text>
          <Segmented
            value={mode}
            onChange={(value) => onModeChange(value as AgentMode)}
            options={segmentedOptions}
            size="large"
            block
          />
        </div>
      </div>

      <div className="agent-composer__templates">
        <div className="agent-composer__templates-header">
          <Space size={8} align="center">
            <AppstoreAddOutlined style={{ color: '#4f46e5' }} />
            <Text strong>{t('agent.templatesTitle')}</Text>
            <Tag color="blue" bordered={false}>One-click</Tag>
          </Space>
          <Text type="secondary">{t('agent.templatesSubtitle')}</Text>
        </div>
        <div className="agent-composer__templates-grid">
          {templates.map((template) => (
            <Card
              key={template.id}
              bordered={false}
              hoverable
              className="agent-template-card"
              onClick={() => onApplyTemplate(template)}
            >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space align="center" size={8}>
                    <Text strong>{template.title}</Text>
                    <Tag color="purple" bordered={false}>{t('agent.templateApply')}</Tag>
                  </Space>
                  <Text type="secondary">{template.description}</Text>
                <Space size={6} wrap>
                  {template.mode && (
                    <Tag color="geekblue">
                      {language === 'zh'
                        ? `模式：${template.mode.toUpperCase()}`
                        : `Mode: ${template.mode.toUpperCase()}`}
                    </Tag>
                  )}
                  {template.provider && (
                    <Tag color="cyan">
                      {language === 'zh'
                        ? `模型：${PROVIDER_CONFIG[template.provider].label}`
                        : `Provider: ${PROVIDER_CONFIG[template.provider].label}`}
                    </Tag>
                  )}
                </Space>
                  <Button
                    type="link"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onApplyTemplate(template);
                    }}
                  >
                    {t('agent.templateApply')}
                  </Button>
                </Space>
              </Card>
            ))}
        </div>
      </div>

      <div className="agent-composer__inputs">
        <div className="agent-composer__question">
          <TextArea
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder={t('agent.questionPlaceholder')}
            onPressEnter={(event) => {
              if (!event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <div className="agent-composer__hint-row">
            <Text type="secondary">
              {t('agent.hintSend')}
            </Text>
            {!isAuthenticated && (
              <Space size={4}>
                <LockOutlined style={{ color: '#f87171' }} />
                <Text type="secondary">{t('agent.hintLogin')}</Text>
              </Space>
            )}
          </div>
        </div>

        <div className="agent-composer__context">
          <div className="agent-composer__context-header">
            <Space size={8}>
              <BulbOutlined />
              <Text strong>{t('agent.contextTitle')}</Text>
            </Space>
            <Text type="secondary">{t('agent.contextSubtitle')}</Text>
          </div>
          <TextArea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder={t('agent.contextPlaceholder')}
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
            {t('common.generateAnswer')}
          </Button>
        </Space>
        <Text type="secondary">{t('common.averageResponseTime')}</Text>
      </div>

      <Divider dashed style={{ margin: '28px 0' }} />

      <div className="agent-composer__suggestions">
        <Space size={12} align="start">
          <Text type="secondary" style={{ paddingTop: 6 }}>
            {t('agent.suggestionsTitle')}
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
