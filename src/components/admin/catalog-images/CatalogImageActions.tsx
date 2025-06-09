
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';

interface CatalogImageActionsProps {
  imageId: string;
  isFavorite?: boolean;
  onToggleFavorite: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

const CatalogImageActions: React.FC<CatalogImageActionsProps> = ({
  imageId,
  isFavorite = false,
  onToggleFavorite,
  onDeleteImage
}) => {
  return (
    <div className="absolute top-2 right-2 flex gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onToggleFavorite(imageId)}
        className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
        title={isFavorite ? "Remover dos produtos em destaque" : "Adicionar aos produtos em destaque"}
      >
        <Star 
          className={`h-4 w-4 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
        />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeleteImage(imageId)}
        className="w-8 h-8 p-0 bg-white/80 hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};

export default CatalogImageActions;
