
import React from 'react';
import CatalogNavigation from './CatalogNavigation';
import CatalogImageDisplay from './CatalogImageDisplay';
import CatalogDots from './CatalogDots';
import CatalogInfo from './CatalogInfo';
import { useCatalogCarousel } from '../hooks/useCatalogCarousel';

interface CatalogImage {
  url: string;
  title: string;
}

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: CatalogImage[];
}

interface CatalogCarouselContainerProps {
  catalogs: Catalog[];
  onCatalogClick: (catalog: Catalog) => void;
}

const CatalogCarouselContainer: React.FC<CatalogCarouselContainerProps> = ({
  catalogs,
  onCatalogClick
}) => {
  const {
    currentIndex,
    setCurrentIndex,
    isDragging,
    startX,
    currentX,
    nextCatalog,
    prevCatalog,
    handleCatalogClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCatalogCarousel({ catalogs, onCatalogClick });

  const currentCatalog = catalogs[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Carousel Frame with Image and Button */}
      <div className="relative mb-4">
        <CatalogNavigation
          onPrevious={prevCatalog}
          onNext={nextCatalog}
        />

        <CatalogImageDisplay
          catalog={currentCatalog}
          isDragging={isDragging}
          startX={startX}
          currentX={currentX}
          onCatalogClick={handleCatalogClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        <CatalogDots
          totalCatalogs={catalogs.length}
          currentIndex={currentIndex}
          onDotClick={setCurrentIndex}
        />
      </div>

      <CatalogInfo catalog={currentCatalog} />
    </div>
  );
};

export default CatalogCarouselContainer;
