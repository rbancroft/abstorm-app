import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

export const UserProfile: React.FC = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="user-profile loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        {user.avatar && (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="user-avatar"
          />
        )}
        <div className="user-details">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
          <span className="user-provider">via {user.provider}</span>
        </div>
      </div>
      <button 
        className="logout-btn"
        onClick={logout}
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};
