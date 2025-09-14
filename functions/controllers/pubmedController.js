const axios = require('axios');

// PubMed API 配置 - NCBI Entrez API 是免费的，不需要API key
const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

// 模拟数据，当PubMed API无法访问时使用
const DISABLE_DB = String(process.env.DISABLE_DB || '').toLowerCase() === 'true';
const mockArticles = [
  {
    pmid: '37129568',
    title: 'The role of artificial intelligence in medical diagnosis: a systematic review',
    authors: ['Smith J', 'Johnson A', 'Williams B'],
    abstract: 'Artificial intelligence (AI) is increasingly being applied to medical diagnosis. This systematic review evaluates the efficacy and accuracy of AI algorithms in diagnosing various medical conditions compared to traditional diagnostic methods. Our analysis of 45 studies indicates that AI can achieve comparable or superior diagnostic accuracy in specific domains, particularly in image recognition tasks such as radiology and pathology. However, challenges remain in clinical integration, data quality, and regulatory frameworks.',
    journal: 'Journal of Medical Informatics',
    publicationDate: '2023-04-15',
    doi: '10.1016/j.jmedinf.2023.03.001',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37129568/',
    keywords: ['artificial intelligence', 'medical diagnosis', 'machine learning']
  },
  {
    pmid: '36982145',
    title: 'Clinical applications of generative AI models in healthcare: opportunities and ethical considerations',
    authors: ['Chen Y', 'Kumar R', 'Garcia M', 'Lee S'],
    abstract: 'Generative AI models like GPT have shown promising results in various healthcare applications. This review examines current applications, performance metrics, and ethical considerations of these models in clinical settings. We identify key areas of impact including medical documentation, patient communication, clinical decision support, and medical education. While these models demonstrate significant potential to improve healthcare delivery, concerns regarding hallucinations, data privacy, and potential bias require careful consideration before widespread implementation.',
    journal: 'npj Digital Medicine',
    publicationDate: '2023-03-28',
    doi: '10.1038/s41746-023-00789-9',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36982145/',
    keywords: ['generative AI', 'healthcare', 'clinical decision support']
  },
  {
    pmid: '35764290',
    title: 'Machine learning for prediction of COVID-19 severity: a retrospective analysis of electronic health records',
    authors: ['Wang L', 'Zhang H', 'Tan X', 'Brown J', 'Martinez D'],
    abstract: 'Early identification of patients at risk for severe COVID-19 is crucial for appropriate resource allocation and intervention. This study developed and validated machine learning models to predict COVID-19 severity using electronic health records from 2,384 patients. Our model achieved an AUC of 0.89 for predicting ICU admission within 24 hours of presentation. Key predictive features included age, oxygen saturation, lymphocyte count, and specific comorbidities. This approach may help optimize hospital resource utilization during pandemic surges.',
    journal: 'JAMA Network Open',
    publicationDate: '2022-06-15',
    doi: '10.1001/jamanetworkopen.2022.12417',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35764290/',
    keywords: ['COVID-19', 'machine learning', 'electronic health records']
  },
  {
    pmid: '34697223',
    title: 'Deep learning algorithms for detection of diabetic retinopathy in retinal imaging: a systematic review and meta-analysis',
    authors: ['Kim T', 'Patel V', 'Nguyen H', 'Ibrahim M'],
    abstract: 'Diabetic retinopathy (DR) is a leading cause of preventable blindness globally. This meta-analysis evaluated the performance of deep learning algorithms for DR detection across 23 studies involving 212,342 retinal images. The pooled sensitivity was 0.93 (95% CI: 0.91-0.94) and specificity was 0.92 (95% CI: 0.90-0.94). These results suggest that AI systems can detect DR with high accuracy, potentially enabling more widespread and cost-effective screening programs, especially in resource-limited settings.',
    journal: 'Ophthalmology',
    publicationDate: '2021-10-18',
    doi: '10.1016/j.ophtha.2021.09.026',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34697223/',
    keywords: ['diabetic retinopathy', 'deep learning', 'retinal imaging']
  },
  {
    pmid: '36458972',
    title: 'Large language models in medicine: the potentials and pitfalls',
    authors: ['Anderson R', 'Thompson B', 'Liu C', 'Ramirez J'],
    abstract: 'Large language models (LLMs) such as GPT-4 represent a significant advance in artificial intelligence with numerous potential applications in healthcare. This perspective discusses the capabilities of these models in medical contexts, including clinical documentation assistance, medical education, and patient communication. We also address critical limitations including hallucinations, limited reasoning capabilities, and potential for reinforcing biases in medical practice. A framework for responsible integration of LLMs into clinical workflows is proposed, emphasizing human oversight and continuous evaluation.',
    journal: 'Nature Medicine',
    publicationDate: '2022-12-05',
    doi: '10.1038/s41591-022-02163-w',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36458972/',
    keywords: ['large language models', 'medicine', 'clinical workflows']
  },
  {
    pmid: '33821159',
    title: 'Telemedicine adoption during COVID-19: systematic review and meta-analysis',
    authors: ['Rodriguez A', 'Kim M', 'Johnson K'],
    abstract: 'The COVID-19 pandemic accelerated telemedicine adoption globally. This systematic review analyzed telemedicine implementation across 156 studies. Results show 300% increase in telehealth utilization, with high patient satisfaction (>85%) and comparable clinical outcomes to in-person care for many conditions.',
    journal: 'The Lancet Digital Health',
    publicationDate: '2021-04-10',
    doi: '10.1016/S2589-7500(21)00040-2',
    url: 'https://pubmed.ncbi.nlm.nih.gov/33821159/',
    keywords: ['telemedicine', 'COVID-19', 'digital health']
  }
];

/**
 * 搜索PubMed文献
 */
exports.searchPubMed = async (req, res) => {
  try {
    // 从查询参数或请求体中获取参数
    const query = req.body?.query || req.query?.query;
    const journal = req.body?.journal || req.query?.journal;
    const author = req.body?.author || req.query?.author;
    const startDate = req.body?.startDate || req.query?.startDate;
    const endDate = req.body?.endDate || req.query?.endDate;
    const sortBy = req.body?.sortBy || req.query?.sortBy || 'relevance';
    
    console.log('PubMed Search Request:', { query, journal, author, startDate, endDate, sortBy });
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: '请提供搜索关键词'
      });
    }

    try {
      // 尝试使用真实的PubMed API
      let searchTerm = query;
      
      // 添加期刊筛选
      if (journal) {
        searchTerm += ` AND "${journal}"[Journal]`;
      }
      
      // 添加作者筛选
      if (author) {
        searchTerm += ` AND "${author}"[Author]`;
      }
      
      // 添加日期筛选
      if (startDate && endDate) {
        searchTerm += ` AND ("${startDate}"[Date - Publication] : "${endDate}"[Date - Publication])`;
      }
      
      console.log('Constructed search term:', searchTerm);
      
      // 第一步：搜索获取PMID列表
      const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi`;
      const searchParams = {
        db: 'pubmed',
        term: searchTerm,
        retmode: 'json',
        retmax: 20,
        sort: sortBy === 'date' ? 'pub_date' : 'relevance'
      };
      
      console.log('Search URL:', searchUrl, 'Params:', searchParams);
      
      const searchResponse = await axios.get(searchUrl, { 
        params: searchParams,
        timeout: 10000 // 10秒超时
      });
      
      const searchResult = searchResponse.data?.esearchresult;
      const idList = searchResult?.idlist || [];
      
      console.log('Search result:', { count: searchResult?.count, idList: idList.slice(0, 5) });
      
      if (idList.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }
      
      // 第二步：获取文章详情
      const summaryUrl = `${PUBMED_BASE_URL}/esummary.fcgi`;
      const summaryParams = {
        db: 'pubmed',
        id: idList.join(','),
        retmode: 'json'
      };
      
      const summaryResponse = await axios.get(summaryUrl, { 
        params: summaryParams,
        timeout: 10000
      });
      
      const articles = [];
      const summaryResult = summaryResponse.data?.result;
      
      if (summaryResult) {
        for (const pmid of idList) {
          const article = summaryResult[pmid];
          if (article && article.title) {
            articles.push({
              pmid: pmid,
              title: article.title || 'Title not available',
              authors: article.authors ? article.authors.map(a => a.name).slice(0, 5) : [],
              abstract: 'Abstract available - click to view details',
              journal: article.fulljournalname || article.source || 'Journal not available',
              publicationDate: article.pubdate || 'Date not available',
              doi: article.elocationid || null,
              url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
              keywords: []
            });
          }
        }
      }
      
      console.log(`Successfully retrieved ${articles.length} articles from PubMed API`);
      
      return res.json({
        success: true,
        data: articles
      });
      
    } catch (apiError) {
      console.error('PubMed API Error:', apiError.message);
      
      // 如果真实API失败，使用模拟数据
      const filteredArticles = mockArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) || 
        article.abstract.toLowerCase().includes(query.toLowerCase()) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );
      
      // 应用其他筛选条件
      let finalArticles = filteredArticles;
      
      if (journal) {
        finalArticles = finalArticles.filter(article => 
          article.journal.toLowerCase().includes(journal.toLowerCase())
        );
      }
      
      if (author) {
        finalArticles = finalArticles.filter(article => 
          article.authors.some(a => a.toLowerCase().includes(author.toLowerCase()))
        );
      }
      
      console.log(`Using mock data: ${finalArticles.length} articles found`);
      
      return res.json({
        success: true,
        data: finalArticles,
        source: 'mock' // 标记数据来源
      });
    }
  } catch (error) {
    console.error('PubMed Controller Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: '搜索PubMed时出错: ' + error.message
    });
  }
};

/**
 * 获取PubMed文章详情
 */
exports.getArticleDetails = async (req, res) => {
  try {
    const { pmid } = req.params;
    
    if (!pmid) {
      return res.status(400).json({
        success: false,
        error: '请提供PubMed ID'
      });
    }

    try {
      // 尝试从真实API获取详情
      const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi`;
      const fetchParams = {
        db: 'pubmed',
        id: pmid,
        retmode: 'xml'
      };
      
      const fetchResponse = await axios.get(fetchUrl, { 
        params: fetchParams,
        timeout: 10000
      });
      
      // 这里可以解析XML响应获取详细信息
      // 为简化，我们先从模拟数据中查找
      const mockArticle = mockArticles.find(article => article.pmid === pmid);
      
      if (mockArticle) {
        return res.json({
          success: true,
          data: mockArticle
        });
      }
      
      // 如果找不到，返回基本信息
      return res.json({
        success: true,
        data: {
          pmid: pmid,
          title: 'Article title not available',
          authors: [],
          abstract: 'Full text available at PubMed',
          journal: 'Journal information not available',
          publicationDate: 'Date not available',
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          doi: null,
          keywords: []
        }
      });
      
    } catch (apiError) {
      console.error('PubMed Fetch Error:', apiError.message);
      
      // 从模拟数据中查找
      const mockArticle = mockArticles.find(article => article.pmid === pmid);
      
      if (mockArticle) {
        return res.json({
          success: true,
          data: mockArticle,
          source: 'mock'
        });
      }
      
      return res.status(404).json({
        success: false,
        error: '文章未找到'
      });
    }
  } catch (error) {
    console.error('Article Details Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: '获取文章详情时出错: ' + error.message
    });
  }
};

/**
 * 获取相关文章（基于标题/关键词的简单匹配 - 模拟版）
 */
exports.getRelatedArticles = async (req, res) => {
  try {
    const { pmid } = req.params;
    const base = mockArticles.find(a => a.pmid === pmid);
    if (!base) {
      return res.json({ success: true, data: [] });
    }
    const keywords = new Set((base.keywords || []).map(k => k.toLowerCase()));
    const related = mockArticles.filter(a => a.pmid !== pmid).filter(a =>
      a.title.toLowerCase().includes(base.title.split(' ')[0].toLowerCase()) ||
      (a.keywords || []).some(k => keywords.has(String(k).toLowerCase()))
    ).slice(0, 5);
    return res.json({ success: true, data: related, source: 'mock' });
  } catch (err) {
    console.error('getRelatedArticles error:', err);
    return res.status(500).json({ success: false, error: '获取相关文章失败' });
  }
};

/**
 * 保存文章到收藏（需要认证）
 */
exports.saveArticle = async (req, res) => {
  try {
    const { pmid } = req.params;
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ success: false, error: '未认证' });

    const article = mockArticles.find(a => a.pmid === pmid) || { pmid, url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` };
    if (!DISABLE_DB) {
      const admin = require('firebase-admin');
      const db = admin.firestore();
      await db.collection('savedArticles').add({
        userId,
        pmid: article.pmid,
        title: article.title || 'Unknown',
        authors: article.authors || [],
        journal: article.journal || '',
        url: article.url,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return res.json({ success: true, message: '已收藏' });
  } catch (err) {
    console.error('saveArticle error:', err);
    return res.status(500).json({ success: false, error: '保存失败' });
  }
};

/**
 * 获取用户收藏文章（需要认证）
 */
exports.getSavedArticles = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.user || (req.user.uid !== userId && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, error: '无权限' });
    }
    if (DISABLE_DB) {
      return res.json({ success: true, data: [] });
    }
    const admin = require('firebase-admin');
    const db = admin.firestore();
    const snap = await db.collection('savedArticles').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate()?.toISOString() }));
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error('getSavedArticles error:', err);
    return res.status(500).json({ success: false, error: '获取收藏失败' });
  }
};
