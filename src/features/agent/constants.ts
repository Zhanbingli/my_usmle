import { AgentProviderConfig, AgentMode, AgentPromptTemplate } from './types';

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

export const AGENT_TEMPLATES: AgentPromptTemplate[] = [
  {
    id: 'differential',
    title: '鉴别诊断路径',
    description: '针对复杂主诉生成标准化鉴别诊断列表与下一步检查建议。',
    question: '请为以下主诉生成鉴别诊断列表，并给出优先级和下一步检查建议：持续胸痛伴呼吸困难。',
    context: '患者男性，45 岁。吸烟史 20 年。既往高血压，未规律服药。体温 37.2℃，血压 156/96 mmHg，心率 104 次/分。',
    mode: 'case',
  },
  {
    id: 'literature-brief',
    title: '快速文献综述',
    description: '检索最新循证研究并输出摘要与推荐级别。',
    question: '检索并总结最新版 2 型糖尿病合并慢性肾病治疗的循证指南，列出关键推荐及证据等级。',
    mode: 'literature',
  },
  {
    id: 'patient-education',
    title: '患者宣教脚本',
    description: '输出可直接用于患者沟通的通俗解释与注意事项。',
    question: '请生成一份面向患者的宣教内容，解释房颤的风险、日常管理和复诊提醒。',
    context: '患者女性，63 岁。房颤新确诊。需强调抗凝药物依从性与生活方式调整。',
    mode: 'auto',
  },
  {
    id: 'treatment-plan',
    title: '处置方案速览',
    description: '生成完整的评估、治疗、监测与随访计划，适用于值班速查。',
    question: '请输出社区获得性肺炎的标准化诊疗方案，包含风险评估、经验用药、监测要点与复诊安排。',
    mode: 'case',
  },
];
