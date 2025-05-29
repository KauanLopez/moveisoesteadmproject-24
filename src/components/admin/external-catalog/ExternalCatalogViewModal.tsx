
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import CatalogImageCarousel from '@/components/catalog/CatalogImageCarousel';

interface ExternalCatalogViewModalProps {
  catalog: ExternalUrlCatalog;
  isOpen: boolean;
  onClose: () => void;
}

const ExternalCatalogViewModal: React.FC<ExternalCatalogViewModalProps> = ({ 
  catalog, 
  isOpen, 
  onClose 
}) => {
  console.log('ExternalCatalogViewModal: Opening catalog:', catalog.title);
  console.log('ExternalCatalogViewModal: Cover image URL:', catalog.external_cover_image_url);
  console.log('ExternalCatalogViewModal: Content images:', catalog.external_content_image_urls);
  
  // Create images array starting with cover image, then adding content images
  const images = [];
  
  // Add cover image first
  if (catalog.external_cover_image_url) {
    images.push({
      id: `${catalog.id}-cover`,
      image_url: catalog.external_cover_image_url,
      title: `${catalog.title} - Capa`,
      description: 'Capa do catálogo'
    });
  }
  
  // Add content images
  if (catalog.external_content_image_urls && catalog.external_content_image_urls.length > 0) {
    catalog.external_content_image_urls.forEach((url, index) => {
      if (url && url.trim() !== '') {
        images.push({
          id: `${catalog.id}-content-${index}`,
          image_url: url,
          title: `Página ${index + 1}`,
          description: ''
        });
      }
    });
  }

  console.log('ExternalCatalogViewModal: Total images prepared for carousel:', images.length);
  images.forEach((img, idx) => {
    console.log(`Image ${idx + 1}:`, img.title, '-', img.image_url);
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full bg-white rounded-lg p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{catalog.title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between items-center p-4 border-b bg-white z-10">
            <div className="min-w-0 flex-1 mr-4">
              <h2 className="text-xl font-bold truncate">{catalog.title}</h2>
              {catalog.description && (
                <p className="text-gray-600 text-sm truncate">{catalog.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2 flex-shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 w-full overflow-hidden">
            {images.length > 0 ? (
              <div className="w-full h-full">
                <CatalogImageCarousel images={images} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Nenhuma imagem encontrada para este catálogo.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalCatalogViewModal;
