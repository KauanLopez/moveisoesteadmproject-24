
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CatalogWithCategory } from '@/types/catalogTypes';
import CatalogTable from './CatalogTable';
import CatalogForm from '../CatalogForm';
import { CatalogCategory } from '@/types/catalogTypes';

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
  return (
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
        />
      )}
    </>
  );
};

export default CatalogContent;
