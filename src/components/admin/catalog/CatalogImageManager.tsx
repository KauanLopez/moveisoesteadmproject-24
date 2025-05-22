
import React from 'react';
import { useCatalogImages } from './hooks/useCatalogImages';
import CatalogImageUploadForm from './components/CatalogImageUploadForm';
import CatalogImageGallery from './components/CatalogImageGallery';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CatalogImageManagerProps {
  catalogId: string;
}

const CatalogImageManager: React.FC<CatalogImageManagerProps> = ({ catalogId }) => {
  const { 
    images, 
    loading, 
    uploading, 
    error, 
    setError,
    handleImageUpload, 
    handleDeleteImage,
    isAuthenticated 
  } = useCatalogImages(catalogId);

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de autenticação</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado para gerenciar imagens do catálogo.
          Por favor, faça login para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CatalogImageUploadForm 
        onUpload={handleImageUpload}
        uploading={uploading}
        error={null} // We're handling errors at the parent level now
      />

      <div>
        <h3 className="text-lg font-medium mb-4">Imagens do Catálogo ({images.length})</h3>
        <CatalogImageGallery 
          images={images}
          loading={loading}
          onDeleteImage={handleDeleteImage}
        />
      </div>
    </div>
  );
};

export default CatalogImageManager;
