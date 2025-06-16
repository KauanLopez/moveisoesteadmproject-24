
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import AdminPanel from '@/components/admin/AdminPanel';

const Admin = () => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  const isAuthenticated = !!user;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <LoginForm />
        </div>
      ) : (
        <AdminPanel />
      )}
    </div>
  );
};

export default Admin;
