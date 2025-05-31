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
  isMobile, 
  onImageClick 
}) => {
  return (
    <div
      className={`flex-shrink-0 px-2 pb-3 ${ 
        isMobile ? 'w-full' : 'w-1/3' 
      }`}
      style={{ 
        flexBasis: isMobile ? '100%' : '33.3333%', 
      }}
    >
      <div className="relative group rounded-lg shadow-lg bg-gray-100 h-full flex flex-col">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            draggable="false" 
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
              target.alt = 'Erro ao carregar imagem';
              target.style.objectFit = 'contain'; 
            }}
          />
          
          <button
            onClick={(e) => {
                e.stopPropagation(); 
                onImageClick(product.image);
            }}
            className={`absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-opacity duration-200 focus:opacity-100 z-10 ${
              isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
            }`}
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