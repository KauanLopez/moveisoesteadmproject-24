
import React from 'react';
import { useCatalogImages } from './hooks/useCatalogImages';
import CatalogImageUploadForm from './components/CatalogImageUploadForm';
import CatalogImageGallery from './components/CatalogImageGallery';
import { saveCatalogItem } from '@/services/catalogService';

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
    handleDeleteImage 
  } = useCatalogImages(catalogId);

  return (
    <div className="space-y-6">
      <CatalogImageUploadForm 
        onUpload={handleImageUpload}
        uploading={uploading}
        error={error}
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
