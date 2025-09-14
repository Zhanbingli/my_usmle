import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Tabs, 
  Typography, 
  Divider, 
  Space,
  Select,
  InputNumber,
  Alert
} from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  UserOutlined,
  GoogleOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserProfile } from '../contexts/AuthContext';
import './LoginPage.css';

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setIsLoading(true);
    try {
      const profile: Partial<UserProfile> = {
        displayName: values.displayName,
        role: values.role,
        specialty: values.specialty,
        institution: values.institution,
        graduationYear: values.graduationYear,
        subscriptionTier: 'basic'
      };
      
      await signup(values.email, values.password, profile);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoginForm = () => (
    <Form
      name="login"
      onFinish={handleLogin}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="请输入您的邮箱"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' }
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="请输入您的密码"
        />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link onClick={() => setActiveTab('reset')}>忘记密码？</Link>
        </div>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isLoading}
          block
          size="large"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  const SignupForm = () => (
    <Form
      name="signup"
      onFinish={handleSignup}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="displayName"
        label="显示名称"
        rules={[
          { required: true, message: '请输入显示名称' },
          { min: 2, message: '显示名称至少2个字符' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="请输入您的姓名"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="请输入您的邮箱"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' }
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="请输入密码"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认密码"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="请再次输入密码"
        />
      </Form.Item>

      <Form.Item
        name="role"
        label="身份"
        rules={[{ required: true, message: '请选择您的身份' }]}
      >
        <Select placeholder="请选择您的身份">
          <Option value="student">医学生</Option>
          <Option value="resident">住院医师</Option>
          <Option value="doctor">主治医师及以上</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="specialty"
        label="专业/科室"
      >
        <Select placeholder="请选择您的专业或科室（可选）">
          <Option value="internal">内科</Option>
          <Option value="surgery">外科</Option>
          <Option value="pediatrics">儿科</Option>
          <Option value="obstetrics">妇产科</Option>
          <Option value="cardiology">心血管内科</Option>
          <Option value="neurology">神经内科</Option>
          <Option value="emergency">急诊科</Option>
          <Option value="radiology">影像科</Option>
          <Option value="pathology">病理科</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="institution"
        label="所在院校/医院"
      >
        <Input placeholder="请输入您的院校或医院名称（可选）" />
      </Form.Item>

      <Form.Item
        name="graduationYear"
        label="毕业年份"
      >
        <InputNumber 
          placeholder="请输入毕业年份（可选）"
          min={1980}
          max={new Date().getFullYear() + 10}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isLoading}
          block
          size="large"
        >
          注册
        </Button>
      </Form.Item>
    </Form>
  );

  const ResetForm = () => (
    <div>
      {resetEmailSent ? (
        <Alert
          message="密码重置邮件已发送"
          description="请检查您的邮箱，按照邮件中的指引重置密码。"
          type="success"
          showIcon
          action={
            <Button size="small" type="text" onClick={() => {
              setResetEmailSent(false);
              setActiveTab('login');
            }}>
              返回登录
            </Button>
          }
        />
      ) : (
        <Form
          name="reset"
          onFinish={handlePasswordReset}
          layout="vertical"
          size="large"
        >
          <Alert
            message="重置密码"
            description="请输入您的邮箱地址，我们将发送密码重置链接到您的邮箱。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入您的邮箱"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                size="large"
              >
                发送重置邮件
              </Button>
              <Button 
                size="large"
                onClick={() => setActiveTab('login')}
              >
                返回登录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <MedicineBoxOutlined className="login-icon" />
            <Title level={2}>医学AI助手</Title>
            <Text type="secondary">
              智能医学学习平台，助力您的医学之路
            </Text>
          </div>

          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            centered
            size="large"
          >
            <TabPane tab="登录" key="login">
              <LoginForm />
            </TabPane>
            <TabPane tab="注册" key="signup">
              <SignupForm />
            </TabPane>
            <TabPane tab="重置密码" key="reset">
              <ResetForm />
            </TabPane>
          </Tabs>

          {activeTab !== 'reset' && (
            <>
              <Divider>或</Divider>
              <Button
                icon={<GoogleOutlined />}
                onClick={handleGoogleLogin}
                loading={isLoading}
                block
                size="large"
                style={{ marginBottom: 16 }}
              >
                使用 Google 账号{activeTab === 'login' ? '登录' : '注册'}
              </Button>
            </>
          )}

          <div className="login-footer">
            <Text type="secondary">
              {activeTab === 'login' ? '还没有账号？' : '已有账号？'}
              <Link 
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                style={{ marginLeft: 8 }}
              >
                {activeTab === 'login' ? '立即注册' : '立即登录'}
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 
