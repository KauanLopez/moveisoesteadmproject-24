
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ImageContent } from '@/types/customTypes';

interface ProductCarouselProps {
  products: ImageContent[];
  isMobile: boolean;
  onImageClick: (product: ImageContent) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products,
  isMobile,
  onImageClick
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: isMobile ? 1 : 3,
      spacing: 20,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <div 
              className="h-72 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => onImageClick(product)}
            >
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: product.objectPosition || 'center',
                  transform: product.scale ? `scale(${product.scale})` : 'scale(1)'
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium">{product.title}</h3>
              {product.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Slide anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - (isMobile ? 1 : 3)
            }
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Próximo slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
