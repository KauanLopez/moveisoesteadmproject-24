
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatalogNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

const CatalogNavigation: React.FC<CatalogNavigationProps> = ({
  onPrevious,
  onNext
}) => {
  return (
    <>
      <Button
        onClick={onPrevious}
        className="absolute left-2 md:left-4 top-1/3 -translate-y-1/2 z-20 bg-white/95 text-gray-800 hover:bg-white rounded-full shadow-lg border p-2 md:p-3"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      
      <Button
        onClick={onNext}
        className="absolute right-2 md:right-4 top-1/3 -translate-y-1/2 z-20 bg-white/95 text-gray-800 hover:bg-white rounded-full shadow-lg border p-2 md:p-3"
        size="icon"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </>
  );
};

export default CatalogNavigation;
