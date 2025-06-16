
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalUrlCatalog } from '@/types/customTypes';
import { useCatalogImagesModal } from '@/hooks/useCatalogImagesModal';
import CatalogModalHeader from './catalog-images/CatalogModalHeader';
import CatalogImageGallery from './catalog-images/CatalogImageGallery';
import ImageUploadOptions from './ImageUploadOptions';

interface CatalogImagesModalProps {
  catalog: ExternalUrlCatalog;
  onClose: () => void;
}

const CatalogImagesModal: React.FC<CatalogImagesModalProps> = ({ catalog, onClose }) => {
  const {
    images,
    loading,
    isUploading,
    handleFileSubmit,
    handleUrlSubmit,
    toggleFavorite,
    deleteImage
  } = useCatalogImagesModal(catalog);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CatalogModalHeader catalog={catalog} onClose={onClose} />
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="space-y-6 pr-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Dica:</strong> Clique no ícone da estrela para adicionar uma imagem à seção 
                  "Produtos em Destaque" da página principal do site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Adicionar Novas Imagens</h3>
                <ImageUploadOptions
                  onFileSubmit={handleFileSubmit}
                  onUrlSubmit={handleUrlSubmit}
                  isUploading={isUploading}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Imagens do Catálogo ({images.length})
                </h3>
                
                <CatalogImageGallery
                  images={images}
                  loading={loading}
                  onToggleFavorite={toggleFavorite}
                  onDeleteImage={deleteImage}
                />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogImagesModal;
