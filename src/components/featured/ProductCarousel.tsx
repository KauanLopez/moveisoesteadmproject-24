
import React, { useState, useRef, useEffect } from 'react';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import ProductCarouselItem from './ProductCarouselItem';
import { FeaturedProduct } from '@/hooks/useFeaturedProducts';

interface ProductCarouselProps {
  products: FeaturedProduct[];
  isMobile: boolean;
  onImageClick: (product: FeaturedProduct) => void;
}

const ProductCarousel = ({ products, isMobile, onImageClick }: ProductCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const carouselApi = useRef<any>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startAutoScroll = () => {
      if (carouselApi.current && !isPaused) {
        autoScrollTimerRef.current = setInterval(() => {
          if (document.visibilityState === 'visible') {
            carouselApi.current?.scrollNext();
          }
        }, isMobile ? 2000 : 4000);
      }
    };

    const clearAutoScroll = () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    };

    clearAutoScroll(); // Limpa timer existente
    startAutoScroll(); // Inicia novo timer se não estiver pausado

    return clearAutoScroll;
  }, [isPaused, isMobile]);

  const handleCarouselApiChange = (api: any) => {
    carouselApi.current = api;
    
    if (api) {
      // Adiciona eventos para pausar/continuar autoscroll durante drag
      api.on('pointerDown', () => setIsPaused(true));
      api.on('pointerUp', () => setIsPaused(false));
      api.on('dragStart', () => setIsPaused(true));
      api.on('dragEnd', () => setIsPaused(false));
    }
  };

  return (
    <div className="relative px-4">
      <Carousel 
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
        className="w-full"
        setApi={handleCarouselApiChange}
      >
        <CarouselContent>
          {products.map((product) => (
            <ProductCarouselItem 
              key={product.id}
              product={product}
              isMobile={isMobile}
              onImageClick={onImageClick}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
