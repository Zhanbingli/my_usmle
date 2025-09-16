import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { useQueryStore } from '../../stores/useQueryStore';
import { useSendMessage, useUserSessions } from '../../hooks/useGeminiQuery';
import { MessageRole } from '../../types';
import './AgentChatPanel.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface AgentChatPanelProps {
  onRequireLogin?: () => void;
}

const AgentChatPanel: React.FC<AgentChatPanelProps> = ({ onRequireLogin }) => {
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

  // 同步远程会话到本地 store
  useEffect(() => {
    if (userSessions) {
      useQueryStore.getState().setSessions(userSessions);
    }
  }, [userSessions]);

  useEffect(() => {
    if (!isLoggedIn && onRequireLogin) {
      onRequireLogin();
    }
  }, [isLoggedIn, onRequireLogin]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!currentUser || !userProfile) {
      onRequireLogin?.();
      return;
    }

    let sessionId = currentSession?.id;

    if (!sessionId) {
      sessionId = createSession(
        inputMessage.length > 30
          ? `${inputMessage.substring(0, 30)}...`
          : inputMessage,
        currentUser.uid
      );
    }

    try {
      await sendMessageMutation.mutateAsync({
        message: inputMessage,
        sessionId
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
    const processedContent = content
      .replace(/(https?:\/\/[^\s]{50,})/g, (url) => url.replace(/(.{50})/g, '$1\u200B'))
      .replace(/([^\s]{30,})/g, (word) => word.replace(/(.{20})/g, '$1\u200B'));

    return processedContent
      .split('\n')
      .map((line, index) => (
        <div
          key={index}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {line}
          {index < processedContent.split('\n').length - 1 && <br />}
        </div>
      ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (!isLoggedIn || !currentUser || !userProfile) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '40vh'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="agent-chat-panel">
      <div className="agent-chat-container">
        <div className="agent-chat-sidebar">
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

        <div className="agent-chat-main">
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
                          backgroundColor:
                            message.role === MessageRole.USER ? '#1890ff' : '#52c41a',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                        icon={
                          message.role === MessageRole.USER ? (
                            <UserOutlined />
                          ) : (
                            <RobotOutlined />
                          )
                        }
                      />
                      <div className="message-content">
                        <div className="message-header">
                          <Text strong>
                            {message.role === MessageRole.USER
                              ? userProfile.displayName
                              : 'AI助手'}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatTime(message.timestamp)}
                          </Text>
                        </div>
                        <div className="message-text">{formatMessage(message.content)}</div>
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

export default AgentChatPanel;
