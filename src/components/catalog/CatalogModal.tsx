
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDragHandlers } from './hooks/useDragHandlers';

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // <-- MUDANÇA: Lógica para combinar a capa com as outras imagens
  const allImages = React.useMemo(() => {
    if (!catalog) return [];
    // Sempre começa com a imagem de capa
    const imagesToShow = [{ url: catalog.coverImage, title: 'Capa do Catálogo' }];
    // Adiciona as imagens de conteúdo, se existirem
    if (catalog.images && catalog.images.length > 0) {
      imagesToShow.push(...catalog.images);
    }
    return imagesToShow;
  }, [catalog]);

  const handlePrevImage = () => {
    if (!catalog || allImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!catalog || allImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const {
    isDragging,
    translateX,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDragHandlers({
    onPrevious: handlePrevImage,
    onNext: handleNextImage
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsFullscreen(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !catalog || allImages.length === 0) return;

      switch (event.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsFullscreen(!isFullscreen);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, catalog, currentImageIndex, isFullscreen, allImages.length, handlePrevImage, handleNextImage, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isFullscreen) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen || !catalog) {
    return null;
  }

  // <-- MUDANÇA: Verificação para o caso de não haver imagem ou allImages estar vazio
  if (allImages.length === 0) {
    return (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg text-center">
                <p>Este catálogo não possui imagens para exibir.</p>
                <Button onClick={onClose} className="mt-4">Fechar</Button>
            </div>
        </div>
    );
  }

  // <-- MUDANÇA: Pega a imagem da lista combinada com verificação de segurança
  const currentImage = allImages[currentImageIndex];

  // <-- MUDANÇA: Verificação adicional de segurança
  if (!currentImage) {
    return (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg text-center">
                <p>Erro ao carregar a imagem do catálogo.</p>
                <Button onClick={onClose} className="mt-4">Fechar</Button>
            </div>
        </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${
        isFullscreen ? 'bg-black' : 'p-4'
      }`}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg flex flex-col shadow-2xl relative ${
        isFullscreen 
          ? 'w-full h-full rounded-none' 
          : 'w-full h-full max-w-[90vw] max-h-[90vh]'
      }`}>
        {!isFullscreen && (
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
        )}

        <div className="flex-1 relative bg-gray-50 min-h-0 overflow-hidden">
          <Button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
            size="icon"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>

          {isFullscreen && (
            <Button
              onClick={onClose}
              className="absolute top-4 left-4 z-30 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
            size="icon"
            disabled={allImages.length <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg border"
            size="icon"
            disabled={allImages.length <= 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Página {currentImageIndex + 1} de {allImages.length}
            </div>
          )}

          <div 
            className="w-full h-full flex items-center justify-center p-8 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: isDragging ? `translateX(${translateX}px)` : 'translateX(0)',
              transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
          >
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain pointer-events-none"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
              draggable={false}
            />
          </div>
        </div>

        {!isFullscreen && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="text-sm text-gray-600 truncate flex-1 min-w-0">
              {currentImage.title}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogModal;
