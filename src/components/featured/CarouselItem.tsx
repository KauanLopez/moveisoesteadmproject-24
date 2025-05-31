// src/components/featured/CarouselItem.tsx
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
      // Adicionado pb-3 para dar espaço para a sombra não ser cortada pelo overflow do container
      className={`flex-shrink-0 snap-center px-2 pb-3 ${ 
        isMobile ? 'w-full' : 'w-1/3' // Ajuste a largura conforme o design responsivo
      }`}
    >
      {/* Sombra e arredondamento aplicados a este wrapper */}
      <div className="relative group rounded-lg shadow-lg bg-gray-100"> {/* Adicionado bg-gray-100 aqui se a imagem não cobrir tudo */}
        {/* Container da imagem com aspect ratio e overflow para cortar a imagem, não a sombra */}
        <div className="aspect-square overflow-hidden rounded-lg"> {/* Removido bg-gray-100 daqui se já está no pai */}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg'; // Imagem placeholder em caso de erro
              target.alt = 'Erro ao carregar imagem';
            }}
          />
          
          <button
            onClick={() => onImageClick(product.image)}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
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