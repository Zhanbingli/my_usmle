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
import { useUserStore } from '../stores/useUserStore';
import { useQueryStore } from '../stores/useQueryStore';
import { useSendMessage, useUserSessions } from '../hooks/useGeminiQuery';
import { MessageRole } from '../types';
import './QueryPage.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const QueryPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useUserStore();
  const { 
    currentSession, 
    sessions, 
    setCurrentSession, 
    createSession 
  } = useQueryStore();

  const sendMessageMutation = useSendMessage();
  const { data: userSessions, isLoading: sessionsLoading } = useUserSessions(
    user?.id || ''
  );

  // 更新本地sessions状态
  useEffect(() => {
    if (userSessions) {
      useQueryStore.getState().setSessions(userSessions);
    }
  }, [userSessions]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    let sessionId = currentSession?.id;

    // 如果没有当前会话，创建新会话
    if (!sessionId) {
      sessionId = createSession(
        inputMessage.length > 30 
          ? inputMessage.substring(0, 30) + '...' 
          : inputMessage,
        user.id
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
    // 简单的markdown样式处理
    return content
      .split('\n')
      .map((line, index) => (
        <div key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </div>
      ));
  };

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
                我可以帮助您解答医学问题、分析症状、提供诊断建议
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
                      key={message.id} 
                      className={`message ${message.role}`}
                    >
                      <Avatar
                        icon={
                          message.role === MessageRole.USER 
                            ? <UserOutlined /> 
                            : <RobotOutlined />
                        }
                        style={{
                          backgroundColor: message.role === MessageRole.USER 
                            ? '#1890ff' 
                            : '#52c41a'
                        }}
                      />
                      <div className="message-content">
                        <div className="message-bubble">
                          {formatMessage(message.content)}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Text>
                      </div>
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="message assistant">
                      <Avatar 
                        icon={<RobotOutlined />} 
                        style={{ backgroundColor: '#52c41a' }}
                      />
                      <div className="message-content">
                        <div className="message-bubble">
                          <Spin size="small" /> 正在思考中...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 错误提示 */}
            {sendMessageMutation.isError && (
              <Alert
                message="发送消息失败"
                description="请检查网络连接或稍后重试"
                type="error"
                closable
                style={{ marginBottom: '16px' }}
                onClose={() => sendMessageMutation.reset()}
              />
            )}

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
                  style={{ height: 'auto' }}
                >
                  发送
                </Button>
              </Space.Compact>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryPage; 