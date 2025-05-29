
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
  return (
    <div className="px-4 py-3 bg-white border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate flex-1 mr-4">
          {title}
        </h3>
        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
          {currentIndex + 1} de {totalImages}
        </span>
      </div>
    </div>
  );
};

export default CarouselImageInfo;
