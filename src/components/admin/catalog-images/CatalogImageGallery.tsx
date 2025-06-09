
import React from 'react';
import CatalogImageCard from './CatalogImageCard';

interface CatalogImageGalleryProps {
  images: any[];
  loading: boolean;
  onToggleFavorite: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

const CatalogImageGallery: React.FC<CatalogImageGalleryProps> = ({
  images,
  loading,
  onToggleFavorite,
  onDeleteImage
}) => {
  if (loading) {
    return <p className="text-gray-500">Carregando imagens...</p>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">Nenhuma imagem encontrada neste catálogo.</p>
        <p className="text-sm text-gray-400">
          Este catálogo não possui imagens de conteúdo configuradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <CatalogImageCard
          key={image.id}
          image={image}
          onToggleFavorite={onToggleFavorite}
          onDeleteImage={onDeleteImage}
        />
      ))}
    </div>
  );
};

export default CatalogImageGallery;
