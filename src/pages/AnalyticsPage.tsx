import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  Typography, 
  Progress, 
  Table, 
  Tag, 
  Space, 
  Button,
  Spin,
  Tabs,
  List,
  Avatar
} from 'antd';
import { 
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  MessageOutlined,
  EyeOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  DownloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface AnalyticsData {
  userGrowth: Array<{ month: string; users: number; paid: number }>;
  revenueData: Array<{ month: string; revenue: number; mrr: number }>;
  userEngagement: Array<{ metric: string; value: number; change: number; unit: string }>;
  subscriptionTiers: Array<{ name: string; value: number; percentage: number }>;
  aiUsage: Array<{ date: string; queries: number; accuracy: number }>;
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, isLoggedIn, loading: authLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查权限 - 只有管理员可以查看数据分析
    if (!authLoading && (!isLoggedIn || userProfile?.role !== 'admin')) {
      navigate('/');
      return;
    }

    // 模拟数据
    const mockData: AnalyticsData = {
      userGrowth: [
        { month: '2024-01', users: 150, paid: 15 },
        { month: '2024-02', users: 280, paid: 42 },
        { month: '2024-03', users: 420, paid: 89 },
        { month: '2024-04', users: 650, paid: 156 },
        { month: '2024-05', users: 890, paid: 234 },
        { month: '2024-06', users: 1200, paid: 348 }
      ],
      revenueData: [
        { month: '2024-01', revenue: 2980, mrr: 2980 },
        { month: '2024-02', revenue: 8360, mrr: 8360 },
        { month: '2024-03', revenue: 17780, mrr: 17780 },
        { month: '2024-04', revenue: 31120, mrr: 31120 },
        { month: '2024-05', revenue: 46660, mrr: 46660 },
        { month: '2024-06', revenue: 69440, mrr: 69440 }
      ],
      userEngagement: [
        { metric: '日活跃用户', value: 342, change: 15.2, unit: '' },
        { metric: '月留存率', value: 78.5, change: 5.3, unit: '%' },
        { metric: '平均会话时长', value: 12.4, change: -2.1, unit: '分钟' },
        { metric: 'AI咨询次数', value: 1547, change: 23.8, unit: '' }
      ],
      subscriptionTiers: [
        { name: '免费版', value: 852, percentage: 71.0 },
        { name: '基础版', value: 234, percentage: 19.5 },
        { name: '专业版', value: 98, percentage: 8.2 },
        { name: '企业版', value: 16, percentage: 1.3 }
      ],
      aiUsage: [
        { date: '2024-06-01', queries: 234, accuracy: 89.2 },
        { date: '2024-06-02', queries: 267, accuracy: 91.1 },
        { date: '2024-06-03', queries: 298, accuracy: 88.7 },
        { date: '2024-06-04', queries: 312, accuracy: 92.3 },
        { date: '2024-06-05', queries: 345, accuracy: 90.8 },
        { date: '2024-06-06', queries: 378, accuracy: 93.1 },
        { date: '2024-06-07', queries: 398, accuracy: 91.5 }
      ]
    };

    // 模拟API调用
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [authLoading, isLoggedIn, userProfile, navigate]);

  if (authLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!analyticsData) return null;

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    format = 'number',
    suffix = ''
  }: {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    format?: 'number' | 'currency' | 'percentage';
    suffix?: string;
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return val.toLocaleString();
        case 'percentage':
          return val;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <Card>
        <Statistic
          title={title}
          value={formatValue(value)}
          prefix={icon}
          suffix={format === 'currency' ? '元' : suffix}
          valueStyle={{ color: '#1890ff' }}
        />
        <div style={{ marginTop: '8px' }}>
          <Text 
            type={change >= 0 ? 'success' : 'danger'}
            style={{ fontSize: '14px' }}
          >
            {change >= 0 ? '+' : ''}{change}% 
            <Text type="secondary" style={{ marginLeft: '4px' }}>
              vs 上月
            </Text>
          </Text>
        </div>
      </Card>
    );
  };

  const userGrowthColumns = [
    { title: '月份', dataIndex: 'month', key: 'month' },
    { title: '总用户数', dataIndex: 'users', key: 'users', render: (val: number) => val.toLocaleString() },
    { title: '付费用户数', dataIndex: 'paid', key: 'paid', render: (val: number) => val.toLocaleString() },
    { 
      title: '付费转化率', 
      key: 'conversion', 
      render: (_: any, record: any) => `${((record.paid / record.users) * 100).toFixed(1)}%`
    }
  ];

  const revenueColumns = [
    { title: '月份', dataIndex: 'month', key: 'month' },
    { title: '月收入', dataIndex: 'revenue', key: 'revenue', render: (val: number) => `¥${val.toLocaleString()}` },
    { title: 'MRR', dataIndex: 'mrr', key: 'mrr', render: (val: number) => `¥${val.toLocaleString()}` }
  ];

  const aiUsageColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '咨询次数', dataIndex: 'queries', key: 'queries', render: (val: number) => val.toLocaleString() },
    { title: '准确率', dataIndex: 'accuracy', key: 'accuracy', render: (val: number) => `${val}%` }
  ];

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      {/* 页面标题和时间范围选择 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            <BarChartOutlined style={{ marginRight: '8px' }} />
            数据分析仪表板
          </Title>
        </Col>
        <Col>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="7d">最近7天</Option>
            <Option value="30d">最近30天</Option>
            <Option value="90d">最近90天</Option>
            <Option value="1y">最近1年</Option>
          </Select>
        </Col>
      </Row>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="总用户数"
            value={analyticsData.userGrowth[analyticsData.userGrowth.length - 1].users}
            change={15.2}
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="月收入 (MRR)"
            value={analyticsData.revenueData[analyticsData.revenueData.length - 1].mrr}
            change={23.8}
            icon={<DollarOutlined />}
            format="currency"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="付费转化率"
            value={29.0}
            change={3.2}
            icon={<RiseOutlined />}
            suffix="%"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="今日AI咨询"
            value={1547}
            change={12.4}
            icon={<MessageOutlined />}
          />
        </Col>
      </Row>

      {/* 详细数据标签页 */}
      <Tabs defaultActiveKey="overview">
        <TabPane tab="概览" key="overview" icon={<EyeOutlined />}>
          <Row gutter={[16, 16]}>
            {/* 用户参与度指标 */}
            <Col xs={24} lg={12}>
              <Card title="用户参与度指标" extra={<ClockCircleOutlined />}>
                <List
                  dataSource={analyticsData.userEngagement}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.metric}
                        description={
                          <Space>
                            <Text strong style={{ fontSize: '18px' }}>
                              {item.value.toLocaleString()}{item.unit}
                            </Text>
                            <Tag color={item.change >= 0 ? 'green' : 'red'}>
                              {item.change >= 0 ? '+' : ''}{item.change}%
                            </Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* 订阅分布 */}
            <Col xs={24} lg={12}>
              <Card title="订阅分布" extra={<CrownOutlined />}>
                <List
                  dataSource={analyticsData.subscriptionTiers}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.name[0]}</Avatar>}
                        title={item.name}
                        description={
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>{item.value} 用户 ({item.percentage}%)</Text>
                            <Progress percent={item.percentage} size="small" />
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* 实时指标 */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} sm={8}>
              <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>在线用户</span>}
                  value={89}
                  prefix={<EyeOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>今日注册</span>}
                  value={23}
                  prefix={<TeamOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>客户满意度</span>}
                  value={4.8}
                  suffix="/5"
                  prefix={<CrownOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white' }}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="用户增长" key="users" icon={<TeamOutlined />}>
          <Card title="用户增长趋势" extra={<LineChartOutlined />}>
            <Table
              dataSource={analyticsData.userGrowth}
              columns={userGrowthColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="收入分析" key="revenue" icon={<DollarOutlined />}>
          <Card title="收入趋势" extra={<BarChartOutlined />}>
            <Table
              dataSource={analyticsData.revenueData}
              columns={revenueColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="AI使用分析" key="ai" icon={<MessageOutlined />}>
          <Card title="AI咨询使用情况" extra={<PieChartOutlined />}>
            <Table
              dataSource={analyticsData.aiUsage}
              columns={aiUsageColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="数据导出" key="export" icon={<DownloadOutlined />}>
          <Card title="数据导出" extra={<DownloadOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">选择要导出的数据类型：</Text>
              <Space wrap>
                <Button type="primary" icon={<DownloadOutlined />}>
                  导出用户数据
                </Button>
                <Button type="primary" icon={<DownloadOutlined />}>
                  生成收入报告
                </Button>
                <Button type="primary" icon={<DownloadOutlined />}>
                  AI使用分析
                </Button>
                <Button type="primary" icon={<DownloadOutlined />}>
                  完整报表
                </Button>
              </Space>
              <Text type="secondary" style={{ marginTop: '16px' }}>
                注意：数据导出功能需要管理员权限，导出的文件将包含敏感信息，请妥善保管。
              </Text>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage; 