
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';

interface CatalogSlideProps {
  catalog: ExternalUrlCatalog;
  onOpenCatalog: (catalog: ExternalUrlCatalog) => void;
}

const CatalogSlide: React.FC<CatalogSlideProps> = ({ catalog, onOpenCatalog }) => {
  console.log('CatalogSlide: Rendering catalog:', catalog.title, 'with cover image:', catalog.external_cover_image_url);

  return (
    <div className="flex-[0_0_100%] min-w-0 px-4 transition-transform duration-300">
      <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
        <img 
          src={catalog.external_cover_image_url} 
          alt={catalog.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('CatalogSlide: Image load error for', catalog.title, '- URL:', catalog.external_cover_image_url);
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
          onLoad={() => {
            console.log('CatalogSlide: Cover image loaded successfully for', catalog.title);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <h3 className="text-2xl font-bold text-white">{catalog.title}</h3>
          <p className="text-white/80 mt-2">{catalog.description}</p>
          <div className="mt-4">
            <Button 
              onClick={() => onOpenCatalog(catalog)}
              className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black"
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogSlide;
