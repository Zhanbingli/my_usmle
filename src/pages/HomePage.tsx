import React, { useMemo } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, isLoggedIn } = useAuth();
  const { t, language } = useLanguage();

  const features = useMemo(() => ([
    {
      icon: <RobotOutlined />,
      title: t('home.featureCards.agent.title'),
      description: t('home.featureCards.agent.description'),
      path: '/query',
      accent: 'primary'
    },
    {
      icon: <BookOutlined />,
      title: t('home.featureCards.cases.title'),
      description: t('home.featureCards.cases.description'),
      path: '/cases',
      accent: 'success'
    },
    {
      icon: <SearchOutlined />,
      title: t('home.featureCards.pubmed.title'),
      description: t('home.featureCards.pubmed.description'),
      path: '/pubmed',
      accent: 'warning'
    },
    {
      icon: <TrophyOutlined />,
      title: t('home.featureCards.usmle.title'),
      description: t('home.featureCards.usmle.description'),
      path: '/exam',
      accent: 'danger'
    }
  ]), [t]);

  const stats = useMemo(() => ([
    { title: t('home.stats.users'), value: 1234, suffix: language === 'zh' ? '人' : '', icon: <UserOutlined /> },
    { title: t('home.stats.cases'), value: 567, suffix: language === 'zh' ? '个' : '', icon: <MedicineBoxOutlined /> },
    { title: t('home.stats.sessions'), value: 8901, suffix: language === 'zh' ? '次' : '', icon: <RobotOutlined /> },
    { title: t('home.stats.hours'), value: 2345, suffix: language === 'zh' ? '小时' : 'h', icon: <ClockCircleOutlined /> }
  ]), [language, t]);

  return (
    <div className="home-page">
      <PageContainer variant="gradient" padded className="home-hero">
        <div className="home-hero__content">
          <Tag color="gold" bordered={false} icon={<SafetyCertificateOutlined />}>
            {t('home.heroBadge')}
          </Tag>
          <Title level={1}>
            {t('home.heroTitle')}
          </Title>
          <Paragraph>
            {t('home.heroDescription')}
          </Paragraph>
          <Space size={16} wrap>
            <Button type="primary" size="large" icon={<RobotOutlined />} onClick={() => navigate('/query')}>
              {t('home.ctaAgent')}
            </Button>
            <Button size="large" icon={<BookOutlined />} onClick={() => navigate('/cases')}>
              {t('home.ctaCases')}
            </Button>
          </Space>
          <div className="home-hero__badges">
            <Tag icon={<ThunderboltOutlined />} color="purple">
              {t('home.badgeMultimodal')}
            </Tag>
            <Tag icon={<DeploymentUnitOutlined />} color="processing">
              {t('home.badgeTracing')}
            </Tag>
            <Tag icon={<SearchOutlined />} color="geekblue">
              {t('home.badgePubmed')}
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
            <Title level={2}>{t('home.featureSectionTitle')}</Title>
            <Text type="secondary">{t('home.featureSectionSubtitle')}</Text>
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
                  {t('common.learnMore')}
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
                {t('home.welcomeBack', { name: userProfile.displayName })}
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {t('home.welcomeSubtitle')}
              </Paragraph>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={() => navigate('/query')}>
                  {t('home.continueAgent')}
                </Button>
                <Button onClick={() => navigate('/cases')}>
                  {t('home.continueCases')}
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
