
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
    <div className="flex-[0_0_100%] min-w-0 px-2 sm:px-4 transition-transform duration-300">
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
        {/* Fixed aspect ratio container */}
        <div className="aspect-[3/4] w-full">
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
        </div>
        
        {/* Overlay content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{catalog.title}</h3>
          <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{catalog.description}</p>
          <div>
            <Button 
              onClick={() => onOpenCatalog(catalog)}
              className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2"
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
