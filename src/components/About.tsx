
import React from 'react';

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
    image: "https://images.unsplash.com/photo-1588629565261-13f6023ed6cb?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Mesa de Centro",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=1972&auto=format&fit=crop"
  }
];

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

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Produtos em Destaque</h3>
          
          <div className="carousel-container">
            <div className="auto-carousel">
              {/* Double the products for seamless infinite scroll */}
              {[...products, ...products].map((product, index) => (
                <div key={index} className="px-4 min-w-[300px]">
                  <div className="hover-scale rounded-lg overflow-hidden shadow-md transition-all duration-300">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h4 className="font-medium text-lg text-primary">{product.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
