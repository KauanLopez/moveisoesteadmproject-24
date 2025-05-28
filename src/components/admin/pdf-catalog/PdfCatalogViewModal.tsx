
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PdfCatalog } from '@/services/pdfCatalogService';

interface PdfCatalogViewModalProps {
  catalog: PdfCatalog;
  isOpen: boolean;
  onClose: () => void;
}

const PdfCatalogViewModal: React.FC<PdfCatalogViewModalProps> = ({ catalog, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // Combine cover image with content images for viewing
  const allImages = [
    ...(catalog.cover_image_url ? [catalog.cover_image_url] : []),
    ...catalog.content_image_urls
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [catalog.id]);

  if (allImages.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-white rounded-lg p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="text-xl font-bold">{catalog.title}</h2>
              {catalog.description && (
                <p className="text-gray-600 mt-1">{catalog.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 relative overflow-auto">
            <div className="relative h-[600px]">
              <img
                src={allImages[currentIndex]}
                alt={`Página ${currentIndex + 1} de ${catalog.title}`}
                className="w-full h-full object-contain"
              />
              
              {allImages.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
                    size="icon"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    disabled={currentIndex === allImages.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
                    size="icon"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {allImages.length > 1 && (
            <div className="p-4 border-t">
              <div className="flex justify-center items-center gap-4">
                <span className="text-sm text-gray-600">
                  Página {currentIndex + 1} de {allImages.length}
                </span>
                <div className="flex gap-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentIndex === index ? 'bg-furniture-yellow' : 'bg-gray-300'
                      }`}
                      aria-label={`Ir para página ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfCatalogViewModal;
