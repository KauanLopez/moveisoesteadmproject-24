
import React, { useState, useRef, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2 } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState([]);
  const carouselApi = useRef<{ scrollNext: () => void } | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load content from localStorage
  useEffect(() => {
    const storedContent = localStorage.getItem('moveis_oeste_content');
    if (storedContent) {
      const allContent = JSON.parse(storedContent);
      const productItems = allContent.filter((item: any) => item.section === 'products');
      setProducts(productItems);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Verificação inicial
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
    <section id="featured-products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>

        {products.length > 0 && (
          <div className="relative px-4">
            <Carousel 
              opts={{
                align: "center", // Centraliza os itens
                loop: true,
                dragFree: false, // Desativa dragFree para obter efeito magnético
                containScroll: "trimSnaps",
              }}
              className="w-full"
              setApi={handleCarouselApiChange}
            >
              <CarouselContent>
                {products.map((product: any) => (
                  <CarouselItem 
                    key={product.id} 
                    className={`pl-4 ${isMobile ? 'basis-3/4' : 'basis-1/4 md:basis-1/3'}`}
                  >
                    <div className="relative hover-scale rounded-lg overflow-hidden shadow-md transition-all duration-300 group">
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: product.objectPosition || 'center' }}
                        />
                        <button 
                          onClick={() => setSelectedImage(product.image)}
                          className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          aria-label="Ver em tela cheia"
                        >
                          <Maximize2 className="h-5 w-5 text-gray-800" />
                        </button>
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-medium text-lg text-primary">{product.title}</h4>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </div>

      {/* Modal de imagem em tela cheia */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
          <DialogTitle>
            <VisuallyHidden>Visualização em tela cheia</VisuallyHidden>
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage || ''} 
              alt="Visualização em tela cheia" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedProducts;
