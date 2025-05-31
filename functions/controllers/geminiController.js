const axios = require('axios');

// 模拟回答，当Gemini API无法访问时使用
const mockResponses = {
  medical: `作为一名医学顾问，我理解您的问题可能需要专业的医疗建议。

基于您提供的信息，这可能与以下几种情况有关：

1. **常见原因**：
   - 暂时性的生理反应
   - 轻微的自限性疾病
   - 生活方式因素（如饮食、睡眠、压力）

2. **可能的处理方法**：
   - 注意休息和保持充分的水分摄入
   - 规律的生活作息
   - 均衡饮食
   - 适量运动

3. **建议咨询医生的情况**：
   - 症状持续超过两周
   - 疼痛剧烈或突然加重
   - 出现发热、极度疲劳等全身症状
   - 有基础疾病史

请注意，这只是一般性建议。确切的诊断和治疗需要面对面的临床评估。如果症状持续存在或加重，请及时就医。

您是否有其他具体的问题或症状需要进一步讨论？`,

  clinical: `## 临床思维分析

### 鉴别诊断（按可能性排序）
1. 上呼吸道感染
2. 季节性过敏
3. 支气管炎
4. 非典型肺炎
5. 新冠感染

### 重要病史问题
1. 症状持续时间和发展过程
2. 是否有发热，体温最高达到多少
3. 接触史（是否接触过有类似症状的人）
4. 过敏史和既往病史
5. 目前用药情况
6. 症状是否影响日常活动和睡眠

### 建议的体格检查
1. 生命体征检查（体温、心率、呼吸率、血压、血氧饱和度）
2. 咽部检查
3. 淋巴结触诊
4. 胸部听诊
5. 鼻腔检查

### 推荐的检查项目
1. 血常规检查
2. C反应蛋白和血沉
3. 胸部X线片
4. 新冠和流感检测

### 初步治疗计划
根据最可能的诊断（上呼吸道感染），建议对症治疗为主，包括：
- 充分休息和水分摄入
- 解热镇痛药物（如对乙酰氨基酚）控制发热和不适
- 根据鼻塞、咳嗽等具体症状选择合适的对症药物
- 密切观察症状变化，如症状加重应及时就医

这个分析框架可以帮助医学生系统地思考临床问题，从病史采集到诊断和治疗计划的制定。`
};

/**
 * 使用Gemini API处理医学问题
 */
exports.processMedicalQuery = async (req, res) => {
  try {
    const { query, context = '', temperature = 0.7 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: '请提供查询内容'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `${process.env.GEMINI_API_URL}/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    
    // 构建提示词，包含医学专业背景
    const medicalPrompt = `你是一位经验丰富的医学顾问，拥有广泛的医学知识和临床经验。
    请根据以下问题提供准确、专业的医学建议和信息。如有必要，请提供诊断思路、鉴别诊断和治疗建议。
    同时，如果信息不足，请指出需要进一步询问哪些内容。

    问题: ${query}
    
    ${context ? `背景信息: ${context}` : ''}`;
    
    try {
      const response = await axios.post(apiUrl, {
        contents: [
          {
            parts: [
              {
                text: medicalPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 2048,
        }
      });
      
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      return res.status(200).json({
        success: true,
        data: {
          answer: generatedText,
          query: query
        }
      });
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      
      // 使用模拟回答
      return res.status(200).json({
        success: true,
        data: {
          answer: mockResponses.medical,
          query: query,
          source: 'mock' // 标记为模拟数据
        }
      });
    }
  } catch (error) {
    console.error('Gemini Controller Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '处理查询时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 使用Gemini模拟临床思维训练
 */
exports.simulateClinicalReasoning = async (req, res) => {
  try {
    const { caseDetails, userDiagnosis, stage = 'initial' } = req.body;
    
    if (!caseDetails) {
      return res.status(400).json({
        success: false,
        message: '请提供病例详情'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `${process.env.GEMINI_API_URL}/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    
    let prompt;
    
    switch (stage) {
      case 'initial':
        prompt = `你是一位资深的医学教育专家。我将向你提供一个病例，请你根据病例生成一系列引导性问题，帮助医学生进行临床思维训练。
        
        病例: ${caseDetails}
        
        请为这个病例生成以下内容:
        1. 5个关键的鉴别诊断，按可能性排序
        2. 应该询问的重要病史问题（至少5个）
        3. 应该进行的体格检查（至少5个）
        4. 建议的实验室和影像学检查（至少3个）
        5. 初步治疗计划`;
        break;
        
      case 'feedback':
        prompt = `你是一位资深的医学教育专家。我将向你提供一个病例和医学生的诊断，请你提供专业的反馈和建议。
        
        病例: ${caseDetails}
        
        医学生的诊断: ${userDiagnosis}
        
        请提供以下内容:
        1. 对医学生诊断的评估（正确之处和错误之处）
        2. 正确的诊断思路和最可能的诊断
        3. 关键的诊断线索，以及医学生可能忽略的重要信息
        4. 建议的进一步学习资源和知识点`;
        break;
        
      default:
        prompt = `你是一位资深的医学教育专家。请基于以下病例信息，提供专业的医学分析。
        
        病例: ${caseDetails}`;
    }
    
    try {
      const response = await axios.post(apiUrl, {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        }
      });
      
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      return res.status(200).json({
        success: true,
        data: {
          response: generatedText,
          stage: stage
        }
      });
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      
      // 使用模拟回答
      return res.status(200).json({
        success: true,
        data: {
          response: mockResponses.clinical,
          stage: stage,
          source: 'mock' // 标记为模拟数据
        }
      });
    }
  } catch (error) {
    console.error('Gemini Controller Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '处理临床思维训练时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 