import React from 'react';
import AgentWorkspace from '../features/agent/components/AgentWorkspace';

const AgentPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      <AgentWorkspace />
    </div>
  );
};

export default AgentPage;
