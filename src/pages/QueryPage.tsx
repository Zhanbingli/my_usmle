import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Space, 
  Spin, 
  Alert,
  Empty,
  Divider 
} from 'antd';
import { 
  RobotOutlined, 
  UserOutlined, 
  SendOutlined, 
  PlusOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQueryStore } from '../stores/useQueryStore';
import { useSendMessage, useUserSessions } from '../hooks/useGeminiQuery';
import { MessageRole } from '../types';
import './QueryPage.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const QueryPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const { currentUser, userProfile, isLoggedIn } = useAuth();
  const { 
    currentSession, 
    sessions, 
    setCurrentSession, 
    createSession 
  } = useQueryStore();

  const sendMessageMutation = useSendMessage();
  const { data: userSessions, isLoading: sessionsLoading } = useUserSessions(
    currentUser?.uid || ''
  );

  // 更新本地sessions状态
  useEffect(() => {
    if (userSessions) {
      useQueryStore.getState().setSessions(userSessions);
    }
  }, [userSessions]);

  // 检查用户登录状态，如果未登录则跳转到登录页
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // 确保用户已登录
    if (!currentUser || !userProfile) {
      navigate('/login');
      return;
    }

    let sessionId = currentSession?.id;

    // 如果没有当前会话，创建新会话
    if (!sessionId) {
      sessionId = createSession(
        inputMessage.length > 30 
          ? inputMessage.substring(0, 30) + '...' 
          : inputMessage,
        currentUser.uid
      );
    }

    try {
      await sendMessageMutation.mutateAsync({
        message: inputMessage,
        sessionId,
      });
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewSession = () => {
    setCurrentSession(null);
    setInputMessage('');
  };

  const formatMessage = (content: string) => {
    // 处理长文本和确保换行
    const processedContent = content
      // 处理长URL，添加换行机会
      .replace(/(https?:\/\/[^\s]{50,})/g, (url) => {
        // 每50个字符添加一个零宽度断行机会
        return url.replace(/(.{50})/g, '$1\u200B');
      })
      // 处理长单词，超过30个字符的单词添加断行机会
      .replace(/([^\s]{30,})/g, (word) => {
        return word.replace(/(.{20})/g, '$1\u200B');
      });

    // 简单的markdown样式处理
    return processedContent
      .split('\n')
      .map((line, index) => (
        <div key={index} style={{ 
          wordBreak: 'break-word', 
          overflowWrap: 'anywhere',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {line}
          {index < processedContent.split('\n').length - 1 && <br />}
        </div>
      ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // 如果用户未登录，显示加载状态（实际上会被重定向）
  if (!isLoggedIn || !currentUser || !userProfile) {
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

  return (
    <div className="query-page">
      <div className="query-container">
        {/* 左侧会话列表 */}
        <div className="sessions-sidebar">
          <div className="sessions-header">
            <Title level={4}>
              <MessageOutlined /> 对话历史
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleNewSession}
              size="small"
            >
              新对话
            </Button>
          </div>
          
          <div className="sessions-list">
            {sessionsLoading ? (
              <Spin size="small" />
            ) : sessions.length > 0 ? (
              <List
                size="small"
                dataSource={sessions}
                renderItem={(session) => (
                  <List.Item
                    className={`session-item ${
                      currentSession?.id === session.id ? 'active' : ''
                    }`}
                    onClick={() => setCurrentSession(session)}
                  >
                    <List.Item.Meta
                      title={
                        <Text ellipsis={{ tooltip: session.title }}>
                          {session.title}
                        </Text>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(session.createdAt).toLocaleDateString()}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无对话记录"
                style={{ marginTop: '20px' }}
              />
            )}
          </div>
        </div>

        {/* 右侧对话区域 */}
        <div className="chat-area">
          <Card className="chat-card">
            <div className="chat-header">
              <Title level={3}>
                <RobotOutlined /> AI医学助手
              </Title>
              <Text type="secondary">
                欢迎您，{userProfile.displayName}！我可以帮助您解答医学问题、分析症状、提供诊断建议
              </Text>
            </div>

            <Divider />

            {/* 消息列表 */}
            <div className="messages-container">
              {!currentSession ? (
                <div className="welcome-message">
                  <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 60 }}
                    description={
                      <div>
                        <Title level={4}>欢迎使用AI医学助手</Title>
                        <Text type="secondary">
                          请在下方输入您的问题开始对话
                        </Text>
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="messages-list">
                  {currentSession.messages.map((message) => (
                    <div
                      className={`message ${message.role}`}
                      key={message.id}
                    >
                      <Avatar
                        size={40}
                        style={{
                          backgroundColor: message.role === MessageRole.USER ? '#1890ff' : '#52c41a',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                        icon={message.role === MessageRole.USER ? <UserOutlined /> : <RobotOutlined />}
                      />
                      <div className="message-content">
                        <div className="message-header">
                          <Text strong>
                            {message.role === MessageRole.USER ? userProfile.displayName : 'AI助手'}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatTime(message.timestamp)}
                          </Text>
                        </div>
                        <div className="message-text">
                          {formatMessage(message.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="message assistant">
                      <Avatar
                        size={40}
                        style={{
                          backgroundColor: '#52c41a',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                        icon={<RobotOutlined />}
                      />
                      <div className="message-content">
                        <div className="message-header">
                          <Text strong>AI助手</Text>
                        </div>
                        <div className="message-text">
                          <Spin size="small" style={{ marginRight: '8px' }} />
                          正在思考中...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="input-area">
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="请输入您的医学问题..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  style={{ resize: 'none' }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={sendMessageMutation.isPending}
                  disabled={!inputMessage.trim()}
                >
                  发送
                </Button>
              </Space.Compact>
              
              {sendMessageMutation.error && (
                <Alert
                  message="发送失败"
                  description={sendMessageMutation.error.message}
                  type="error"
                  showIcon
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryPage; 