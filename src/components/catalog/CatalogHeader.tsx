
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CatalogHeader = () => {
  return (
    <section className="pt-16 pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Catálogos
          </h1>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-6"></div>
          <p className="text-base md:text-lg text-gray-700 mb-8">
            Conheça nossa linha completa de móveis planejados e peças avulsas para todos os ambientes da sua casa.
          </p>
          <div className="flex justify-center">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <span>Voltar para a página inicial</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
