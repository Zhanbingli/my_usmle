import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { 
  GithubOutlined, 
  MailOutlined, 
  PhoneOutlined,
  MedicineBoxOutlined 
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ 
      background: '#001529', 
      color: 'white',
      padding: '40px 24px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '30px'
        }}>
          {/* Brand Section */}
          <div>
            <Space align="start" style={{ marginBottom: '16px' }}>
              <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Text strong style={{ color: 'white', fontSize: '18px' }}>
                医学AI平台
              </Text>
            </Space>
            <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: '1.6' }}>
              基于人工智能的医学教育和临床辅助平台，致力于为医学生和医生提供最优质的学习和诊断支持服务。
            </Text>
          </div>

          {/* Quick Links */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              快速链接
            </Text>
            <Space direction="vertical" size="small">
              <Link href="/query" style={{ color: 'rgba(255,255,255,0.7)' }}>AI智能问诊</Link>
              <Link href="/cases" style={{ color: 'rgba(255,255,255,0.7)' }}>病例训练</Link>
              <Link href="/pubmed" style={{ color: 'rgba(255,255,255,0.7)' }}>PubMed检索</Link>
              <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>关于我们</Link>
            </Space>
          </div>

          {/* Support */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              支持与帮助
            </Text>
            <Space direction="vertical" size="small">
              <Link href="/help" style={{ color: 'rgba(255,255,255,0.7)' }}>使用帮助</Link>
              <Link href="/faq" style={{ color: 'rgba(255,255,255,0.7)' }}>常见问题</Link>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)' }}>隐私政策</Link>
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)' }}>服务条款</Link>
            </Space>
          </div>

          {/* Contact */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              联系我们
            </Text>
            <Space direction="vertical" size="small">
              <Space>
                <MailOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  support@medical-ai.com
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  400-123-4567
                </Text>
              </Space>
              <Space>
                <GithubOutlined style={{ color: '#1890ff' }} />
                <Link 
                  href="https://github.com" 
                  target="_blank"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  GitHub
                </Link>
              </Space>
            </Space>
          </div>
        </div>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <div style={{ 
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {currentYear} 医学AI平台. All rights reserved. | 
            基于 React + TypeScript + Ant Design 构建
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 