import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Input, 
  Select, 
  Space,
  Badge,
  Spin,
  Empty 
} from 'antd';
import { 
  BookOutlined, 
  SearchOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../hooks/useCasesQuery';
import { Case } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface CaseFilters {
  category?: string;
  difficulty?: string;
  search?: string;
}

const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CaseFilters>({});
  
  const { data: cases, isLoading, error } = useCases(filters);

  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'cardiology': '心内科',
      'gastroenterology': '消化科',
      'neurology': '神经科',
      'respiratory': '呼吸科',
      'endocrinology': '内分泌科',
      'oncology': '肿瘤科',
      'emergency': '急诊科',
      'surgery': '外科',
      'pediatrics': '儿科',
      'gynecology': '妇科'
    };
    return categoryMap[category] || category;
  };

  const handleFilterChange = (key: keyof CaseFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty 
            description="加载病例失败，请稍后重试"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined /> 病例训练模块
        </Title>
        <Paragraph type="secondary">
          通过真实病例练习，提升临床诊断能力。涵盖各科室常见疾病，难度分级，适合不同水平的学习者。
        </Paragraph>
      </div>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索病例..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) => handleFilterChange('search', value)}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="选择科室"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="cardiology">心内科</Option>
              <Option value="gastroenterology">消化科</Option>
              <Option value="neurology">神经科</Option>
              <Option value="respiratory">呼吸科</Option>
              <Option value="endocrinology">内分泌科</Option>
              <Option value="oncology">肿瘤科</Option>
              <Option value="emergency">急诊科</Option>
              <Option value="surgery">外科</Option>
              <Option value="pediatrics">儿科</Option>
              <Option value="gynecology">妇科</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="选择难度"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('difficulty', value)}
            >
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
              <Button icon={<TrophyOutlined />} type="primary">
                我的成绩
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 病例列表 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">加载病例中...</Text>
          </div>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {cases && cases.length > 0 ? cases.map((caseItem: Case) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={caseItem.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button 
                    key="start"
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleCaseClick(caseItem.id)}
                  >
                    开始训练
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong ellipsis={{ tooltip: caseItem.title }}>
                        {caseItem.title}
                      </Text>
                      <Space>
                        <Tag color="blue">
                          {getCategoryText(caseItem.category)}
                        </Tag>
                        <Tag color={getDifficultyColor(caseItem.difficulty)}>
                          {getDifficultyText(caseItem.difficulty)}
                        </Tag>
                      </Space>
                    </Space>
                  }
                  description={
                    <Paragraph 
                      ellipsis={{ rows: 3, tooltip: caseItem.description }}
                      style={{ marginBottom: 0 }}
                    >
                      {caseItem.description}
                    </Paragraph>
                  }
                />
              </Card>
            </Col>
          )) : (
            <Col span={24}>
              <Empty 
                description="暂无符合条件的病例"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Col>
          )}
        </Row>
      )}

      {/* 统计信息 */}
      {cases && cases.length > 0 && (
        <Card 
          style={{ marginTop: '24px' }}
          title="统计信息"
          size="small"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Badge count={cases.length} showZero>
                <Text>总病例数</Text>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge 
                count={cases.filter((c: Case) => c.difficulty === 'easy').length} 
                showZero 
                color="green"
              >
                <Text>简单</Text>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge 
                count={cases.filter((c: Case) => c.difficulty === 'medium').length} 
                showZero 
                color="orange"
              >
                <Text>中等</Text>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge 
                count={cases.filter((c: Case) => c.difficulty === 'hard').length} 
                showZero 
                color="red"
              >
                <Text>困难</Text>
              </Badge>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default CasesPage; 