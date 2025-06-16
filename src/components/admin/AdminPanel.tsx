import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminHeader from './panel/AdminHeader';
import AdminTabs from './panel/AdminTabs';
import ExternalCatalogManagement from './external-catalog/ExternalCatalogManagement'; // Importação correta
import FeaturedProductsView from './FeaturedProductsView';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('catalog-management');

  const adminTabs = [
    { id: 'catalog-management', label: 'Gerenciar Catálogos' },
    { id: 'featured-products', label: 'Ver Produtos em Destaque' },
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
        
        {/* Renderiza o conteúdo da aba diretamente aqui */}
        <TabsContent value="catalog-management" className="mt-6">
          <ExternalCatalogManagement />
        </TabsContent>

        <TabsContent value="featured-products" className="mt-6">
          <FeaturedProductsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;