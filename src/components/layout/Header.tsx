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
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { UserRole } from '../../types';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUserStore();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/query',
      icon: <RobotOutlined />,
      label: 'AI问诊',
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
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
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
      onClick: () => {
        logout();
        navigate('/');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogin = () => {
    // 模拟登录 - 在实际应用中这里应该跳转到登录页面
    const mockUser = {
      id: '1',
      email: 'demo@example.com',
      name: '演示用户',
      role: UserRole.STUDENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    useUserStore.getState().setUser(mockUser);
  };

  return (
    <AntHeader style={{ 
      background: 'white', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo and Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
            医学AI平台
          </Text>
        </div>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ 
          border: 'none',
          background: 'transparent',
          flex: 1,
          justifyContent: 'center'
        }}
      />

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated && user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <Text>{user.name}</Text>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="default" onClick={handleLogin}>
              登录
            </Button>
            <Button type="primary">
              注册
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;

 