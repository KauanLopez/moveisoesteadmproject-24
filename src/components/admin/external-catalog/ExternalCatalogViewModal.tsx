
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
  console.log('ExternalCatalogViewModal: Cover image:', catalog.external_cover_image_url);
  console.log('ExternalCatalogViewModal: Content images count:', catalog.external_content_image_urls?.length || 0);
  
  // Create images array with cover + content images
  const allImageUrls = [
    catalog.external_cover_image_url,
    ...(catalog.external_content_image_urls || [])
  ].filter(Boolean); // Remove any null/undefined URLs

  console.log('ExternalCatalogViewModal: All image URLs to display:', allImageUrls);
  
  const images = allImageUrls.map((url, index) => {
    const isFirstImage = index === 0;
    console.log(`ExternalCatalogViewModal: Mapping image ${index + 1}:`, url, isFirstImage ? '(CAPA)' : '');
    return {
      id: `${catalog.id}-${index}`,
      image_url: url,
      title: isFirstImage ? `${catalog.title} - Capa` : `Página ${index}`,
      description: isFirstImage ? 'Capa do catálogo' : ''
    };
  });

  console.log('ExternalCatalogViewModal: Final images array for carousel:', images);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full bg-white rounded-lg p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{catalog.title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b bg-white">
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
          
          <div className="flex-1 overflow-hidden">
            {images.length > 0 ? (
              <CatalogImageCarousel images={images} />
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
