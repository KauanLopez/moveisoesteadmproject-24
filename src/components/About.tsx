
import React, { useState, useRef, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Maximize2 } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Sofá Moderno",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Mesa de Jantar",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Cadeira de Escritório",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2068&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Estrutura de Cama",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Estante",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1970&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Mesa de Centro",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1974&auto=format&fit=crop"
  }
];

const About = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Verifica se está em um dispositivo móvel
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

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre a Móveis Oeste</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Na Móveis Oeste, combinamos artesanato com design moderno para criar móveis 
            que valorizam seus espaços. Há mais de 15 anos, somos dedicados à 
            qualidade, durabilidade e criação de peças que contam a sua história. Cada item é 
            cuidadosamente fabricado com materiais sustentáveis e atenção a cada detalhe.
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Produtos em Destaque</h3>
          
          <div className="relative px-4">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                containScroll: "trimSnaps",
              }}
              className="w-full"
              autoPlay={true}
              autoInterval={isMobile ? 2000 : 4000} // Mais rápido em dispositivos móveis
            >
              <CarouselContent>
                {products.map((product) => (
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
                        <h4 className="font-medium text-lg text-primary">{product.name}</h4>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>

      {/* Modal de imagem em tela cheia */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent" aria-describedby="image-fullscreen">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage || ''} 
              alt="Visualização em tela cheia" 
              className="max-w-full max-h-[80vh] object-contain"
              id="image-fullscreen"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default About;
