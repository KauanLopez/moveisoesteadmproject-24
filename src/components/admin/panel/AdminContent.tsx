import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import CatalogManagement from '../catalog/CatalogManagement';
import ContentSection from '../ContentSection';
import MessageManagement from '../messages/MessageManagement';
import UserManagement from '../users/UserManagement';
import PdfCatalogManagement from '../pdf-catalog/PdfCatalogManagement';

interface AdminContentProps {
  activeTab: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <CatalogManagement />;
      case 'pdf-catalogs':
        return <PdfCatalogManagement />;
      case 'products':
        return <ContentSection title="Produtos em Destaque" section="products" />;
      case 'manager':
        return <ContentSection title="Gerente" section="manager" />;
      case 'messages':
        return <MessageManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <CatalogManagement />;
    }
  };

  return (
    <TabsContent value={activeTab} className="mt-4">
      {renderContent()}
    </TabsContent>
  );
};

export default AdminContent;
