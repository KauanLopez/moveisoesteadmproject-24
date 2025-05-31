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
  // index, // index não é usado diretamente aqui para renderização, apenas para key no map
  isMobile, 
  onImageClick 
}) => {
  return (
    <div
      className={`flex-shrink-0 px-2 pb-3 ${ // Mantido pb-3 para espaço da sombra
        isMobile ? 'w-full' : 'w-1/3' 
      }`}
      style={{ 
        // Para garantir que os itens flex não encolham além do basis especificado pelas classes w-full/w-1/3
        flexBasis: isMobile ? '100%' : '33.3333%', 
      }}
    >
      <div className="relative group rounded-lg shadow-lg bg-gray-100 h-full flex flex-col"> {/* bg-gray-100 e h-full */}
        {/* Container da imagem com aspect-square. A imagem deve cobrir este container. */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            draggable="false" // IMPEDE o comportamento nativo de arrastar imagem do navegador
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
              target.alt = 'Erro ao carregar imagem';
              target.style.objectFit = 'contain'; // Para placeholder não distorcer
            }}
          />
          
          <button
            onClick={(e) => {
                e.stopPropagation(); // Previne que o clique no botão acione o arraste do carrossel
                onImageClick(product.image);
            }}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 z-10"
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