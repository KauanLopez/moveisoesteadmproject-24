
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 md:mb-8 w-full">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">{title}</h1>
      <Button 
        onClick={logout}
        variant="outline"
        className="text-sm md:text-base"
      >
        Sair
      </Button>
    </div>
  );
};

export default AdminHeader;
