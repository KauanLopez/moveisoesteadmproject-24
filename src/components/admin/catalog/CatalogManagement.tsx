
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CatalogPdfForm from './CatalogPdfForm';
import CatalogTable from './components/CatalogTable';
import { useCatalogManagement } from './hooks/useCatalogManagement';
import { FileText, Plus } from 'lucide-react';

const CatalogManagement = () => {
  const {
    catalogs,
    selectedCatalog,
    showForm,
    loading,
    categories,
    handleEditCatalog,
    handleCreateCatalog,
    handleCloseForm,
    handleDeleteCatalog
  } = useCatalogManagement();

  const [showPdfForm, setShowPdfForm] = React.useState(false);

  const handleCreatePdfCatalog = () => {
    setShowPdfForm(true);
  };

  const handleClosePdfForm = (shouldRefresh: boolean) => {
    setShowPdfForm(false);
    if (shouldRefresh) {
      // Reload catalogs if needed
      window.location.reload();
    }
  };

  const handleManageItems = (catalog: any) => {
    // Placeholder for managing catalog items functionality
    console.log('Managing items for catalog:', catalog.id);
  };

  if (showPdfForm) {
    return (
      <CatalogPdfForm
        onClose={handleClosePdfForm}
        categories={categories}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Catálogos</CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreatePdfCatalog}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Novo Catálogo PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CatalogTable
          catalogs={catalogs}
          loading={loading}
          onEdit={handleEditCatalog}
          onDelete={handleDeleteCatalog}
          onManageItems={handleManageItems}
        />
      </CardContent>
    </Card>
  );
};

export default CatalogManagement;
