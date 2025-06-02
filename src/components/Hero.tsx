import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom'; // Importe o Link do react-router-dom para navegação interna

const Hero = () => {
  // Link do WhatsApp - mantenha consistente com outras partes do site
  const whatsappLink = "https://wa.me/554435321521";
  // Link para a seção de catálogos
  const catalogsSectionLink = "/#catalogs"; // Usando hash link para a seção

  return (
    <section 
      id="hero" // Adicionado ID para o link "Início" da navbar, se necessário
      className="relative bg-gradient-to-r from-gray-900 via-furniture-dark to-gray-800 text-white py-20 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden"
    >
      {/* Imagem de fundo com overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40" 
        style={{ backgroundImage: "url('/placeholder-hero.jpg')" }} // Substitua pelo caminho da sua imagem de fundo real
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay escuro para legibilidade */}

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight animate-fadeInUp">
          Móveis que Contam <span className="text-furniture-yellow">Sua História</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
          Design, conforto e qualidade para transformar cada ambiente do seu lar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fadeInUp animation-delay-600">
          <Button 
            size="lg" 
            className="bg-furniture-yellow text-green-900 hover:bg-yellow-300 text-base font-semibold px-8 py-3 shadow-lg transform transition-transform hover:scale-105"
            asChild // Permite que o Button se comporte como o <a> interno
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Fale Conosco
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white text-white hover:bg-white hover:text-furniture-green text-base font-semibold px-8 py-3 shadow-lg transform transition-transform hover:scale-105"
            asChild // Permite que o Button se comporte como o RouterLink interno
          >
            <RouterLink to={catalogsSectionLink}>
              Ver Coleção
            </RouterLink>
          </Button>
        </div>
      </div>
      {/* Elementos decorativos sutis (opcional) */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;