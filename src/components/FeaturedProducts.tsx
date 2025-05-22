
import React, { useState, useRef, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Maximize2, LayoutGrid } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { supabase } from "@/integrations/supabase/client";
import { getFavoriteItems } from "@/services/favoriteService";
import { ImageContent, mapDbContentToImageContent } from '@/types/customTypes';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<{
    src: string;
    position: string;
    scale: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselApi = useRef<{ scrollNext: () => void } | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const productItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // First try to load products from featured items (favorites)
        const favoriteItems = await getFavoriteItems();
        
        if (favoriteItems && favoriteItems.length > 0) {
          const mappedProducts = favoriteItems.map(item => ({
            id: item.id,
            title: item.title || (item.catalog_items?.title || 'Produto em destaque'),
            image: item.image || item.catalog_items?.image_url,
            objectPosition: item.object_position || 'center',
            scale: item.scale || 1
          }));
          setProducts(mappedProducts);
        } else {
          // Fallback to regular content
          const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('section', 'products');
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setProducts(data.map(mapDbContentToImageContent));
          } else {
            // Fallback to localStorage
            fallbackToLocalStorage();
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      const storedContent = localStorage.getItem('moveis_oeste_content');
      if (storedContent) {
        const allContent = JSON.parse(storedContent);
        const productItems = allContent.filter((item: any) => item.section === 'products');
        setProducts(productItems);
      }
    };
    
    loadProducts();
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

  const handleImageClick = (product: any) => {
    setSelectedImage(product.image);
    setSelectedImageData({
      src: product.image,
      position: product.objectPosition || 'center',
      scale: product.scale || 1
    });
  };

  if (loading) {
    return <div className="py-16 text-center">Carregando produtos...</div>;
  }

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
                align: "center",
                loop: true,
                dragFree: false,
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
                    <div 
                      ref={productItemRef}
                      className="relative hover-scale rounded-lg overflow-hidden shadow-md transition-all duration-300 group"
                    >
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                          style={{ 
                            objectPosition: product.objectPosition || 'center',
                            transform: product.scale ? `scale(${product.scale})` : 'scale(1)'
                          }}
                        />
                        <button 
                          onClick={() => handleImageClick(product)}
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
        
        {/* New button to link to catalog page */}
        <div className="mt-12 text-center">
          <Link to="/catalogo">
            <Button variant="default" className="gap-2" size="lg">
              <LayoutGrid className="h-5 w-5" />
              Ver Catálogo Completo
            </Button>
          </Link>
        </div>
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
              style={selectedImageData ? {
                objectPosition: selectedImageData.position,
                transform: `scale(${selectedImageData.scale})`
              } : {}}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedProducts;
