import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Statistic } from 'antd';
import { 
  RobotOutlined, 
  BookOutlined, 
  SearchOutlined, 
  TrophyOutlined,
  ArrowRightOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();

  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'AI智能问诊',
      description: '基于Gemini AI的智能医学助手，提供专业的医学咨询和诊断建议',
      path: '/query',
      color: '#e6f7ff'
    },
    {
      icon: <BookOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '病例训练',
      description: '丰富的临床病例库，分级训练提升诊断思维和临床技能',
      path: '/cases',
      color: '#f6ffed'
    },
    {
      icon: <SearchOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: 'PubMed检索',
      description: '集成PubMed数据库，快速检索最新医学文献和研究成果',
      path: '/pubmed',
      color: '#fffbe6'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      title: 'USMLE考试',
      description: '专业的USMLE考试模拟和训练，助力医学生通过考试',
      path: '/exam',
      color: '#fff1f0'
    }
  ];

  const stats = [
    { title: '注册用户', value: 1234, suffix: '人', icon: <UserOutlined /> },
    { title: '病例数量', value: 567, suffix: '个', icon: <MedicineBoxOutlined /> },
    { title: '问诊次数', value: 8901, suffix: '次', icon: <RobotOutlined /> },
    { title: '在线时长', value: 2345, suffix: '小时', icon: <ClockCircleOutlined /> }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 160px)' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '60px 40px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '40px'
      }}>
        <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>
          智能医学AI平台
        </Title>
        <Paragraph style={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: '20px', 
          maxWidth: '600px', 
          margin: '0 auto 32px' 
        }}>
          基于人工智能的医学教育和临床辅助平台，为医学生和医生提供智能问诊、病例训练、文献检索等服务
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<RobotOutlined />}
            onClick={() => navigate('/query')}
            style={{ height: '48px', fontSize: '16px' }}
          >
            开始AI问诊
          </Button>
          <Button 
            size="large" 
            ghost
            icon={<BookOutlined />}
            onClick={() => navigate('/cases')}
            style={{ height: '48px', fontSize: '16px' }}
          >
            浏览病例
          </Button>
        </Space>
      </div>

      {/* Stats Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Features Section */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        核心功能
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: '12px',
                background: feature.color,
                border: 'none'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => navigate(feature.path)}
            >
              <div style={{ marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ marginBottom: '12px' }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '20px' }}>
                {feature.description}
              </Paragraph>
              <Button type="link" icon={<ArrowRightOutlined />}>
                了解更多
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && user && (
        <Card style={{ borderRadius: '12px', background: '#f0f9ff', border: '1px solid #bae7ff' }}>
          <Row align="middle">
            <Col flex="auto">
              <Title level={4} style={{ marginBottom: '8px', color: '#1890ff' }}>
                欢迎回来，{user.name}！
              </Title>
              <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                继续您的医学学习之旅，探索AI问诊、病例训练等功能
              </Paragraph>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={() => navigate('/query')}>
                  继续问诊
                </Button>
                <Button onClick={() => navigate('/cases')}>
                  练习病例
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default HomePage; 