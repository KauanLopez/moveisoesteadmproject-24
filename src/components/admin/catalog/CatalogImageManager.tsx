
import React, { useEffect } from 'react';
import { useCatalogImages } from './hooks/useCatalogImages';
import CatalogImageUploadForm from './components/CatalogImageUploadForm';
import CatalogImageGallery from './components/CatalogImageGallery';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface CatalogImageManagerProps {
  catalogId: string;
}

const CatalogImageManager: React.FC<CatalogImageManagerProps> = ({ catalogId }) => {
  const { isAuthenticated } = useAuth();
  const { 
    images, 
    loading, 
    uploading, 
    error, 
    setError,
    handleImageUpload, 
    handleDeleteImage,
    reloadImages
  } = useCatalogImages(catalogId);

  useEffect(() => {
    // Clear errors when component mounts or authentication state changes
    setError(null);
  }, [isAuthenticated, setError]);

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

  const handleRetry = () => {
    setError(null);
    reloadImages();
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry} 
                className="w-fit"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Tentar novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CatalogImageUploadForm 
        onUpload={handleImageUpload}
        uploading={uploading}
        error={null}
        isAuthenticated={isAuthenticated}
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
