import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Statistic, Tag } from 'antd';
import {
  RobotOutlined,
  BookOutlined,
  SearchOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

const features = [
  {
    icon: <RobotOutlined />,
    title: 'AI 智能问诊',
    description: '多模型协同推理，提供循证医学建议与问诊摘要。',
    path: '/query',
    accent: 'primary'
  },
  {
    icon: <BookOutlined />,
    title: '病例训练营',
    description: '按器官系统分层的病例演练，并附详尽解析与高频考点。',
    path: '/cases',
    accent: 'success'
  },
  {
    icon: <SearchOutlined />,
    title: 'PubMed 检索',
    description: '智能检索最新文献，自动总结研究结论与指南共识。',
    path: '/pubmed',
    accent: 'warning'
  },
  {
    icon: <TrophyOutlined />,
    title: 'USMLE 备考',
    description: 'Step1/2/3 模拟题库与考点概览，支持个性化错题复盘。',
    path: '/exam',
    accent: 'danger'
  }
];

const stats = [
  { title: '注册学员', value: 1234, suffix: '人', icon: <UserOutlined /> },
  { title: '病例库', value: 567, suffix: '个', icon: <MedicineBoxOutlined /> },
  { title: '智能会话', value: 8901, suffix: '次', icon: <RobotOutlined /> },
  { title: '学习时长', value: 2345, suffix: '小时', icon: <ClockCircleOutlined /> }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, isLoggedIn } = useAuth();

  return (
    <div className="home-page">
      <PageContainer variant="gradient" padded className="home-hero">
        <div className="home-hero__content">
          <Tag color="gold" bordered={false} icon={<SafetyCertificateOutlined />}>
            面向医学学习与临床决策的 AI 联合实验
          </Tag>
          <Title level={1}>
            智能医学 AI 平台
          </Title>
          <Paragraph>
            将问诊对话、病例演练与循证文献检索整合在一个平台中，帮助临床医师与医学生快速验证诊断思路、制定治疗方案和准备 USMLE 考试。
          </Paragraph>
          <Space size={16} wrap>
            <Button type="primary" size="large" icon={<RobotOutlined />} onClick={() => navigate('/query')}>
              立即体验问诊 Agent
            </Button>
            <Button size="large" icon={<BookOutlined />} onClick={() => navigate('/cases')}>
              浏览病例训练
            </Button>
          </Space>
          <div className="home-hero__badges">
            <Tag icon={<ThunderboltOutlined />} color="purple">
              多模型推理
            </Tag>
            <Tag icon={<DeploymentUnitOutlined />} color="processing">
              工具链可视化
            </Tag>
            <Tag icon={<SearchOutlined />} color="geekblue">
              PubMed 实时检索
            </Tag>
          </div>
        </div>
      </PageContainer>

      <PageContainer variant="glass" padded>
        <Row gutter={[24, 24]} className="home-stats">
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <Card className="home-stats__card" bordered={false}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </PageContainer>

      <PageContainer variant="surface" padded>
        <div className="home-section-header">
          <div>
            <Title level={2}>核心功能矩阵</Title>
            <Text type="secondary">覆盖问诊、病例、检索与考试的完整学习闭环</Text>
          </div>
        </div>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                bordered={false}
                className={`home-feature home-feature--${feature.accent}`}
                onClick={() => navigate(feature.path)}
              >
                <div className="home-feature__icon">{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
                <Button type="link" icon={<ArrowRightOutlined />}>
                  了解更多
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </PageContainer>

      {isLoggedIn && currentUser && userProfile && (
        <PageContainer variant="glass" padded className="home-welcome">
          <Row align="middle" gutter={[16, 16]}>
            <Col flex="auto">
              <Title level={4} style={{ marginBottom: 8 }}>
                欢迎回来，{userProfile.displayName}！
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                继续你的个性化学习路径，智能 Agent 会记住你的进度与偏好。
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
        </PageContainer>
      )}
    </div>
  );
};

export default HomePage;
