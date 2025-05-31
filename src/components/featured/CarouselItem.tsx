
import React from 'react';
import { Maximize2 } from 'lucide-react';

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
      <div className="relative hover-scale rounded-lg overflow-hidden shadow-md transition-all duration-300 group">
        <div className="h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => onImageClick(product.image)}
            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Ver em tela cheia"
          >
            <Maximize2 className="h-5 w-5 text-gray-800" />
          </button>
        </div>
        <div className="p-4 bg-white">
          <h4 className="font-medium text-lg text-primary">{product.title}</h4>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
