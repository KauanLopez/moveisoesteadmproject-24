
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PdfCatalog } from '@/services/pdfCatalogService';

interface PdfCatalogModalProps {
  catalog: PdfCatalog;
  isOpen: boolean;
  onClose: () => void;
}

const PdfCatalogModal: React.FC<PdfCatalogModalProps> = ({ catalog, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Only show content images in the modal (not the cover)
  const contentImages = catalog.content_image_urls;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % contentImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + contentImages.length) % contentImages.length);
  };

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [catalog.id]);

  if (contentImages.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl bg-white rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">{catalog.title}</h2>
            <p className="text-gray-600">Este catálogo ainda não possui páginas de conteúdo processadas.</p>
            <Button onClick={onClose} className="mt-4">Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
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
                src={contentImages[currentIndex]}
                alt={`Página ${currentIndex + 2} de ${catalog.title}`}
                className="w-full h-full object-contain"
              />
              
              {contentImages.length > 1 && (
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
                    disabled={currentIndex === contentImages.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
                    size="icon"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {contentImages.length > 1 && (
            <div className="p-4 border-t">
              <div className="flex justify-center items-center gap-4">
                <span className="text-sm text-gray-600">
                  Página {currentIndex + 2} de {catalog.total_pages}
                </span>
                <div className="flex gap-1">
                  {contentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentIndex === index ? 'bg-furniture-yellow' : 'bg-gray-300'
                      }`}
                      aria-label={`Ir para página ${index + 2}`}
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

export default PdfCatalogModal;
