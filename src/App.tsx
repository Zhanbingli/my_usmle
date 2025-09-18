import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CasesPage = React.lazy(() => import('./pages/CasesPage'));
const CaseDetailPage = React.lazy(() => import('./pages/CaseDetailPage'));
const QueryPage = React.lazy(() => import('./pages/QueryPage'));
const PubMedSearchPage = React.lazy(() => import('./pages/PubMedSearchPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const AgentPage = React.lazy(() => import('./pages/AgentPage'));

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Ant Design 主题配置
const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
};

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip={t('common.loadingUser')} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 公开路由组件（已登录用户不能访问）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip={t('common.loadingUser')} />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 应用内容组件
const AppContent: React.FC = () => {
  const { loading } = useAuth();
  const { t, language } = useLanguage();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" />
        <div style={{ color: '#666' }}>{t('common.loadingUser')}</div>
      </div>
    );
  }

  const locale = language === 'zh' ? zhCN : enUS;

  return (
    <ConfigProvider locale={locale} theme={antdTheme}>
      <div className="app">
        <Header />
        <main className="app__main">
          <div className="app__content">
            <Suspense fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <Spin size="large" />
              </div>
            }>
            <Routes>
            {/* 公开路由 */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            
            {/* 受保护的路由 */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cases" 
              element={
                <ProtectedRoute>
                  <CasesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cases/:id" 
              element={
                <ProtectedRoute>
                  <CaseDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/query" 
              element={
                <ProtectedRoute>
                  <QueryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent" 
              element={
                <ProtectedRoute>
                  <AgentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pubmed" 
              element={
                <ProtectedRoute>
                  <PubMedSearchPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pubmed/articles/:pmid" 
              element={
                <ProtectedRoute>
                  <ArticleDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 重定向到首页 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

const AppProviders: React.FC = () => {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
};

export default AppProviders; 
