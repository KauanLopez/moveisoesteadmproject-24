
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import AdminPanel from '@/components/admin/AdminPanel';
import { ContentProvider } from '@/context/ContentContext';

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to home if trying to access the path directly without being logged in
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // This delay gives time for auth state to initialize
      if (!isAuthenticated && window.location.pathname === '/admin') {
        // Add a small delay before redirecting
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, navigate]);

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
