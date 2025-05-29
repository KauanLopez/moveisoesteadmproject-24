
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

  console.log('CatalogImageCarousel: Received images:', images?.length || 0);
  
  // Reset slider when images change
  useEffect(() => {
    if (instanceRef.current && images.length > 0) {
      instanceRef.current.moveToIdx(0);
      setCurrentSlide(0);
    }
  }, [images, instanceRef]);

  if (!images || images.length === 0) {
    console.log('CatalogImageCarousel: No images to display');
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Nenhuma imagem encontrada para este catálogo.</p>
      </div>
    );
  }

  console.log('CatalogImageCarousel: Rendering carousel with', images.length, 'images');

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full">
        <div ref={sliderRef} className="keen-slider h-full">
          {images.map((image, idx) => {
            console.log(`CatalogImageCarousel: Rendering slide ${idx + 1}:`, image.image_url);
            return (
              <div key={image.id} className="keen-slider__slide">
                <div className="h-full flex flex-col bg-white">
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-50" style={{ minHeight: '60vh' }}>
                    <img
                      src={image.image_url}
                      alt={image.title || `Imagem ${idx + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: '80vh' }}
                      onError={(e) => {
                        console.error('CatalogImageCarousel: Failed to load image:', image.image_url);
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
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/90 text-gray-800 hover:bg-white shadow-lg z-10"
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
      
      {loaded && instanceRef.current && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === idx ? 'bg-furniture-yellow' : 'bg-white/60'
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
