
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ContentSection from '../ContentSection';
import UserManagement from '../UserManagement';

interface AdminContentProps {
  activeTab: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="projects" className="space-y-8">
        <ContentSection 
          title="Nosso Trabalho em Residências" 
          section="projects" 
        />
      </TabsContent>
      
      <TabsContent value="products" className="space-y-8">
        <ContentSection 
          title="Produtos em Destaque" 
          section="products" 
        />
      </TabsContent>
      
      <TabsContent value="manager" className="space-y-8">
        <ContentSection 
          title="Gerente" 
          section="manager" 
        />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-8">
        <UserManagement />
      </TabsContent>
    </>
  );
};

export default AdminContent;
