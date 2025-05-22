
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryManagement from './CategoryManagement';
import CatalogContent from './components/CatalogContent';
import { useCatalogManagement } from './hooks/useCatalogManagement';

const CatalogManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('catalogs');
  
  const {
    catalogs,
    selectedCatalog,
    showForm,
    loading,
    categories,
    loadCatalogs,
    loadCategories,
    handleEditCatalog,
    handleCreateCatalog,
    handleCloseForm,
    handleDeleteCatalog
  } = useCatalogManagement();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reload appropriate data when tab changes
    if (value === 'catalogs') {
      loadCatalogs();
    } else if (value === 'categories') {
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="catalogs">Catálogos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="catalogs" className="mt-0">
          <CatalogContent 
            catalogs={catalogs}
            loading={loading}
            selectedCatalog={selectedCatalog}
            showForm={showForm}
            categories={categories}
            onCreateClick={handleCreateCatalog}
            onEditCatalog={handleEditCatalog}
            onDeleteCatalog={handleDeleteCatalog}
            onCloseForm={handleCloseForm}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <CategoryManagement onCategoriesUpdated={loadCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogManagement;
