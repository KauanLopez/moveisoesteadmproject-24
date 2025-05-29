
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
    slides: {
      perView: 1,
      spacing: 0,
    },
    mode: "snap",
    loop: false,
    drag: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    updated() {
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
    <div className="relative w-full h-full bg-gray-50">
      <div className="w-full h-full overflow-hidden">
        <div ref={sliderRef} className="keen-slider h-full">
          {images.map((image, idx) => {
            console.log(`CatalogImageCarousel: Rendering slide ${idx + 1}:`, image.image_url);
            return (
              <div key={image.id} className="keen-slider__slide">
                <div className="w-full h-full flex flex-col justify-center items-center bg-white p-4">
                  <div className="flex-1 flex items-center justify-center w-full max-h-[70vh]">
                    <img
                      src={image.image_url}
                      alt={image.title || `Imagem ${idx + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ 
                        maxHeight: '60vh',
                        maxWidth: '100%',
                        height: 'auto',
                        width: 'auto'
                      }}
                      onError={(e) => {
                        console.error('CatalogImageCarousel: Failed to load image:', image.image_url);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                        target.alt = 'Erro ao carregar imagem';
                      }}
                      onLoad={() => {
                        console.log('CatalogImageCarousel: Image loaded successfully:', image.image_url);
                      }}
                    />
                  </div>
                  {(image.title || image.description) && (
                    <div className="w-full bg-white p-3 border-t mt-2">
                      {image.title && <h4 className="font-medium text-lg text-center">{image.title}</h4>}
                      {image.description && <p className="text-gray-600 mt-1 text-center">{image.description}</p>}
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
            onClick={(e) => {
              e.preventDefault();
              instanceRef.current?.prev();
            }}
            disabled={currentSlide === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/95 text-gray-800 hover:bg-white shadow-lg z-30 border"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              instanceRef.current?.next();
            }}
            disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/95 text-gray-800 hover:bg-white shadow-lg z-30 border"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {loaded && instanceRef.current && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                instanceRef.current?.moveToIdx(idx);
              }}
              className={`w-2 h-2 rounded-full transition-colors border border-white/50 ${
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
