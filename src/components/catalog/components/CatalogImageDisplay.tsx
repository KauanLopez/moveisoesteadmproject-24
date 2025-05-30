
import React from 'react';
import { Button } from '@/components/ui/button';

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: Array<{ url: string; title: string }>;
}

interface CatalogImageDisplayProps {
  catalog: Catalog;
  isDragging: boolean;
  startX: number;
  currentX: number;
  onCatalogClick: (catalog: Catalog) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const CatalogImageDisplay: React.FC<CatalogImageDisplayProps> = ({
  catalog,
  isDragging,
  startX,
  currentX,
  onCatalogClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  return (
    <div 
      className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: isDragging ? `translateX(${(currentX - startX) * 0.1}px)` : 'translateX(0px)',
        transition: isDragging ? 'none' : 'transform 0.3s ease'
      }}
    >
      <div className="aspect-[16/9] w-full">
        <img
          src={catalog.coverImage}
          alt={catalog.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>

      {/* Ver Catálogos Button - Inside carousel, bottom-right corner */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onCatalogClick(catalog);
          }}
          className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 shadow-lg"
        >
          Ver Catálogo
        </Button>
      </div>
    </div>
  );
};

export default CatalogImageDisplay;
