
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CatalogImageActions from './CatalogImageActions';

interface CatalogImageCardProps {
  image: {
    id: string;
    image: string;
    title?: string;
    description?: string;
  };
  onToggleFavorite: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

const CatalogImageCard: React.FC<CatalogImageCardProps> = ({
  image,
  onToggleFavorite,
  onDeleteImage
}) => {
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-square relative">
        <img
          src={image.image}
          alt={image.title || 'Imagem do catálogo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
          }}
        />
        <CatalogImageActions
          imageId={image.id}
          onToggleFavorite={onToggleFavorite}
          onDeleteImage={onDeleteImage}
        />
      </div>
      <CardContent className="p-3">
        {image.title && (
          <p className="font-medium text-sm mb-1">{image.title}</p>
        )}
        {image.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{image.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogImageCard;
