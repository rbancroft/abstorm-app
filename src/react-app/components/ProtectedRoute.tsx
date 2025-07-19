import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginButton } from './LoginButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        {fallback || (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Authentication Required</h3>
            <p>Please log in to access this content.</p>
            <LoginButton />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
