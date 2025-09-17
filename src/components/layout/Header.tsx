import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { 
  HomeOutlined, 
  RobotOutlined, 
  BookOutlined, 
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MedicineBoxOutlined,
  CrownOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, isLoggedIn, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/agent',
      icon: <RobotOutlined />,
      label: '智能Agent',
    },
    {
      key: '/cases',
      icon: <BookOutlined />,
      label: '病例训练',
    },
    {
      key: '/pubmed',
      icon: <SearchOutlined />,
      label: 'PubMed检索',
    },
    // 只有管理员才能看到数据分析
    ...(userProfile?.role === 'admin' ? [{
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    }] : [])
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'subscription':
        // 跳转到个人资料页面的订阅管理标签页
        navigate('/profile', { state: { activeTab: 'subscription' } });
        break;
      case 'settings':
        // 可以跳转到设置页面或打开设置模态框
        navigate('/profile');
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'subscription',
      icon: <CrownOutlined />,
      label: '订阅管理',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login'); // 登录页面包含注册功能
  };

  return (
    <AntHeader className="app-header glass-surface">
      <div className="app-header__inner">
        <div className="app-header__brand" onClick={() => navigate('/')}>
          <MedicineBoxOutlined className="app-header__brand-icon" />
          <Text className="app-header__brand-name">医学AI平台</Text>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="app-header__menu"
        />

        <div className="app-header__actions">
          {isLoggedIn && currentUser && userProfile ? (
            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space className="app-header__user">
                <Avatar 
                  icon={<UserOutlined />} 
                  src={currentUser.photoURL}
                  style={{ backgroundColor: 'var(--app-color-primary)' }}
                />
                <Text>{userProfile.displayName}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Space size={12}>
              <Button type="default" onClick={handleLogin}>
                登录
              </Button>
              <Button type="primary" onClick={handleRegister}>
                注册
              </Button>
            </Space>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;

 
