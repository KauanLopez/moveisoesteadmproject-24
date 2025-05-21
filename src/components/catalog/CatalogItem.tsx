
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Maximize2 } from 'lucide-react';
import { ImageContent } from '@/types/customTypes';

interface CatalogItemProps {
  product: ImageContent;
  onClick: () => void;
}

const CatalogItem: React.FC<CatalogItemProps> = ({ product, onClick }) => {
  return (
    <Card className="overflow-hidden group hover-scale transition-all duration-300">
      <div className="relative h-64">
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
          onClick={onClick}
          className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Ver em tela cheia"
        >
          <Maximize2 className="h-5 w-5 text-gray-800" />
        </button>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-medium text-lg text-primary">{product.title}</h3>
      </CardContent>
      {product.description && (
        <CardFooter className="pt-0 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default CatalogItem;
