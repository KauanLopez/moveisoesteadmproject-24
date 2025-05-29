
import React from 'react';

interface CarouselDotsProps {
  totalImages: number;
  currentIndex: number;
  onSlideSelect: (index: number) => void;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({
  totalImages,
  currentIndex,
  onSlideSelect
}) => {
  if (totalImages <= 1) return null;

  return (
    <div className="flex justify-center items-center py-2">
      {Array.from({ length: totalImages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideSelect(index)}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 sm:mx-2 transition-all duration-200 ${
            currentIndex === index 
              ? 'bg-furniture-green scale-110' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Ir para imagem ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselDots;
