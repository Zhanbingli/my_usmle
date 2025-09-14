import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  List, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Spin, 
  Empty,
  Badge,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { usePubMedSearch } from '../hooks/usePubMedQuery';
import { Article } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchFilters {
  query?: string;
  journal?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'relevance' | 'date' | 'citations';
}

const PubMedSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const searchParams = {
    ...filters,
    query: searchQuery
  };

  const { data: articles, isLoading, error } = usePubMedSearch(searchParams);

  console.log('PubMed Search Debug:', {
    searchQuery,
    filters,
    searchParams,
    isLoading,
    error: error?.message,
    articles: articles?.length
  });

  const handleSearch = (value: string) => {
    console.log('搜索触发:', value);
    setSearchQuery(value);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    console.log('筛选器变更:', key, value);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setFilters(prev => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD')
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined
      }));
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getJournalColor = (journal: string) => {
    const colors = ['blue', 'green', 'orange', 'red', 'purple', 'cyan'];
    const hash = journal.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <FileTextOutlined /> PubMed文献检索
        </Title>
        <Paragraph type="secondary">
          搜索最新的医学文献，获取权威的研究资料和临床指南。
        </Paragraph>
      </div>

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <Alert
          message="调试信息"
          description={
            <div>
              <p><strong>搜索参数:</strong> {JSON.stringify(searchParams, null, 2)}</p>
              <p><strong>加载状态:</strong> {isLoading ? '加载中' : '空闲'}</p>
              <p><strong>错误信息:</strong> {error?.message || '无'}</p>
              <p><strong>结果数量:</strong> {articles?.length || 0}</p>
            </div>
          }
          type="info"
          style={{ marginBottom: '16px' }}
          closable
        />
      )}

      {/* 搜索区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Search
              placeholder="输入关键词搜索文献..."
              allowClear
              enterButton={
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              }
              size="large"
              onSearch={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                高级筛选
              </Button>
              <Button onClick={clearFilters}>
                清除筛选
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 高级筛选 */}
        {showAdvancedFilters && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fafafa', borderRadius: '6px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Text strong>期刊：</Text>
                <Select
                  placeholder="选择期刊"
                  allowClear
                  style={{ width: '100%', marginTop: '4px' }}
                  onChange={(value) => handleFilterChange('journal', value)}
                >
                  <Option value="Nature">Nature</Option>
                  <Option value="Science">Science</Option>
                  <Option value="Cell">Cell</Option>
                  <Option value="NEJM">New England Journal of Medicine</Option>
                  <Option value="Lancet">The Lancet</Option>
                  <Option value="JAMA">JAMA</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>作者：</Text>
                <Input
                  placeholder="作者姓名"
                  style={{ marginTop: '4px' }}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>发表日期：</Text>
                <RangePicker
                  style={{ width: '100%', marginTop: '4px' }}
                  onChange={handleDateRangeChange}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>排序方式：</Text>
                <Select
                  defaultValue="relevance"
                  style={{ width: '100%', marginTop: '4px' }}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <Option value="relevance">相关性</Option>
                  <Option value="date">发表日期</Option>
                  <Option value="citations">引用次数</Option>
                </Select>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* 搜索结果 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">搜索中...</Text>
          </div>
        </div>
      ) : error ? (
        <Card>
          <Empty 
            description={
              <div>
                <p>搜索失败，请稍后重试</p>
                <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                  错误详情: {error.message}
                </p>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Card 
          title={
            <Space>
              <FileTextOutlined />
              <span>搜索结果</span>
              {articles && (
                <Badge count={articles.length} style={{ backgroundColor: '#52c41a' }} />
              )}
            </Space>
          }
        >
          {articles && articles.length > 0 ? (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={articles}
              renderItem={(article: Article) => (
                <List.Item
                  key={article.pmid}
                  actions={[
                    <Button 
                      key="view"
                      type="link" 
                      icon={<LinkOutlined />}
                      href={article.url}
                      target="_blank"
                    >
                      查看原文
                    </Button>,
                    <Button key="save" type="link">
                      收藏
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <Text strong style={{ fontSize: '16px' }}>
                          {article.title}
                        </Text>
                        <div style={{ marginTop: '8px' }}>
                          <Space wrap>
                            <Tag color={getJournalColor(article.journal)}>
                              {article.journal}
                            </Tag>
                            <Tag icon={<CalendarOutlined />} color="default">
                              {article.publicationDate}
                            </Tag>
                            <Tag icon={<UserOutlined />} color="default">
                              {article.authors.slice(0, 3).join(', ')}
                              {article.authors.length > 3 && ' 等'}
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '12px' }}>
                        <Paragraph 
                          ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
                          style={{ marginBottom: '8px' }}
                        >
                          {article.abstract}
                        </Paragraph>
                        <div style={{ marginTop: '8px' }}>
                          <Space>
                            <Text type="secondary">PMID: {article.pmid}</Text>
                            {article.doi && (
                              <Text type="secondary">DOI: {article.doi}</Text>
                            )}
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : searchQuery ? (
            <Empty 
              description={`未找到关于 "${searchQuery}" 的相关文献`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Empty 
              description="请输入关键词开始搜索"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      )}

      {/* 搜索提示 */}
      {!searchQuery && (
        <Card 
          title="搜索提示" 
          style={{ marginTop: '24px' }}
          size="small"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Title level={5}>热门搜索：</Title>
              <Space wrap>
                <Tag 
                  color="blue" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSearch('COVID-19')}
                >
                  COVID-19
                </Tag>
                <Tag 
                  color="green" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSearch('machine learning')}
                >
                  机器学习
                </Tag>
                <Tag 
                  color="orange" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSearch('diabetes')}
                >
                  糖尿病
                </Tag>
                <Tag 
                  color="red" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSearch('cancer treatment')}
                >
                  癌症治疗
                </Tag>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Title level={5}>搜索技巧：</Title>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>使用英文关键词获得更好的搜索结果</li>
                <li>使用引号搜索精确短语，如 "machine learning"</li>
                <li>使用 AND、OR 连接多个关键词</li>
                <li>使用高级筛选缩小搜索范围</li>
              </ul>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default PubMedSearchPage; 