export type Language = 'zh' | 'en';

type TranslationLeaf = string | TranslationMap;

interface TranslationMap {
  [key: string]: TranslationLeaf;
}

type Translations = Record<Language, TranslationMap>;

export const translations: Translations = {
  zh: {
    common: {
      appName: '医学AI平台',
      loadingUser: '正在加载用户信息...',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      profile: '个人资料',
      subscription: '订阅管理',
      settings: '设置',
      confirm: '确认',
      cancel: '取消',
      clear: '清空',
      send: '发送',
      generateAnswer: '生成回答',
      averageResponseTime: '平均响应耗时 ~8 秒',
      emptyState: '暂无记录',
      learnMore: '了解更多',
      copySuccess: '答案已复制到剪贴板',
      copyFail: '复制失败，请手动复制',
      copyUnsupported: '当前环境不支持一键复制',
      language: {
        zh: '中文',
        en: 'English'
      }
    },
    layout: {
      menu: {
        home: '首页',
        agent: '智能Agent',
        cases: '病例训练',
        pubmed: 'PubMed检索',
        analytics: '数据分析'
      },
      footerTitles: {
        quickLinks: '快速链接',
        support: '支持与帮助',
        contact: '联系我们'
      },
      quickLinks: {
        agent: 'AI智能问诊',
        cases: '病例训练',
        pubmed: 'PubMed检索',
        about: '关于我们'
      },
      supportLinks: {
        help: '使用帮助',
        faq: '常见问题',
        privacy: '隐私政策',
        terms: '服务条款'
      },
      footer: {
        mission: '基于人工智能的医学教育和临床辅助平台，致力于为医学生和医生提供最优质的学习和诊断支持服务。',
        contact: {
          email: 'support@medical-ai.com',
          phone: '400-123-4567',
          github: 'GitHub'
        },
        copyright: '© {year} 医学AI平台. All rights reserved. | 基于 React + TypeScript + Ant Design 构建'
      }
    },
    home: {
      heroBadge: '面向医学学习与临床决策的 AI 联合实验',
      heroTitle: '智能医学 AI 平台',
      heroDescription: '将问诊对话、病例演练与循证文献检索整合在一个平台中，帮助临床医师与医学生快速验证诊断思路、制定治疗方案和准备 USMLE 考试。',
      ctaAgent: '立即体验问诊 Agent',
      ctaCases: '浏览病例训练',
      badgeMultimodal: '多模型推理',
      badgeTracing: '工具链可视化',
      badgePubmed: 'PubMed 实时检索',
      stats: {
        users: '注册学员',
        cases: '病例库',
        sessions: '智能会话',
        hours: '学习时长'
      },
      featureSectionTitle: '核心功能矩阵',
      featureSectionSubtitle: '覆盖问诊、病例、检索与考试的完整学习闭环',
      featureCards: {
        agent: {
          title: 'AI 智能问诊',
          description: '多模型协同推理，提供循证医学建议与问诊摘要。'
        },
        cases: {
          title: '病例训练营',
          description: '按器官系统分层的病例演练，并附详尽解析与高频考点。'
        },
        pubmed: {
          title: 'PubMed 检索',
          description: '智能检索最新文献，自动总结研究结论与指南共识。'
        },
        usmle: {
          title: 'USMLE 备考',
          description: 'Step1/2/3 模拟题库与考点概览，支持个性化错题复盘。'
        }
      },
      welcomeBack: '欢迎回来，{name}！',
      welcomeSubtitle: '继续你的个性化学习路径，智能 Agent 会记住你的进度与偏好。',
      continueAgent: '继续问诊',
      continueCases: '练习病例'
    },
    agent: {
      heroTitle: '临床决策智能助手',
      heroSubtitle: '将文献检索、诊断推理与病例拆解整合在一体的智能 Agent，支持快速生成循证回答并追踪工具调用链路。',
      heroTags: {
        reasoning: '推理链可视化',
        pubmed: 'PubMed 实时检索',
        cases: '病例演练模式'
      },
      badges: {
        multimodal: '多模态推理 Beta'
      },
      errorTitle: 'Agent 调用失败',
      loginRequired: '请先登录以使用智能 Agent 功能',
      composerTitle: '医学智能 Agent',
      composerSubtitle: '结合文献检索、病例推演与多模型推理，帮助你快速获得可行的医学洞察。',
      resetHistory: '清空',
      templatesTitle: '快速模板',
      templatesSubtitle: '选择常用场景，系统将自动填入提示与背景',
      templateApply: '立即填写',
      questionPlaceholder: '描述你的临床问题、检索需求或病例场景...',
      contextTitle: '附加背景 (可选)',
      contextSubtitle: '添加实验室指标、患者特征或约束条件',
      contextPlaceholder: '例：患者 32 岁女性，怀孕 24 周，既往有 Ⅰ 型糖尿病史...',
      hintSend: '按 Enter 直接发送，Shift + Enter 换行。',
      hintLogin: '登录后可保存历史与引用',
      suggestionsTitle: '试试这些提示：',
      historyTitle: '历史对话',
      historyEmpty: '暂无对话记录，发送第一个问题试试 👇',
      historyCountTooltip: '已保存的回答数',
      timelineTitle: '执行轨迹',
      timelineEmpty: '暂无工具调用记录',
      runQuestion: '问题',
      runInfo: '执行信息',
      runAnswer: 'Agent 回答',
      runCitations: '引用来源',
      runThinking: 'Agent 正在思考中...',
      runPlaceholder: '发送一个问题，Agent 将在这里呈现结构化的回答与引用。',
      reuse: '重新编辑',
      copy: '复制回答',
      statusCode: '状态码',
      params: '参数',
      output: '输出',
      offline: '离线模拟',
      duration: '耗时 {seconds} 秒',
      tokenUsage: 'Token：{usage}',
      actionSuccess: '成功',
      actionFailure: '失败',
      status: {
        loading: '生成中',
        ready: '已完成',
        error: '失败'
      },
      emptyTitle: '开始新的对话',
      emptySubtitle: '描述你的医学问题或研究需求，Agent 将提供循证回答。'
    }
  },
  en: {
    common: {
      appName: 'Medical AI Platform',
      loadingUser: 'Loading user information...',
      login: 'Log In',
      register: 'Sign Up',
      logout: 'Log Out',
      profile: 'Profile',
      subscription: 'Subscription',
      settings: 'Settings',
      confirm: 'Confirm',
      cancel: 'Cancel',
      clear: 'Clear',
      send: 'Send',
      generateAnswer: 'Generate Answer',
      averageResponseTime: 'Avg. response ~8s',
      emptyState: 'No records yet',
      learnMore: 'Learn More',
      copySuccess: 'Answer copied to clipboard',
      copyFail: 'Copy failed, please copy manually',
      copyUnsupported: 'Clipboard copy is not supported in this environment',
      language: {
        zh: '中文',
        en: 'English'
      }
    },
    layout: {
      menu: {
        home: 'Home',
        agent: 'AI Agent',
        cases: 'Cases',
        pubmed: 'PubMed',
        analytics: 'Analytics'
      },
      footerTitles: {
        quickLinks: 'Quick Links',
        support: 'Support',
        contact: 'Contact'
      },
      quickLinks: {
        agent: 'AI Consultation',
        cases: 'Case Training',
        pubmed: 'PubMed Search',
        about: 'About Us'
      },
      supportLinks: {
        help: 'Help Center',
        faq: 'FAQ',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      footer: {
        mission: 'An AI-powered medical education and clinical assistant platform designed to support learners and clinicians with high-quality tools.',
        contact: {
          email: 'support@medical-ai.com',
          phone: '+1-400-123-4567',
          github: 'GitHub'
        },
        copyright: '© {year} Medical AI Platform. All rights reserved. | Built with React + TypeScript + Ant Design'
      }
    },
    home: {
      heroBadge: 'AI co-pilot for medical learning & clinical decision-making',
      heroTitle: 'Intelligent Medical AI Platform',
      heroDescription: 'Unify AI consultations, case simulations, and evidence-based literature search to validate diagnoses, craft treatment plans, and prepare for USMLE.',
      ctaAgent: 'Try the Consultation Agent',
      ctaCases: 'Explore Case Training',
      badgeMultimodal: 'Multi-model reasoning',
      badgeTracing: 'Toolchain tracing',
      badgePubmed: 'Real-time PubMed search',
      stats: {
        users: 'Registered learners',
        cases: 'Case library',
        sessions: 'AI sessions',
        hours: 'Learning hours'
      },
      featureSectionTitle: 'Core Capability Matrix',
      featureSectionSubtitle: 'Complete learning loop across consultations, cases, research, and exams',
      featureCards: {
        agent: {
          title: 'AI Consultation',
          description: 'Harness ensemble reasoning to deliver evidence-backed clinical insights.'
        },
        cases: {
          title: 'Case Bootcamp',
          description: 'Structured by specialty with in-depth explanations and key exam pearls.'
        },
        pubmed: {
          title: 'PubMed Search',
          description: 'Retrieve the latest evidence and automatically summarize clinical takeaways.'
        },
        usmle: {
          title: 'USMLE Prep',
          description: 'Step 1/2/3 mock bank and personalized review for mastery.'
        }
      },
      welcomeBack: 'Welcome back, {name}!',
      welcomeSubtitle: 'Resume your personalized learning journey—our agent remembers your progress and preferences.',
      continueAgent: 'Continue consultation',
      continueCases: 'Practice cases'
    },
    agent: {
      heroTitle: 'Clinical Decision AI Assistant',
      heroSubtitle: 'Fuse literature search, diagnostic reasoning, and case simulation to rapidly deliver evidence-backed answers with traceable tool usage.',
      heroTags: {
        reasoning: 'Reasoning trace',
        pubmed: 'Live PubMed search',
        cases: 'Case simulation mode'
      },
      badges: {
        multimodal: 'Multimodal reasoning (Beta)'
      },
      errorTitle: 'Agent request failed',
      loginRequired: 'Please sign in to use the intelligent agent.',
      composerTitle: 'Medical Intelligence Agent',
      composerSubtitle: 'Blend literature lookup, case reasoning, and multi-model inference for actionable medical insights.',
      resetHistory: 'Clear',
      templatesTitle: 'Quick Templates',
      templatesSubtitle: 'Pick a scenario and we will prefill the prompt and context for you.',
      templateApply: 'Apply',
      questionPlaceholder: 'Describe your clinical question, research need, or case scenario...',
      contextTitle: 'Additional Context (optional)',
      contextSubtitle: 'Add labs, patient traits, or constraints.',
      contextPlaceholder: 'E.g. 32-year-old female, 24 weeks pregnant, history of type 1 diabetes...',
      hintSend: 'Press Enter to send, Shift + Enter for newline.',
      hintLogin: 'Sign in to save history and citations',
      suggestionsTitle: 'Try these prompts:',
      historyTitle: 'Conversation History',
      historyEmpty: 'No conversation yet. Ask your first question 👇',
      historyCountTooltip: 'Saved answers',
      timelineTitle: 'Execution Timeline',
      timelineEmpty: 'No tool calls recorded',
      runQuestion: 'Question',
      runInfo: 'Execution Info',
      runAnswer: 'Agent Answer',
      runCitations: 'References',
      runThinking: 'Agent is reasoning...',
      runPlaceholder: 'Ask something and the agent will deliver structured answers with references here.',
      reuse: 'Edit & resubmit',
      copy: 'Copy answer',
      statusCode: 'Status',
      params: 'Parameters',
      output: 'Output',
      offline: 'Offline simulation',
      duration: 'Duration {seconds}s',
      tokenUsage: 'Tokens: {usage}',
      actionSuccess: 'Success',
      actionFailure: 'Failed',
      status: {
        loading: 'Generating',
        ready: 'Completed',
        error: 'Failed'
      },
      emptyTitle: 'Start a new conversation',
      emptySubtitle: 'Describe your clinical question or research goal and the agent will respond with evidence-backed guidance.'
    }
  }
};

export type TranslationKey = string;

type Params = Record<string, string | number>;

export const interpolate = (template: string, params?: Params): string => {
  if (!params) return template;
  return Object.keys(params).reduce((acc, key) => {
    const value = String(params[key]);
    return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }, template);
};

const getNestedValue = (tree: TranslationMap, path: string[]): TranslationLeaf | undefined => {
  return path.reduce<TranslationLeaf | undefined>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as TranslationMap)[segment];
    }
    return undefined;
  }, tree);
};

export const translate = (language: Language, key: TranslationKey, params?: Params): string => {
  const segments = key.split('.');
  const value = getNestedValue(translations[language], segments);
  if (!value) {
    return key;
  }
  if (typeof value === 'string') {
    return interpolate(value, params);
  }
  return key;
};
