import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Form, 
  Input, 
  Select, 
  Upload, 
  message, 
  Tabs, 
  Statistic, 
  Progress,
  List,
  Tag,
  Space,
  Divider,
  Spin,
  Table,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  UploadOutlined,
  TrophyOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  CrownOutlined,
  StarOutlined,
  GiftOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ProfileFormData {
  displayName: string;
  email: string;
  role: 'student' | 'resident' | 'doctor' | 'admin';
  specialty?: string;
  institution?: string;
  graduationYear?: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, updateUserProfile, isLoggedIn, loading: authLoading } = useAuth();
  const [form] = Form.useForm<ProfileFormData>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 新增：活动标签页状态
  const [activeTab, setActiveTab] = useState('stats');
  
  // 模拟数据
  const [learningStats] = useState({
    totalCases: 45,
    completedCases: 32,
    correctRate: 78,
    totalStudyTime: 120, // 小时
    streak: 7, // 连续学习天数
    rank: 156,
    totalUsers: 5000
  });

  // 模拟最近活动
  const recentActivities = [
    {
      id: '1',
      type: 'case',
      title: '急性心肌梗死病例',
      result: 'correct',
      time: '2小时前',
      score: 95
    },
    {
      id: '2',
      type: 'query',
      title: 'AI问诊：胸痛患者',
      result: 'completed',
      time: '1天前',
      score: 88
    },
    {
      id: '3',
      type: 'case',
      title: '糖尿病并发症病例',
      result: 'incorrect',
      time: '2天前',
      score: 65
    }
  ];

  const handleSaveProfile = async (values: ProfileFormData) => {
    if (!currentUser || !userProfile) return;

    try {
      setLoading(true);
      await updateUserProfile(values);
      setIsEditing(false);
    } catch (error) {
      console.error('更新个人信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功！');
      // 这里应该更新用户头像URL
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'case': return <BookOutlined />;
      case 'query': return <UserOutlined />;
      default: return <CheckCircleOutlined />;
    }
  };

  const getActivityColor = (result: string) => {
    switch (result) {
      case 'correct': return 'green';
      case 'incorrect': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return '学生';
      case 'resident': return '住院医师';
      case 'doctor': return '医生';
      case 'admin': return '管理员';
      default: return '用户';
    }
  };

  const getSubscriptionText = (tier: string) => {
    switch (tier) {
      case 'basic': return '基础版';
      case 'professional': return '专业版';
      case 'expert': return '专家版';
      case 'enterprise': return '企业版';
      default: return '未知';
    }
  };

  // 订阅管理相关数据
  const subscriptionPlans = [
    {
      key: 'basic',
      name: '基础版',
      price: '免费',
      icon: <UserOutlined />,
      color: '#52c41a',
      features: [
        { name: 'AI问诊次数', value: '每日10次', included: true },
        { name: '病例训练', value: '基础病例', included: true },
        { name: 'PubMed检索', value: '基础功能', included: true },
        { name: '学习统计', value: '基础报告', included: true },
        { name: '专家咨询', value: '不支持', included: false },
        { name: '高级病例', value: '不支持', included: false },
        { name: '个性化推荐', value: '不支持', included: false }
      ]
    },
    {
      key: 'professional',
      name: '专业版',
      price: '¥99/月',
      icon: <StarOutlined />,
      color: '#1890ff',
      features: [
        { name: 'AI问诊次数', value: '每日100次', included: true },
        { name: '病例训练', value: '全部病例', included: true },
        { name: 'PubMed检索', value: '高级功能', included: true },
        { name: '学习统计', value: '详细报告', included: true },
        { name: '专家咨询', value: '每月5次', included: true },
        { name: '高级病例', value: '支持', included: true },
        { name: '个性化推荐', value: '基础推荐', included: true }
      ]
    },
    {
      key: 'expert',
      name: '专家版',
      price: '¥199/月',
      icon: <CrownOutlined />,
      color: '#faad14',
      features: [
        { name: 'AI问诊次数', value: '无限制', included: true },
        { name: '病例训练', value: '全部+独家', included: true },
        { name: 'PubMed检索', value: '专业功能', included: true },
        { name: '学习统计', value: '专业分析', included: true },
        { name: '专家咨询', value: '无限制', included: true },
        { name: '高级病例', value: '全部权限', included: true },
        { name: '个性化推荐', value: 'AI智能推荐', included: true }
      ]
    },
    {
      key: 'enterprise',
      name: '企业版',
      price: '联系客服',
      icon: <GiftOutlined />,
      color: '#722ed1',
      features: [
        { name: 'AI问诊次数', value: '无限制', included: true },
        { name: '病例训练', value: '定制内容', included: true },
        { name: 'PubMed检索', value: '企业功能', included: true },
        { name: '学习统计', value: '团队管理', included: true },
        { name: '专家咨询', value: '专属顾问', included: true },
        { name: '高级病例', value: '定制开发', included: true },
        { name: '个性化推荐', value: '企业级AI', included: true }
      ]
    }
  ];

  const handleUpgradeSubscription = (planKey: string) => {
    if (planKey === 'basic') {
      message.info('您当前已是基础版用户');
      return;
    }
    
    message.success(`升级到${subscriptionPlans.find(p => p.key === planKey)?.name}的功能正在开发中！`);
  };

  // 检查登录状态
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [authLoading, isLoggedIn, navigate]);

  // 初始化表单数据
  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        displayName: userProfile.displayName,
        email: userProfile.email,
        role: userProfile.role,
        specialty: userProfile.specialty,
        institution: userProfile.institution,
        graduationYear: userProfile.graduationYear,
      });
    }
  }, [userProfile, form]);

  // 处理从Header传递的状态
  useEffect(() => {
    const state = location.state as { activeTab?: string };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // 清除状态，避免刷新页面时重复跳转
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 加载状态
  if (authLoading) {
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

  if (!currentUser || !userProfile) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>请先登录</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      <Row gutter={[24, 24]}>
        {/* 左侧：个人信息 */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />}
                src={currentUser.photoURL}
                style={{ marginBottom: '16px', backgroundColor: '#667eea' }}
              />
              <div>
                <Title level={3} style={{ marginBottom: '4px' }}>
                  {userProfile.displayName}
                </Title>
                <Text type="secondary">{userProfile.email}</Text>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue">
                  {getRoleText(userProfile.role)}
                </Tag>
                <Tag color="purple">
                  {getSubscriptionText(userProfile.subscriptionTier)}
                </Tag>
              </div>
              {userProfile.institution && (
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">{userProfile.institution}</Text>
                </div>
              )}
              {userProfile.specialty && (
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary">专业：{userProfile.specialty}</Text>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  block
                  onClick={() => setIsEditing(true)}
                >
                  编辑个人信息
                </Button>
                
                <div style={{ marginTop: '16px' }}>
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    action="/api/upload/avatar"
                    onChange={handleAvatarUpload}
                  >
                    <Button icon={<UploadOutlined />} block>
                      更换头像
                    </Button>
                  </Upload>
                </div>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveProfile}
              >
                <Form.Item
                  name="displayName"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="角色"
                  rules={[{ required: true, message: '请选择角色' }]}
                >
                  <Select>
                    <Option value="student">学生</Option>
                    <Option value="resident">住院医师</Option>
                    <Option value="doctor">医生</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="specialty"
                  label="专业"
                >
                  <Input placeholder="如：内科、外科、儿科等" />
                </Form.Item>

                <Form.Item
                  name="institution"
                  label="机构"
                >
                  <Input placeholder="学校或医院名称" />
                </Form.Item>

                <Form.Item
                  name="graduationYear"
                  label="毕业年份"
                >
                  <Input type="number" placeholder="如：2024" />
                </Form.Item>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    style={{ flex: 1 }}
                  >
                    保存
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(false)}
                    style={{ flex: 1 }}
                  >
                    取消
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        </Col>

        {/* 右侧：学习数据和活动 */}
        <Col xs={24} lg={16}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="学习统计" key="stats" icon={<TrophyOutlined />}>
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="总病例数"
                      value={learningStats.totalCases}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#667eea' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="已完成"
                      value={learningStats.completedCases}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="正确率"
                      value={learningStats.correctRate}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="学习时长"
                      value={learningStats.totalStudyTime}
                      suffix="小时"
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: '#13c2c2' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card title="学习进度">
                    <div style={{ marginBottom: '16px' }}>
                      <Text>病例完成度</Text>
                      <Progress 
                        percent={Math.round((learningStats.completedCases / learningStats.totalCases) * 100)} 
                        status="active"
                      />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text>正确率</Text>
                      <Progress 
                        percent={learningStats.correctRate} 
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card title="排名信息">
                    <Statistic
                      title="当前排名"
                      value={learningStats.rank}
                      suffix={`/ ${learningStats.totalUsers}`}
                      valueStyle={{ color: '#f5222d' }}
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>连续学习：{learningStats.streak} 天</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="最近活动" key="activities" icon={<ClockCircleOutlined />}>
              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={getActivityIcon(item.type)}
                          style={{ backgroundColor: '#667eea' }}
                        />
                      }
                      title={
                        <Space>
                          {item.title}
                          <Tag color={getActivityColor(item.result)}>
                            {item.result === 'correct' ? '正确' : 
                             item.result === 'incorrect' ? '错误' : '已完成'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary">{item.time}</Text>
                          <Text>得分：{item.score}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="设置" key="settings" icon={<SettingOutlined />}>
              <Card title="账户设置">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>账户状态</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="green">正常</Tag>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Text strong>创建时间</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">
                        {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || '未知'}
                      </Text>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Text strong>最后登录</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">
                        {userProfile.lastLoginAt?.toDate?.()?.toLocaleDateString() || '未知'}
                      </Text>
                    </div>
                  </div>

                  <Divider />
                  
                  <div>
                    <Text strong>开发者测试功能</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Button 
                        type="primary" 
                        danger={userProfile.role === 'admin'}
                        onClick={async () => {
                          try {
                            const newRole = userProfile.role === 'admin' ? 'student' : 'admin';
                            await updateUserProfile({ 
                              ...userProfile,
                              role: newRole 
                            });
                            message.success(`角色已切换为${newRole === 'admin' ? '管理员' : '学生'}`);
                            // 刷新页面以更新导航菜单
                            window.location.reload();
                          } catch (error) {
                            message.error('角色切换失败');
                          }
                        }}
                      >
                        {userProfile.role === 'admin' ? '切换为普通用户' : '临时切换为管理员'}
                      </Button>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          临时测试功能，用于查看数据分析仪表板
                        </Text>
                      </div>
                    </div>
                  </div>
                </Space>
              </Card>
            </TabPane>

            <TabPane tab="订阅管理" key="subscription" icon={<CrownOutlined />}>
              {/* 当前订阅状态 */}
              <Card title="当前订阅" style={{ marginBottom: '24px' }}>
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar 
                      size={48}
                      icon={subscriptionPlans.find(p => p.key === userProfile.subscriptionTier)?.icon}
                      style={{ 
                        backgroundColor: subscriptionPlans.find(p => p.key === userProfile.subscriptionTier)?.color 
                      }}
                    />
                  </Col>
                  <Col flex={1}>
                    <div>
                      <Text strong style={{ fontSize: '18px' }}>
                        {getSubscriptionText(userProfile.subscriptionTier)}
                      </Text>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">
                          {subscriptionPlans.find(p => p.key === userProfile.subscriptionTier)?.price}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <Badge status="success" text="已激活" />
                  </Col>
                </Row>
              </Card>

              {/* 订阅计划对比 */}
              <Card title="订阅计划对比">
                <Table
                  dataSource={subscriptionPlans}
                  pagination={false}
                  scroll={{ x: 800 }}
                  size="middle"
                >
                  <Table.Column
                    title="套餐"
                    dataIndex="name"
                    key="name"
                    width={120}
                    render={(text, record: any) => (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <Avatar
                            icon={record.icon}
                            style={{ backgroundColor: record.color }}
                          />
                        </div>
                        <Text strong>{text}</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.price}
                          </Text>
                        </div>
                      </div>
                    )}
                  />
                  
                  {subscriptionPlans[0].features.map((feature, index) => (
                    <Table.Column
                      key={feature.name}
                      title={feature.name}
                      dataIndex="features"
                      width={130}
                      render={(features) => {
                        const currentFeature = features[index];
                        return (
                          <div style={{ textAlign: 'center' }}>
                            {currentFeature.included ? (
                              <div>
                                <CheckOutlined style={{ color: '#52c41a', marginBottom: '4px' }} />
                                <div style={{ fontSize: '12px' }}>
                                  {currentFeature.value}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <CloseOutlined style={{ color: '#f5222d', marginBottom: '4px' }} />
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                  {currentFeature.value}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                  ))}
                  
                  <Table.Column
                    title="操作"
                    key="action"
                    width={120}
                    render={(_, record: any) => (
                      <div style={{ textAlign: 'center' }}>
                        {record.key === userProfile.subscriptionTier ? (
                          <Tag color="green">当前套餐</Tag>
                        ) : (
                          <Button
                            type={record.key === 'basic' ? 'default' : 'primary'}
                            size="small"
                            onClick={() => handleUpgradeSubscription(record.key)}
                            disabled={record.key === 'basic' && userProfile.subscriptionTier !== 'basic'}
                          >
                            {record.key === 'basic' ? '免费使用' : '立即升级'}
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </Table>
              </Card>

              {/* 订阅说明 */}
              <Card title="订阅说明" style={{ marginTop: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>• 升级权益</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Text type="secondary">升级后立即享受所有功能，无需等待</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text strong>• 付费方式</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Text type="secondary">支持微信支付、支付宝、银行卡等多种支付方式</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text strong>• 退订政策</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Text type="secondary">可随时取消自动续费，当前订阅期内功能继续有效</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text strong>• 客服支持</Text>
                    <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                      <Text type="secondary">专业版及以上用户享受优先技术支持</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;