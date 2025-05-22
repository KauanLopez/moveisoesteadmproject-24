
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CatalogWithCategory } from '@/types/catalogTypes';
import CatalogTable from './CatalogTable';
import CatalogForm from '../CatalogForm';
import { CatalogCategory } from '@/types/catalogTypes';
import CatalogItemManagement from '../CatalogItemManagement';

interface CatalogContentProps {
  catalogs: CatalogWithCategory[];
  loading: boolean;
  selectedCatalog: CatalogWithCategory | null;
  showForm: boolean;
  categories: CatalogCategory[];
  onCreateClick: () => void;
  onEditCatalog: (catalog: CatalogWithCategory) => void;
  onDeleteCatalog: (id: string) => void;
  onCloseForm: (shouldRefresh: boolean) => void;
}

const CatalogContent: React.FC<CatalogContentProps> = ({
  catalogs,
  loading,
  selectedCatalog,
  showForm,
  categories,
  onCreateClick,
  onEditCatalog,
  onDeleteCatalog,
  onCloseForm,
}) => {
  const [activeManagementId, setActiveManagementId] = useState<string | null>(null);

  const handleCatalogSelect = (catalog: CatalogWithCategory) => {
    setActiveManagementId(catalog.id);
  };

  const handleBackToCatalogs = () => {
    setActiveManagementId(null);
  };

  return (
    <>
      {activeManagementId ? (
        <div>
          <Button onClick={handleBackToCatalogs} variant="outline" className="mb-4">
            ← Voltar para lista de catálogos
          </Button>
          <CatalogItemManagement 
            catalog={catalogs.find(c => c.id === activeManagementId) as CatalogWithCategory}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Catálogos</h2>
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" /> Novo Catálogo
            </Button>
          </div>

          {showForm ? (
            <CatalogForm 
              catalog={selectedCatalog} 
              categories={categories} 
              onClose={onCloseForm}
            />
          ) : (
            <CatalogTable 
              catalogs={catalogs}
              loading={loading}
              onEdit={onEditCatalog}
              onDelete={onDeleteCatalog}
              onManageItems={handleCatalogSelect}
            />
          )}
        </>
      )}
    </>
  );
};

export default CatalogContent;
