
import React from 'react';

const Manager = () => {
  return (
    <section id="team" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Conheça Nosso Gerente</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 rounded-xl overflow-hidden shadow-lg">
            <div className="md:w-2/5">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
                alt="Gerente da Loja" 
                className="w-full h-64 md:h-full object-cover object-center"
              />
            </div>
            <div className="p-8 md:w-3/5">
              <h3 className="text-2xl font-bold text-primary mb-2">João Silva</h3>
              <p className="text-gray-500 mb-4">Gerente da Loja e Especialista em Design de Interiores</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Com mais de 15 anos de experiência em design de móveis e gerenciamento de varejo, 
                João traz paixão e expertise para cada interação com o cliente. Seu olhar atento 
                aos detalhes e compreensão da utilização do espaço já ajudou inúmeros 
                clientes a encontrar as peças perfeitas para suas casas.
              </p>
              <p className="text-gray-700 leading-relaxed">
                "Acredito que os móveis devem ser não apenas bonitos, mas também funcionais e 
                representativos de quem vive com eles. Meu objetivo é ajudar você a criar espaços 
                que contem sua história e tragam alegria para seu dia a dia."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manager;
