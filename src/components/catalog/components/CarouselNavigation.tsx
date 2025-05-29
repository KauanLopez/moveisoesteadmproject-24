
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  showNavigation: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onPrevious,
  onNext,
  showNavigation
}) => {
  if (!showNavigation) return null;

  return (
    <>
      <Button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white/95 text-gray-800 hover:bg-white shadow-lg z-30 border transition-all duration-200 hover:scale-110"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 bg-white/95 text-gray-800 hover:bg-white shadow-lg z-30 border transition-all duration-200 hover:scale-110"
        size="icon"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </>
  );
};

export default CarouselNavigation;
