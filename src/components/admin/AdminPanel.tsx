
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import AdminHeader from './panel/AdminHeader';
import AdminTabs from './panel/AdminTabs';
import AdminContent from './panel/AdminContent';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('catalog-management');
  const { user, loading } = useAuth();

  const adminTabs = [
    { id: 'catalog-management', label: 'Gerenciar Catálogos' },
    { id: 'featured-products', label: 'Ver Produtos em Destaque' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
        <p className="text-gray-600">Você precisa estar logado para acessar o painel administrativo.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-6 pt-4 md:py-6 max-w-7xl overflow-hidden">
      <AdminHeader title="Painel Administrativo" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <AdminTabs 
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <AdminContent activeTab={activeTab} />
      </Tabs>
    </div>
  );
};

export default AdminPanel;
