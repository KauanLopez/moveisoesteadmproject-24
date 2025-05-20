
import React from 'react';

const About = () => {
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
      </div>
    </section>
  );
};

export default About;
