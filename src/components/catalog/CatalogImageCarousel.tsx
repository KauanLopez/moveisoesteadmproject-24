
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

  return (
    <div className="relative">
      <div className="w-full">
        <div ref={sliderRef} className="keen-slider h-[500px]">
          {images.map((image, idx) => (
            <div key={image.id} className="keen-slider__slide">
              <div className="h-full flex flex-col">
                <div className="flex-1 relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title || `Imagem ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {(image.title || image.description) && (
                  <div className="bg-white p-4">
                    {image.title && <h4 className="font-medium text-lg">{image.title}</h4>}
                    {image.description && <p className="text-gray-600 mt-1">{image.description}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {loaded && instanceRef.current && (
        <>
          <Button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
      
      {/* Pagination indicator */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-4 gap-1">
          {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === idx ? 'bg-furniture-yellow' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogImageCarousel;
