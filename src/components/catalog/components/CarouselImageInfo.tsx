
import React from 'react';

interface CarouselImageInfoProps {
  title: string;
  currentIndex: number;
  totalImages: number;
}

const CarouselImageInfo: React.FC<CarouselImageInfoProps> = ({
  title,
  currentIndex,
  totalImages
}) => {
  if (!title) return null;

  return (
    <div className="bg-white border-t p-3 sm:p-4 text-center flex-shrink-0">
      <h4 className="font-medium text-sm sm:text-base lg:text-lg">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-600 mt-1">
        {currentIndex + 1} de {totalImages}
      </p>
    </div>
  );
};

export default CarouselImageInfo;
