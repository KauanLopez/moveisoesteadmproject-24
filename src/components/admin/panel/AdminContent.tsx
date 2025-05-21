
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ContentSection from '../ContentSection';
import UserManagement from '../user-management';
import CatalogManagement from '../catalog/CatalogManagement';
import CatalogDetailsPanel from '../catalog/CatalogDetailsPanel';
import CategoryManagement from '../catalog/CategoryManagement';

interface AdminContentProps {
  activeTab: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="projects" className="space-y-8 overflow-x-auto">
        <ContentSection 
          title="Nosso Trabalho em Residências" 
          section="projects" 
        />
      </TabsContent>
      
      <TabsContent value="products" className="space-y-8 overflow-x-auto">
        <ContentSection 
          title="Produtos em Destaque" 
          section="products" 
        />
      </TabsContent>
      
      <TabsContent value="catalog" className="space-y-8 overflow-x-auto">
        <div className="grid grid-cols-1 gap-8">
          <CategoryManagement />
          <CatalogManagement />
          <CatalogDetailsPanel />
        </div>
      </TabsContent>
      
      <TabsContent value="manager" className="space-y-8 overflow-x-auto">
        <ContentSection 
          title="Gerente" 
          section="manager" 
        />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-8 overflow-x-auto">
        <UserManagement />
      </TabsContent>
    </>
  );
};

export default AdminContent;
