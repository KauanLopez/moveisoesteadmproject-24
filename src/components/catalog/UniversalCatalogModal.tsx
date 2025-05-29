
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CatalogModalProps } from '@/types/unifiedCatalogTypes';
import SimpleImageCarousel from './SimpleImageCarousel';

const UniversalCatalogModal: React.FC<CatalogModalProps> = ({ 
  catalog, 
  isOpen, 
  onClose 
}) => {
  if (!catalog) return null;

  console.log('UniversalCatalogModal: Opening catalog:', catalog.title, 'Type:', catalog.type);
  console.log('UniversalCatalogModal: Total images:', catalog.images.length);

  // Transform unified images to SimpleImageCarousel format
  const carouselImages = catalog.images.map(img => ({
    url: img.url,
    title: img.title
  }));

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
            {carouselImages.length > 0 ? (
              <SimpleImageCarousel images={carouselImages} />
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

export default UniversalCatalogModal;
