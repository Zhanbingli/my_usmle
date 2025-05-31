import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import QueryPage from './pages/QueryPage';
import PubMedSearchPage from './pages/PubMedSearchPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ErrorBoundary from './components/ErrorBoundary';

import './App.css';

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
    colorPrimary: '#2196f3',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
  },
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN} theme={antdTheme}>
          <div className="app">
            <Header />
            <main className="main-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cases" element={<CasesPage />} />
                  <Route path="/cases/:id" element={<CaseDetailPage />} />
                  <Route path="/query" element={<QueryPage />} />
                  <Route path="/pubmed" element={<PubMedSearchPage />} />
                  <Route path="/pubmed/articles/:pmid" element={<ArticleDetailPage />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App; 