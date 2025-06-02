import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-furniture-green">
            Sobre a Móveis Oeste
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Com 22 anos de experiência, a Móveis Oeste oferece móveis planejados e peças avulsas que unem elegância, funcionalidade e qualidade. Nosso compromisso é transformar ambientes em espaços únicos, com produtos selecionados cuidadosamente para refletir o estilo e as necessidades de cada cliente. Mais do que móveis, entregamos confiança, bom gosto e um atendimento próximo, construído ao longo de duas décadas de dedicação.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Nossa equipe é formada por artesãos dedicados e designers experientes que trabalham em colaboração para transformar matérias-primas selecionadas em móveis que não apenas embelezam, mas também enriquecem o dia a dia dos nossos clientes. Do clássico ao contemporâneo, buscamos sempre a excelência em cada detalhe.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Visite nosso showroom em Moreira Sales, Paraná, e descubra como podemos ajudar a criar o espaço dos seus sonhos.
          </p>
        </div>
        {/* Você pode adicionar imagens ou outros elementos visuais aqui se desejar */}
        {/* Exemplo:
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img src="/path-to-your-image1.jpg" alt="Showroom Móveis Oeste" className="rounded-lg shadow-xl" />
          <img src="/path-to-your-image2.jpg" alt="Detalhe de Móvel" className="rounded-lg shadow-xl" />
        </div>
        */}
      </div>
    </section>
  );
};

export default About;
