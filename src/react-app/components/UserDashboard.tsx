import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

// Example component that requires authentication
export const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>User Dashboard</h2>
        <p>Welcome to your private dashboard, {user?.name}!</p>
        <div style={{ marginTop: '16px' }}>
          <h3>Your Information:</h3>
          <ul>
            <li><strong>Name:</strong> {user?.name}</li>
            <li><strong>Email:</strong> {user?.email}</li>
            <li><strong>Provider:</strong> {user?.provider}</li>
            <li><strong>User ID:</strong> {user?.id}</li>
          </ul>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          This content is only visible to authenticated users.
        </p>
      </div>
    </ProtectedRoute>
  );
};

// Example usage in App.tsx:
// import { UserDashboard } from './components/UserDashboard';
// 
// Add this to your JSX:
// <UserDashboard />
