
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CatalogForm from './CatalogForm';
import CatalogPdfForm from './CatalogPdfForm';
import CatalogTable from './components/CatalogTable';
import { useCatalogManagement } from './hooks/useCatalogManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image } from 'lucide-react';

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

  const [formType, setFormType] = React.useState<'traditional' | 'pdf'>('pdf');
  const [showPdfForm, setShowPdfForm] = React.useState(false);

  const handleCreateTraditionalCatalog = () => {
    setFormType('traditional');
    handleCreateCatalog();
  };

  const handleCreatePdfCatalog = () => {
    setFormType('pdf');
    setShowPdfForm(true);
  };

  const handleClosePdfForm = (shouldRefresh: boolean) => {
    setShowPdfForm(false);
    if (shouldRefresh) {
      // Reload catalogs if needed
      window.location.reload();
    }
  };

  if (showForm && formType === 'traditional') {
    return (
      <CatalogForm
        catalog={selectedCatalog}
        categories={categories}
        onClose={handleCloseForm}
      />
    );
  }

  if (showPdfForm && formType === 'pdf') {
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
          <Button 
            onClick={handleCreateTraditionalCatalog}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            Catálogo Tradicional
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando catálogos...</div>
        ) : (
          <CatalogTable
            catalogs={catalogs}
            onEdit={handleEditCatalog}
            onDelete={handleDeleteCatalog}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogManagement;
