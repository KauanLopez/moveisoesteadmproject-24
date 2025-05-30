
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CatalogImage {
  url: string;
  title: string;
}

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: CatalogImage[];
}

interface CatalogModalProps {
  catalog: Catalog | null;
  isOpen: boolean;
  onClose: () => void;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ catalog, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!catalog) return null;

  // Reset index when catalog changes or when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, catalog?.id]);

  // Check if images exist and are not empty
  const hasImages = catalog.images && catalog.images.length > 0;
  
  if (!hasImages) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{catalog.name}</DialogTitle>
            <DialogDescription>
              Visualização do catálogo {catalog.name}
            </DialogDescription>
          </VisuallyHidden>
          
          <div className="flex flex-col w-full h-full bg-white">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-50 flex-shrink-0 min-h-[64px]">
              <div className="min-w-0 flex-1 mr-4">
                <h2 className="text-lg sm:text-xl font-bold truncate text-gray-900">{catalog.name}</h2>
                <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{catalog.description}</p>
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
            
            {/* No Images Message */}
            <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Nenhuma imagem encontrada para este catálogo.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % catalog.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + catalog.images.length) % catalog.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Ensure currentImageIndex is within bounds
  const safeCurrentIndex = Math.min(currentImageIndex, catalog.images.length - 1);
  const currentImage = catalog.images[safeCurrentIndex];

  // Double check that currentImage exists before rendering
  if (!currentImage) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{catalog.name}</DialogTitle>
            <DialogDescription>
              Visualização do catálogo {catalog.name}
            </DialogDescription>
          </VisuallyHidden>
          
          <div className="flex flex-col w-full h-full bg-white">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-50 flex-shrink-0 min-h-[64px]">
              <div className="min-w-0 flex-1 mr-4">
                <h2 className="text-lg sm:text-xl font-bold truncate text-gray-900">{catalog.name}</h2>
                <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{catalog.description}</p>
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
            
            {/* Error Message */}
            <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Erro ao carregar as imagens do catálogo.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{catalog.name}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {catalog.name}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full bg-white">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-50 flex-shrink-0 min-h-[64px]">
            <div className="min-w-0 flex-1 mr-4">
              <h2 className="text-lg sm:text-xl font-bold truncate text-gray-900">{catalog.name}</h2>
              <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{catalog.description}</p>
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
          
          {/* Image Container */}
          <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-100">
            {/* Fixed Navigation Arrows */}
            {catalog.images.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 text-gray-800 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg border transition-all duration-200 hover:scale-110"
                  size="icon"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 text-gray-800 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg border transition-all duration-200 hover:scale-110"
                  size="icon"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            )}

            {/* Image Display */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
                style={{
                  maxWidth: 'calc(100% - 2rem)',
                  maxHeight: 'calc(100% - 2rem)'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 bg-white border-t shadow-sm">
            {/* Image Info */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate flex-1 mr-4">
                  {currentImage.title || 'Imagem do Catálogo'}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                  {safeCurrentIndex + 1} de {catalog.images.length}
                </span>
              </div>
            </div>
            
            {/* Dots Navigation */}
            {catalog.images.length > 1 && (
              <div className="px-4 pb-4">
                <div className="flex justify-center items-center py-2 max-w-full overflow-x-auto">
                  <div className="flex space-x-2">
                    {catalog.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                          safeCurrentIndex === index 
                            ? 'bg-furniture-green scale-110' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogModal;
