
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
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
    </>
  );
};

export default AdminContent;
