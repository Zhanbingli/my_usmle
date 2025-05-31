import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PubMedSearchPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      <Card>
        <Empty
          image={<SearchOutlined style={{ fontSize: '64px', color: '#1890ff' }} />}
          description={
            <div>
              <Title level={3}>PubMed文献检索</Title>
              <p>此功能正在开发中，敬请期待...</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default PubMedSearchPage; 