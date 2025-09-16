import React, { useMemo, useState } from 'react';
import {
  Card,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Alert,
  Spin,
  Divider,
  List,
  Tag,
  Tooltip
} from 'antd';
import { RobotOutlined, ThunderboltOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { agentApi, AgentActResponse, AgentProvider } from '../../api/agentApi';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

type AgentMode = 'auto' | 'literature' | 'case';

type ProviderModelMap = Record<AgentProvider, Array<{ label: string; value: string; description?: string }>>;

type ProviderInfoMap = Record<AgentProvider, { label: string; description: string }>;

const PROVIDER_INFO: ProviderInfoMap = {
  gemini: {
    label: 'Google Gemini',
    description: '适合多模态和复杂推理任务，默认使用 gemini-1.5-pro 模型'
  },
  openai: {
    label: 'OpenAI',
    description: '支持 GPT-4o 系列模型，语言表现稳定，适合通用问答'
  },
  claude: {
    label: 'Anthropic Claude',
    description: '在长文本理解与安全控制方面表现出色，默认使用 Claude 3.5 Sonnet'
  }
};

const PROVIDER_MODELS: ProviderModelMap = {
  gemini: [
    { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', description: '官方推荐通用模型' },
    { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash', description: '响应更快，成本更低' }
  ],
  openai: [
    { label: 'GPT-4o', value: 'gpt-4o', description: '旗舰模型，综合能力强' },
    { label: 'GPT-4o Mini', value: 'gpt-4o-mini', description: '高性价比，响应快速' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', description: '适合轻量任务' }
  ],
  claude: [
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet', description: '平衡性能与成本' },
    { label: 'Claude 3 Opus', value: 'claude-3-opus', description: '最高性能，成本最高' },
    { label: 'Claude 3 Haiku', value: 'claude-3-haiku', description: '响应极快，适合快速询问' }
  ]
};

interface AgentWorkflowPanelProps {
  onProviderMissing?: (provider: AgentProvider) => void;
}

const AgentWorkflowPanel: React.FC<AgentWorkflowPanelProps> = ({ onProviderMissing }) => {
  const [goal, setGoal] = useState('请检索近三年关于高血压一线治疗策略的系统综述并总结临床要点');
  const [context, setContext] = useState('');
  const [mode, setMode] = useState<AgentMode>('auto');
  const [provider, setProvider] = useState<AgentProvider>('gemini');
  const [model, setModel] = useState(PROVIDER_MODELS.gemini[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentActResponse | null>(null);

  const currentModelOptions = useMemo(() => PROVIDER_MODELS[provider], [provider]);

  const runAgent = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await agentApi.act({ goal, context, mode, provider, model });
      setResult(resp);
    } catch (e: any) {
      if (e?.response?.status === 501 || e?.message?.includes('not configured')) {
        onProviderMissing?.(provider);
      }
      setError(e?.message || 'Agent 执行失败');
    } finally {
      setLoading(false);
    }
  };

  const renderAnswer = (text: string) => (
    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{text}</Paragraph>
  );

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <Card>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>Agent 多模型工作台</Title>
            <Text type="secondary">灵感来源于 Perplexity Agent，可在单页完成推理、检索与病例工具操作。</Text>
          </div>
          <RobotOutlined style={{ fontSize: 28, color: '#667eea' }} />
        </Space>

        <Divider />

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>任务目标</Text>
            <TextArea
              rows={3}
              placeholder="请输入你的任务目标（例如：检索某主题的系统综述并总结）"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <Space style={{ width: '100%' }} wrap size="large">
            <div style={{ minWidth: 220 }}>
              <Text strong>Agent 模式</Text>
              <Select<AgentMode>
                style={{ width: '100%' }}
                value={mode}
                onChange={(v) => setMode(v)}
                options={[
                  { value: 'auto', label: '自动（智能决策）' },
                  { value: 'literature', label: '文献优先' },
                  { value: 'case', label: '病例优先' }
                ]}
              />
            </div>
            <div style={{ minWidth: 220 }}>
              <Text strong>API 提供商</Text>
              <Select<AgentProvider>
                style={{ width: '100%' }}
                value={provider}
                onChange={(nextProvider) => {
                  setProvider(nextProvider);
                  const [firstModel] = PROVIDER_MODELS[nextProvider];
                  setModel(firstModel.value);
                }}
                options={Object.entries(PROVIDER_INFO).map(([value, meta]) => ({
                  value: value as AgentProvider,
                  label: meta.label
                }))}
              />
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                {PROVIDER_INFO[provider].description}
              </Text>
            </div>
            <div style={{ minWidth: 220 }}>
              <Text strong>选择模型</Text>
              <Select
                style={{ width: '100%' }}
                value={model}
                onChange={setModel}
              >
                {currentModelOptions.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    <Space>
                      <span>{item.label}</span>
                      {item.description && (
                        <Tooltip title={item.description}>
                          <InfoCircleOutlined style={{ color: '#999' }} />
                        </Tooltip>
                      )}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <Text strong>上下文（可选）</Text>
              <Input
                placeholder="补充背景，如患者特征、关键词等"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </Space>

          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={runAgent}
              loading={loading}
            >
              运行 Agent
            </Button>
            <Button onClick={() => setResult(null)} disabled={!result}>
              清空结果
            </Button>
          </Space>

          <Alert
            type="info"
            showIcon
            message="使用提示"
            description="该功能仅用于医学教育与信息检索辅助，不能替代专业医生诊断或治疗建议。确保已经在环境配置中提供对应模型的 API Key。"
          />
        </Space>
      </Card>

      <div style={{ marginTop: 16 }}>
        {loading && (
          <Card>
            <Spin />
          </Card>
        )}
        {error && (
          <Alert type="error" showIcon message="执行失败" description={error} style={{ marginBottom: 12 }} />
        )}
        {result && (
          <Card title="Agent 结果">
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
                      <a href={c.url} target="_blank" rel="noreferrer">
                        [{c.pmid}] {c.title}
                      </a>
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

export default AgentWorkflowPanel;
