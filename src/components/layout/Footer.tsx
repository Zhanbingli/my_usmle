import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { 
  GithubOutlined, 
  MailOutlined, 
  PhoneOutlined,
  MedicineBoxOutlined 
} from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

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
                {t('common.appName')}
              </Text>
            </Space>
            <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: '1.6' }}>
              {t('layout.footer.mission')}
            </Text>
          </div>

          {/* Quick Links */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              {t('layout.footerTitles.quickLinks')}
            </Text>
            <Space direction="vertical" size="small">
              <Link href="/query" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.quickLinks.agent')}</Link>
              <Link href="/cases" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.quickLinks.cases')}</Link>
              <Link href="/pubmed" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.quickLinks.pubmed')}</Link>
              <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.quickLinks.about')}</Link>
            </Space>
          </div>

          {/* Support */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              {t('layout.footerTitles.support')}
            </Text>
            <Space direction="vertical" size="small">
              <Link href="/help" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.supportLinks.help')}</Link>
              <Link href="/faq" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.supportLinks.faq')}</Link>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.supportLinks.privacy')}</Link>
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('layout.supportLinks.terms')}</Link>
            </Space>
          </div>

          {/* Contact */}
          <div>
            <Text strong style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              {t('layout.footerTitles.contact')}
            </Text>
            <Space direction="vertical" size="small">
              <Space>
                <MailOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('layout.footer.contact.email')}
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('layout.footer.contact.phone')}
                </Text>
              </Space>
              <Space>
                <GithubOutlined style={{ color: '#1890ff' }} />
                <Link 
                  href="https://github.com" 
                  target="_blank"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {t('layout.footer.contact.github')}
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
            {t('layout.footer.copyright', { year: currentYear })}
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 
