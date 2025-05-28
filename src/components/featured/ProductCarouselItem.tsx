
import React from 'react';
import { CarouselItem } from '@/components/ui/carousel';
import { Maximize2 } from 'lucide-react';
import { ImageContent } from '@/types/customTypes';

interface ProductCarouselItemProps {
  product: ImageContent;
  isMobile: boolean;
  onImageClick: (product: ImageContent) => void;
}

const ProductCarouselItem = ({ product, isMobile, onImageClick }: ProductCarouselItemProps) => {
  return (
    <CarouselItem key={product.id} className={`pl-4 ${isMobile ? 'basis-3/4' : 'basis-1/4 md:basis-1/3'}`}>
      <div className="relative hover-scale rounded-lg overflow-hidden shadow-md transition-all duration-300 group">
        <div className="h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: product.objectPosition || 'center',
              transform: product.scale ? `scale(${product.scale})` : 'scale(1)'
            }}
          />
          <button 
            onClick={() => onImageClick(product)}
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
    </CarouselItem>
  );
};

export default ProductCarouselItem;
