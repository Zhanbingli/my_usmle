// 模拟数据库，实际项目中可以使用MongoDB或其他数据库
let cases = [
  {
    id: '1',
    title: '胸痛病例',
    description: '58岁男性，有高血压和高脂血症病史，突发胸痛2小时，疼痛为压榨性，伴有出汗和恶心。',
    difficulty: 'medium',
    category: 'cardiology',
    correctDiagnosis: '急性心肌梗死',
    clinicalNotes: [
      { type: 'history', content: '患者有10年高血压病史，规律服用降压药。' },
      { type: 'physical', content: 'BP 160/95 mmHg, HR 110 bpm, RR 22/min, 体温 37.2°C' },
      { type: 'lab', content: '肌钙蛋白 T 升高，CK-MB 升高，白细胞计数 12,000/μL' },
      { type: 'imaging', content: 'ECG显示前壁导联ST段抬高' }
    ],
    feedbacks: {
      correct: '您正确识别了急性心肌梗死的典型表现。胸痛的特点、伴随症状和ECG改变都支持这一诊断。',
      incorrect: '请注意患者的症状特点：压榨性胸痛伴有出汗和恶心，以及ECG的变化，这些都提示急性心肌梗死的可能性。'
    }
  },
  {
    id: '2',
    title: '腹痛病例',
    description: '25岁女性，右下腹痛12小时，伴有恶心和轻度发热。',
    difficulty: 'easy',
    category: 'gastroenterology',
    correctDiagnosis: '急性阑尾炎',
    clinicalNotes: [
      { type: 'history', content: '患者无慢性病史，疼痛开始于脐周，后转移至右下腹。最后一次月经2周前。' },
      { type: 'physical', content: 'BP 125/75 mmHg, HR 90 bpm, RR 16/min, 体温 38.0°C, 右下腹压痛和反跳痛。' },
      { type: 'lab', content: '白细胞计数 14,000/μL, CRP 升高' },
      { type: 'imaging', content: '腹部超声显示阑尾增粗，周围有少量积液' }
    ],
    feedbacks: {
      correct: '您正确诊断了急性阑尾炎。迁移性右下腹痛、右下腹压痛反跳痛、发热和白细胞升高都是典型表现。',
      incorrect: '请考虑腹痛的迁移性（从脐周到右下腹）和右下腹的压痛反跳痛，这些是急性阑尾炎的典型表现。'
    }
  }
];

/**
 * 获取所有病例
 */
exports.getAllCases = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    let filteredCases = [...cases];
    
    // 应用过滤条件
    if (category) {
      filteredCases = filteredCases.filter(c => c.category === category);
    }
    
    if (difficulty) {
      filteredCases = filteredCases.filter(c => c.difficulty === difficulty);
    }
    
    // 只返回基本信息，不包括答案和详细内容
    const simplifiedCases = filteredCases.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      category: c.category
    }));
    
    return res.status(200).json({
      success: true,
      data: simplifiedCases
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '获取病例列表时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取单个病例详情
 */
exports.getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeAnswer = false } = req.query;
    
    const caseData = cases.find(c => c.id === id);
    
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: '未找到病例'
      });
    }
    
    // 根据参数决定是否包含正确答案
    if (includeAnswer === 'false' || includeAnswer === false) {
      const { correctDiagnosis, feedbacks, ...caseWithoutAnswer } = caseData;
      return res.status(200).json({
        success: true,
        data: caseWithoutAnswer
      });
    }
    
    return res.status(200).json({
      success: true,
      data: caseData
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '获取病例详情时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 提交诊断答案并获取反馈
 */
exports.submitDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis } = req.body;
    
    if (!diagnosis) {
      return res.status(400).json({
        success: false,
        message: '请提供诊断结果'
      });
    }
    
    const caseData = cases.find(c => c.id === id);
    
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: '未找到病例'
      });
    }
    
    // 简单的字符串匹配，实际项目中可以使用更复杂的匹配逻辑或AI评估
    const isCorrect = diagnosis.toLowerCase().includes(caseData.correctDiagnosis.toLowerCase());
    
    return res.status(200).json({
      success: true,
      data: {
        isCorrect,
        correctDiagnosis: caseData.correctDiagnosis,
        feedback: isCorrect ? caseData.feedbacks.correct : caseData.feedbacks.incorrect
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '提交诊断时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 