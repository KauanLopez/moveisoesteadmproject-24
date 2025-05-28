
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import AdminHeader from './panel/AdminHeader';
import AdminTabs from './panel/AdminTabs';
import AdminContent from './panel/AdminContent';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const adminTabs = [
    { id: 'projects', label: 'Capas de Catálogos' },
    { id: 'pdf-catalogs', label: 'Catálogos PDF' },
    { id: 'products', label: 'Produtos em Destaque' },
    { id: 'manager', label: 'Gerente' },
    { id: 'messages', label: 'Mensagens' },
    { id: 'users', label: 'Gerenciar Usuários' },
  ];

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
