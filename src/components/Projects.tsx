
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: "Modern Living Room",
    description: "Complete redesign with custom sofa and accent pieces",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Luxury Bedroom",
    description: "Elegant bedroom set with custom headboard and nightstands",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Minimalist Office",
    description: "Clean, functional workspace with built-in storage",
    image: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Dining Experience",
    description: "Custom table with matching chairs for family gatherings",
    image: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1974&auto=format&fit=crop"
  }
];

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = projects.length - 1;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === maxIndex ? 0 : prevIndex + 1
    );
  };
  
  const goToPrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);
  
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Work in Homes</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Browse through our completed projects and see how our furniture transforms living spaces.
          </p>
        </div>
        
        <div className="relative">
          <div className="carousel-container overflow-hidden">
            <div 
              ref={containerRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ width: `${projects.length * 100}%` }}
            >
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="w-full md:px-4"
                  style={{ width: `${100 / projects.length}%` }}
                >
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
          
          <Button 
            onClick={goToPrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 rounded-full p-2"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Dots */}
          <div className="flex justify-center mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
