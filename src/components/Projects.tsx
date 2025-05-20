
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';

const projects = [
  {
    id: 1,
    title: "Sala de Estar Moderna",
    description: "Redesenho completo com sofá personalizado e peças de destaque",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Quarto de Luxo",
    description: "Conjunto elegante de quarto com cabeceira personalizada e criados-mudos",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Escritório Minimalista",
    description: "Espaço de trabalho limpo e funcional com armazenamento integrado",
    image: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Experiência Gastronômica",
    description: "Mesa personalizada com cadeiras combinando para reuniões familiares",
    image: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1974&auto=format&fit=crop"
  }
];

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true
  });
  
  React.useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };
  
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Trabalho em Residências</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Navegue por nossos projetos concluídos e veja como nossos móveis transformam espaços.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto px-10 md:px-16 relative">
          {/* Botões de navegação posicionados fora das imagens */}
          <Button 
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute top-1/2 -left-14 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2 z-10 shadow-md"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            onClick={() => emblaApi?.scrollNext()}
            className="absolute top-1/2 -right-14 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2 z-10 shadow-md"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Carrossel centralizado */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {projects.map((project) => (
                <div key={project.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      <p className="text-white/80 mt-2">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicadores (bolinhas) */}
          <div className="flex justify-center mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full mx-2 transition-colors ${
                  currentIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
