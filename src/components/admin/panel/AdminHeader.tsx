
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Button 
        onClick={logout}
        variant="outline"
      >
        Sair
      </Button>
    </div>
  );
};

export default AdminHeader;
