const axios = require('axios');

// 模拟数据，当PubMed API无法访问时使用
const mockArticles = [
  {
    pmid: '37129568',
    title: 'The role of artificial intelligence in medical diagnosis: a systematic review',
    authors: ['Smith J', 'Johnson A', 'Williams B'],
    abstract: 'Artificial intelligence (AI) is increasingly being applied to medical diagnosis. This systematic review evaluates the efficacy and accuracy of AI algorithms in diagnosing various medical conditions compared to traditional diagnostic methods. Our analysis of 45 studies indicates that AI can achieve comparable or superior diagnostic accuracy in specific domains, particularly in image recognition tasks such as radiology and pathology. However, challenges remain in clinical integration, data quality, and regulatory frameworks.',
    journal: 'Journal of Medical Informatics',
    publicationDate: '2023 Apr 15',
    doi: 'doi:10.1016/j.jmedinf.2023.03.001',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37129568/'
  },
  {
    pmid: '36982145',
    title: 'Clinical applications of generative AI models in healthcare: opportunities and ethical considerations',
    authors: ['Chen Y', 'Kumar R', 'Garcia M', 'Lee S'],
    abstract: 'Generative AI models like GPT have shown promising results in various healthcare applications. This review examines current applications, performance metrics, and ethical considerations of these models in clinical settings. We identify key areas of impact including medical documentation, patient communication, clinical decision support, and medical education. While these models demonstrate significant potential to improve healthcare delivery, concerns regarding hallucinations, data privacy, and potential bias require careful consideration before widespread implementation.',
    journal: 'npj Digital Medicine',
    publicationDate: '2023 Mar 28',
    doi: 'doi:10.1038/s41746-023-00789-9',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36982145/'
  },
  {
    pmid: '35764290',
    title: 'Machine learning for prediction of COVID-19 severity: a retrospective analysis of electronic health records',
    authors: ['Wang L', 'Zhang H', 'Tan X', 'Brown J', 'Martinez D'],
    abstract: 'Early identification of patients at risk for severe COVID-19 is crucial for appropriate resource allocation and intervention. This study developed and validated machine learning models to predict COVID-19 severity using electronic health records from 2,384 patients. Our model achieved an AUC of 0.89 for predicting ICU admission within 24 hours of presentation. Key predictive features included age, oxygen saturation, lymphocyte count, and specific comorbidities. This approach may help optimize hospital resource utilization during pandemic surges.',
    journal: 'JAMA Network Open',
    publicationDate: '2022 Jun 15',
    doi: 'doi:10.1001/jamanetworkopen.2022.12417',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35764290/'
  },
  {
    pmid: '34697223',
    title: 'Deep learning algorithms for detection of diabetic retinopathy in retinal imaging: a systematic review and meta-analysis',
    authors: ['Kim T', 'Patel V', 'Nguyen H', 'Ibrahim M'],
    abstract: 'Diabetic retinopathy (DR) is a leading cause of preventable blindness globally. This meta-analysis evaluated the performance of deep learning algorithms for DR detection across 23 studies involving 212,342 retinal images. The pooled sensitivity was 0.93 (95% CI: 0.91-0.94) and specificity was 0.92 (95% CI: 0.90-0.94). These results suggest that AI systems can detect DR with high accuracy, potentially enabling more widespread and cost-effective screening programs, especially in resource-limited settings.',
    journal: 'Ophthalmology',
    publicationDate: '2021 Oct 18',
    doi: 'doi:10.1016/j.ophtha.2021.09.026',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34697223/'
  },
  {
    pmid: '36458972',
    title: 'Large language models in medicine: the potentials and pitfalls',
    authors: ['Anderson R', 'Thompson B', 'Liu C', 'Ramirez J'],
    abstract: 'Large language models (LLMs) such as GPT-4 represent a significant advance in artificial intelligence with numerous potential applications in healthcare. This perspective discusses the capabilities of these models in medical contexts, including clinical documentation assistance, medical education, and patient communication. We also address critical limitations including hallucinations, limited reasoning capabilities, and potential for reinforcing biases in medical practice. A framework for responsible integration of LLMs into clinical workflows is proposed, emphasizing human oversight and continuous evaluation.',
    journal: 'Nature Medicine',
    publicationDate: '2022 Dec 5',
    doi: 'doi:10.1038/s41591-022-02163-w',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36458972/'
  }
];

/**
 * 搜索PubMed文献
 */
exports.searchPubMed = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }

    const apiUrl = process.env.PUBMED_API_URL;
    const apiKey = process.env.PUBMED_API_KEY;
    
    // 尝试通过正常API调用获取数据
    try {
      // 计算偏移量
      const retStart = (page - 1) * limit;
      
      // 使用PubMed API进行搜索
      // 先获取符合条件的文章ID列表
      const searchResponse = await axios.get(`${apiUrl}/esearch.fcgi`, {
        params: {
          db: 'pubmed',
          term: query,
          retmode: 'json',
          retmax: limit,
          retstart: retStart,
          sort: 'relevance',
          api_key: apiKey
        }
      });
      
      const idList = searchResponse.data.esearchresult.idlist;
      
      if (!idList || idList.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            articles: [],
            total: 0,
            page: page,
            limit: limit
          }
        });
      }
      
      // 使用获取到的ID列表获取文章详情
      const summaryResponse = await axios.get(`${apiUrl}/esummary.fcgi`, {
        params: {
          db: 'pubmed',
          id: idList.join(','),
          retmode: 'json',
          api_key: apiKey
        }
      });
      
      const articles = [];
      
      // 提取相关的文章信息
      for (const id of idList) {
        const article = summaryResponse.data.result[id];
        
        if (article) {
          articles.push({
            pmid: id,
            title: article.title,
            authors: article.authors ? article.authors.map(author => `${author.name}`) : [],
            abstract: article.abstracttext || 'Abstract not available',
            journal: article.fulljournalname,
            publicationDate: article.pubdate,
            doi: article.elocationid || null,
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
          });
        }
      }
      
      return res.status(200).json({
        success: true,
        data: {
          articles,
          total: parseInt(searchResponse.data.esearchresult.count),
          page: page,
          limit: limit
        }
      });
    } catch (error) {
      console.error('PubMed API Error:', error.response?.data || error.message);
      
      // 如果API调用失败，使用模拟数据
      const filteredArticles = mockArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) || 
        article.abstract.toLowerCase().includes(query.toLowerCase())
      );
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
      
      return res.status(200).json({
        success: true,
        data: {
          articles: paginatedArticles,
          total: filteredArticles.length,
          page: page,
          limit: limit,
          source: 'mock' // 标记数据来源
        }
      });
    }
  } catch (error) {
    console.error('PubMed Controller Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '搜索PubMed时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: '请提供PubMed ID'
      });
    }

    const apiUrl = process.env.PUBMED_API_URL;
    const apiKey = process.env.PUBMED_API_KEY;
    
    // 尝试通过正常API调用获取数据
    try {
      // 获取文章详情
      const detailsResponse = await axios.get(`${apiUrl}/efetch.fcgi`, {
        params: {
          db: 'pubmed',
          id: pmid,
          retmode: 'xml',
          api_key: apiKey
        }
      });
      
      // 获取文章摘要
      const summaryResponse = await axios.get(`${apiUrl}/esummary.fcgi`, {
        params: {
          db: 'pubmed',
          id: pmid,
          retmode: 'json',
          api_key: apiKey
        }
      });
      
      // 从XML响应中提取全文链接等信息
      // 注意：这里简化处理，实际可能需要XML解析
      const xmlData = detailsResponse.data;
      const articleData = summaryResponse.data.result[pmid];
      
      if (!articleData) {
        return res.status(404).json({
          success: false,
          message: '未找到文章'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          pmid: pmid,
          title: articleData.title,
          authors: articleData.authors ? articleData.authors.map(author => `${author.name}`) : [],
          abstract: articleData.abstracttext || 'Abstract not available',
          journal: articleData.fulljournalname,
          publicationDate: articleData.pubdate,
          doi: articleData.elocationid || null,
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          fullTextLinks: articleData.articleids
            .filter(id => id.idtype === 'doi')
            .map(id => `https://doi.org/${id.value}`)
        }
      });
    } catch (error) {
      console.error('PubMed API Error:', error.response?.data || error.message);
      
      // 如果API调用失败，使用模拟数据
      const mockArticle = mockArticles.find(article => article.pmid === pmid);
      
      if (!mockArticle) {
        return res.status(404).json({
          success: false,
          message: '未找到文章'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          ...mockArticle,
          fullTextLinks: mockArticle.doi ? [`https://doi.org/${mockArticle.doi.replace('doi:', '')}`] : [],
          source: 'mock' // 标记数据来源
        }
      });
    }
  } catch (error) {
    console.error('PubMed Controller Error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: '获取文章详情时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 