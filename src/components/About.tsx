
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre a Móveis Oeste</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Com 22 anos de experiência, a Móveis Oeste oferece móveis planejados e peças avulsas que unem elegância, funcionalidade e qualidade. Nosso compromisso é transformar ambientes em espaços únicos, com produtos selecionados cuidadosamente para refletir o estilo e as necessidades de cada cliente. Mais do que móveis, entregamos confiança, bom gosto e um atendimento próximo, construído ao longo de duas décadas de dedicação.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
