import React from 'react';
import { Navigate } from 'react-router-dom';

const QueryPage: React.FC = () => {
  return <Navigate to="/agent" replace />;
};

export default QueryPage;
