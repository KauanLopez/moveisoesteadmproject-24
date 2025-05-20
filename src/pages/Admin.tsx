
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import AdminPanel from '@/components/admin/AdminPanel';
import { ContentProvider } from '@/context/ContentContext';

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // We're removing the auto-redirect that was causing the login page to close too quickly
  // This allows users to see and interact with the login form
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <LoginForm />
        </div>
      ) : (
        <ContentProvider>
          <AdminPanel />
        </ContentProvider>
      )}
    </div>
  );
};

export default Admin;
