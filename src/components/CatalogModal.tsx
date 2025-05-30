
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CatalogModalHeader from './catalog/components/CatalogModalHeader';
import CatalogImageDisplay from './catalog/components/CatalogImageDisplay';
import CatalogModalNavigation from './catalog/components/CatalogModalNavigation';
import CatalogModalFooter from './catalog/components/CatalogModalFooter';
import EmptyModal from './catalog/components/EmptyModal';

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

  // Reset index when catalog changes or when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, catalog?.id]);

  // Early returns after all hooks are called
  if (!catalog) return null;

  // Check if images exist and are not empty
  const hasImages = catalog.images && catalog.images.length > 0;
  
  if (!hasImages) {
    return (
      <EmptyModal
        isOpen={isOpen}
        onClose={onClose}
        title={catalog.name}
        description={catalog.description}
        message="Nenhuma imagem encontrada para este catálogo."
      />
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
      <EmptyModal
        isOpen={isOpen}
        onClose={onClose}
        title={catalog.name}
        description={catalog.description}
        message="Erro ao carregar as imagens do catálogo."
      />
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
          <CatalogModalHeader
            title={catalog.name}
            description={catalog.description}
            onClose={onClose}
          />
          
          {/* Image Container */}
          <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-100">
            <CatalogModalNavigation
              onPrevious={prevImage}
              onNext={nextImage}
              showNavigation={catalog.images.length > 1}
            />

            <CatalogImageDisplay
              imageUrl={currentImage.url}
              imageTitle={currentImage.title}
            />
          </div>
          
          <CatalogModalFooter
            currentImageTitle={currentImage.title}
            currentIndex={safeCurrentIndex}
            totalImages={catalog.images.length}
            images={catalog.images}
            onImageSelect={goToImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogModal;
