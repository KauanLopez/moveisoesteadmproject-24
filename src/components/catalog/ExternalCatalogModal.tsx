
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import SimpleImageCarousel from './SimpleImageCarousel';

interface ExternalCatalogModalProps {
  catalog: ExternalUrlCatalog;
  isOpen: boolean;
  onClose: () => void;
}

const ExternalCatalogModal: React.FC<ExternalCatalogModalProps> = ({ 
  catalog, 
  isOpen, 
  onClose 
}) => {
  console.log('ExternalCatalogModal: Opening catalog:', catalog.title);
  
  // Prepare images array
  const images = [];
  
  // Add cover image first
  if (catalog.external_cover_image_url) {
    images.push({
      url: catalog.external_cover_image_url,
      title: `${catalog.title} - Capa`
    });
  }
  
  // Add content images
  if (catalog.external_content_image_urls && catalog.external_content_image_urls.length > 0) {
    catalog.external_content_image_urls.forEach((url, index) => {
      if (url && url.trim() !== '') {
        images.push({
          url: url,
          title: `Página ${index + 1}`
        });
      }
    });
  }

  console.log('ExternalCatalogModal: Total images:', images.length);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[800px] p-0 rounded-lg overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{catalog.title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full">
          {/* Header - Fixed height */}
          <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-white z-50 flex-shrink-0 min-h-[60px]">
            <div className="min-w-0 flex-1 mr-4">
              <h2 className="text-lg sm:text-xl font-bold truncate">{catalog.title}</h2>
              {catalog.description && (
                <p className="text-gray-600 text-xs sm:text-sm truncate">{catalog.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2 flex-shrink-0">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          {/* Content - Flexible height */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            {images.length > 0 ? (
              <SimpleImageCarousel images={images} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm sm:text-base">Nenhuma imagem encontrada para este catálogo.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalCatalogModal;
