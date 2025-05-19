
import React from 'react';

const products = [
  {
    id: 1,
    name: "Modern Sofa",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dining Table",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Office Chair",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2068&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Bed Frame",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Bookshelf",
    image: "https://images.unsplash.com/photo-1588629565261-13f6023ed6cb?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Coffee Table",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=1972&auto=format&fit=crop"
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Moveis Oeste</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            At Moveis Oeste, we blend craftsmanship with modern design to create furniture 
            that enhances your living spaces. For over 15 years, we've been dedicated to 
            quality, durability, and creating pieces that tell your story. Each item is 
            thoughtfully crafted with sustainable materials and attention to every detail.
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Featured Products</h3>
          
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
