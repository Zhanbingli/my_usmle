function buildToolDrivenPrompt({ goal, context, mode }) {
  return [
    {
      role: 'user',
      parts: [
        {
          text: `你是一名医学智能代理。请遵循以下规则进行多步推理：\n- 优先使用工具(pubmed.*、cases.*)获取事实\n- 最多 3 次工具调用\n- 返回结构化结果：要点、引用(如有)、下一步建议\n\n任务: ${goal}${context ? `\n背景: ${context}` : ''}${mode ? `\n模式: ${mode}` : ''}`,
        },
      ],
    },
  ];
}

function buildStructuredAnswerPrompt({ goal, context, mode }) {
  return `你是一名资深的医学信息分析助手，请提供清晰的结构化回答。\n任务: ${goal}${context ? `\n背景: ${context}` : ''}\n期望输出: \n1. 核心结论或诊断建议\n2. 支持依据（如存在请引用）\n3. 推荐的下一步行动\n模式: ${mode || 'auto'}`;
}

module.exports = {
  buildStructuredAnswerPrompt,
  buildToolDrivenPrompt,
};
