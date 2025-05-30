
import React from 'react';
import { Expand } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  image: string;
}

interface CarouselItemProps {
  product: Product;
  index: number;
  isMobile: boolean;
  onImageClick: (imageUrl: string) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ 
  product, 
  index, 
  isMobile, 
  onImageClick 
}) => {
  return (
    <div
      key={`${product.id}-${index}`}
      className={`flex-shrink-0 snap-center px-2 ${
        isMobile ? 'w-full' : 'w-1/3'
      }`}
    >
      <div className="relative group">
        <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Fullscreen Icon */}
          <button
            onClick={() => onImageClick(product.image)}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Ver em tela cheia"
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
