
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
    <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20 bg-black/30 rounded-full px-3 py-2">
      {Array.from({ length: totalImages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideSelect(index)}
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
            currentIndex === index ? 'bg-furniture-yellow scale-125' : 'bg-white/70 hover:bg-white/90'
          }`}
          aria-label={`Ir para slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselDots;
