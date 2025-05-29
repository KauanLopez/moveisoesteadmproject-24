
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
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{catalog.title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full bg-white">
          {/* Header compacto - altura fixa mínima */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-50 flex-shrink-0 min-h-[64px]">
            <div className="min-w-0 flex-1 mr-4">
              <h2 className="text-lg sm:text-xl font-bold truncate text-gray-900">{catalog.title}</h2>
              {catalog.description && (
                <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{catalog.description}</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="rounded-full p-2 flex-shrink-0 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
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
