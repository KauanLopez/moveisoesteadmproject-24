
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ContentSection from '../ContentSection';
import CatalogManagement from '../catalog/CatalogManagement';
import ExternalCatalogManagement from '../external-catalog/ExternalCatalogManagement';
import PdfCatalogManagement from '../pdf-catalog/PdfCatalogManagement';
import MessageManagement from '../MessageManagement';
import UserManagement from '../user-management';
import CatalogManagement from '../CatalogManagement';
import FeaturedProductsView from '../FeaturedProductsView';

interface AdminContentProps {
  activeTab: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeTab }) => {
  return (
    <>
      <TabsContent value="catalog-management" className="mt-6">
        <CatalogManagement />
      </TabsContent>

      <TabsContent value="featured-products" className="mt-6">
        <FeaturedProductsView />
      </TabsContent>

      <TabsContent value="projects" className="mt-6">
        <ContentSection title="Capas de Catálogos" section="projects" />
      </TabsContent>

      <TabsContent value="external-catalogs" className="mt-6">
        <ExternalCatalogManagement />
      </TabsContent>

      <TabsContent value="pdf-catalogs" className="mt-6">
        <PdfCatalogManagement />
      </TabsContent>

      <TabsContent value="products" className="mt-6">
        <ContentSection title="Produtos em Destaque" section="products" />
      </TabsContent>

      <TabsContent value="manager" className="mt-6">
        <ContentSection title="Gerente" section="manager" />
      </TabsContent>

      <TabsContent value="messages" className="mt-6">
        <MessageManagement />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <UserManagement />
      </TabsContent>
    </>
  );
};

export default AdminContent;
