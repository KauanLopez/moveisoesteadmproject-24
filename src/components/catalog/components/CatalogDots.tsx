
import React from 'react';

interface CatalogDotsProps {
  totalCatalogs: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const CatalogDots: React.FC<CatalogDotsProps> = ({
  totalCatalogs,
  currentIndex,
  onDotClick
}) => {
  return (
    <div className="flex justify-center mt-4 md:mt-6">
      {Array.from({ length: totalCatalogs }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full mx-1 md:mx-2 transition-colors ${
            currentIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
          }`}
          aria-label={`Ir para catálogo ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CatalogDots;
