import { AgentProviderConfig, AgentMode } from './types';

export const PROVIDER_CONFIG: Record<'gemini' | 'openai' | 'claude', AgentProviderConfig> = {
  gemini: {
    label: 'Gemini 1.5',
    description: '擅长复杂推理与多模态任务',
    models: [
      { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', description: '高精度通用模型' },
      { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash', description: '响应更快、成本更低' },
    ],
  },
  openai: {
    label: 'OpenAI GPT-4o',
    description: '通用能力强、生态完善',
    models: [
      { label: 'GPT-4o', value: 'gpt-4o', description: '旗舰模型' },
      { label: 'GPT-4o Mini', value: 'gpt-4o-mini', description: '性价比首选' },
      { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', description: '轻量任务' },
    ],
  },
  claude: {
    label: 'Claude 3',
    description: '长文本理解与安全性强',
    models: [
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet', description: '性能/成本均衡' },
      { label: 'Claude 3 Opus', value: 'claude-3-opus', description: '最高性能' },
      { label: 'Claude 3 Haiku', value: 'claude-3-haiku', description: '极速响应' },
    ],
  },
};

export const SUGGESTED_PROMPTS = [
  '总结最新的糖尿病管理指南亮点',
  '给出胸痛患者的鉴别诊断流程',
  '筛选近三年的高血压系统综述并提炼结论',
  '模拟医患沟通，解释脑卒中的预警信号',
];

export const MODE_META: Array<{ value: AgentMode; label: string; hint: string; icon: string }> = [
  { value: 'auto', label: '智能', hint: '自动决定工具使用策略', icon: 'CompassOutlined' },
  { value: 'literature', label: '文献', hint: '优先调用文献检索工具', icon: 'DatabaseOutlined' },
  { value: 'case', label: '病例', hint: '聚焦病例推演与诊断', icon: 'ThunderboltOutlined' },
];
