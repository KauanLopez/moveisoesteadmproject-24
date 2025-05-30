
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatalogImage {
  url: string;
  title: string;
}

interface CatalogData {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: CatalogImage[];
}

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogData | null;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose, catalog }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !catalog) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, catalog, currentImageIndex]);

  const handlePrevImage = () => {
    if (!catalog) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? catalog.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!catalog) return;
    setCurrentImageIndex((prev) => 
      prev === catalog.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !catalog) {
    return null;
  }

  const currentImage = catalog.images[currentImageIndex];

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      {/* Fixed size modal container */}
      <div className="bg-white rounded-lg w-full h-full max-w-[90vw] max-h-[90vh] flex flex-col shadow-2xl relative">
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {catalog.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {catalog.description}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 flex-shrink-0 ml-4"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Display Area - Takes remaining space */}
        <div className="flex-1 relative bg-gray-50 min-h-0 overflow-hidden">
          {/* Fixed Navigation Arrows */}
          <Button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
            size="icon"
            disabled={catalog.images.length <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
            size="icon"
            disabled={catalog.images.length <= 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Image Container - Fills available space */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>

        {/* Footer - Fixed height */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="text-sm text-gray-600 truncate flex-1 min-w-0">
            {currentImage.title}
          </div>
          <div className="text-sm text-gray-500 ml-4 flex-shrink-0">
            {currentImageIndex + 1} de {catalog.images.length}
          </div>
        </div>

        {/* Mobile Dots Indicator - Only on mobile */}
        <div className="flex justify-center pb-4 md:hidden flex-shrink-0">
          <div className="flex space-x-1 overflow-x-auto max-w-full px-4">
            {catalog.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${
                  currentImageIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;
