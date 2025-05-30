
import React from 'react';

interface CatalogModalFooterProps {
  currentImageTitle: string;
  currentIndex: number;
  totalImages: number;
  images: Array<{ url: string; title: string }>;
  onImageSelect: (index: number) => void;
}

const CatalogModalFooter: React.FC<CatalogModalFooterProps> = ({
  currentImageTitle,
  currentIndex,
  totalImages,
  images,
  onImageSelect
}) => {
  return (
    <div className="flex-shrink-0 bg-white border-t shadow-sm">
      {/* Image Info */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate flex-1 mr-4">
            {currentImageTitle || 'Imagem do Catálogo'}
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {currentIndex + 1} de {totalImages}
          </span>
        </div>
      </div>
      
      {/* Dots Navigation */}
      {totalImages > 1 && (
        <div className="px-4 pb-4">
          <div className="flex justify-center items-center py-2 max-w-full overflow-x-auto">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onImageSelect(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                    currentIndex === index 
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
  );
};

export default CatalogModalFooter;
