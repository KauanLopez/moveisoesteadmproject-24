
import React from 'react';

const Manager = () => {
  return (
    <section id="team" className="pt-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Conheça Nosso Gerente</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 rounded-xl overflow-hidden shadow-lg">
            <div className="w-full md:w-2/5 pt-6 md:pt-0 px-6 md:px-0">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
                alt="Gerente da Loja" 
                className="w-full h-64 md:h-full object-cover object-center rounded-lg md:rounded-none"
              />
            </div>
            <div className="p-8 w-full md:w-3/5">
              <h3 className="text-2xl font-bold text-primary mb-2">Adriana Marconi</h3>
              <p className="text-gray-500 mb-4">Gerente da Loja</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
Adriana é a gerente responsável por conduzir a Móveis Oeste com dedicação, carinho e um olhar apurado para o que há de melhor em móveis planejados e peças avulsas. Com anos de experiência no setor moveleiro, ela acompanha de perto cada etapa, desde o atendimento ao cliente até a entrega do produto final, garantindo que cada ambiente seja pensado com funcionalidade, beleza e personalidade. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manager;
