
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CatalogModalProps } from '@/types/unifiedCatalogTypes';
import SimpleImageCarousel from './SimpleImageCarousel';
import CatalogModalHeader from './components/CatalogModalHeader';

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
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{catalog.title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full bg-white">
          <CatalogModalHeader
            title={catalog.title}
            description={catalog.description}
            onClose={onClose}
          />
          
          {/* Container do carrossel - usa todo espaço restante disponível */}
          <div className="flex-1 min-h-0 overflow-hidden" style={{ height: 'calc(90vh - 64px)' }}>
            {carouselImages.length > 0 ? (
              <SimpleImageCarousel images={carouselImages} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                <div className="text-center">
                  <p className="text-sm sm:text-base mb-2">Nenhuma imagem encontrada para este catálogo.</p>
                  <p className="text-xs text-gray-400">Verifique se as imagens foram carregadas corretamente.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalCatalogModal;
