
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CatalogItem } from '@/types/catalogTypes';

interface CatalogImageGalleryProps {
  images: CatalogItem[];
  loading: boolean;
  onDeleteImage: (id: string) => Promise<void>;
}

const CatalogImageGallery: React.FC<CatalogImageGalleryProps> = ({ 
  images, 
  loading, 
  onDeleteImage 
}) => {
  if (loading) {
    return <p>Carregando imagens...</p>;
  }
  
  if (images.length === 0) {
    return <p>Nenhuma imagem adicionada ao catálogo.</p>;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="aspect-w-4 aspect-h-3 relative">
            <img 
              src={image.image_url} 
              alt={image.title || 'Imagem do catálogo'} 
              className="object-cover w-full h-48"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=Erro+ao+carregar';
              }}
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2" 
              onClick={() => onDeleteImage(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="p-3">
            {image.title && <p className="font-medium truncate">{image.title}</p>}
            {image.description && <p className="text-sm text-gray-500 line-clamp-2">{image.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CatalogImageGallery;
