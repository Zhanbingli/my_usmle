import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ArticleDetailPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      <Card>
        <Empty
          image={<FileTextOutlined style={{ fontSize: '64px', color: '#1890ff' }} />}
          description={
            <div>
              <Title level={3}>文章详情</Title>
              <p>此功能正在开发中，敬请期待...</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ArticleDetailPage; 