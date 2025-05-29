
import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface CatalogImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
}

interface CatalogImageCarouselProps {
  images: CatalogImage[];
}

const CatalogImageCarousel: React.FC<CatalogImageCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  console.log('CatalogImageCarousel: Rendering with images count:', images.length);
  images.forEach((image, index) => {
    console.log(`CatalogImageCarousel: Image ${index + 1}:`, image.image_url);
  });

  if (!images || images.length === 0) {
    console.log('CatalogImageCarousel: No images to display');
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nenhuma imagem encontrada para este catálogo.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full">
        <div ref={sliderRef} className="keen-slider" style={{ height: '70vh', minHeight: '400px', maxHeight: '600px' }}>
          {images.map((image, idx) => {
            console.log(`CatalogImageCarousel: Rendering slide ${idx + 1} with image:`, image.image_url);
            return (
              <div key={image.id || `image-${idx}`} className="keen-slider__slide">
                <div className="h-full flex flex-col bg-white">
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={image.image_url}
                      alt={image.title || `Imagem ${idx + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={(e) => {
                        console.error('CatalogImageCarousel: Error loading image:', image.image_url);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('CatalogImageCarousel: Image loaded successfully:', image.image_url);
                      }}
                    />
                  </div>
                  {(image.title || image.description) && (
                    <div className="bg-white p-4 border-t">
                      {image.title && <h4 className="font-medium text-lg">{image.title}</h4>}
                      {image.description && <p className="text-gray-600 mt-1">{image.description}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {loaded && instanceRef.current && images.length > 1 && (
        <>
          <Button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
      
      {/* Pagination indicator */}
      {loaded && instanceRef.current && images.length > 1 && (
        <div className="flex justify-center mt-4 gap-1">
          {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === idx ? 'bg-furniture-yellow' : 'bg-gray-300'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogImageCarousel;
