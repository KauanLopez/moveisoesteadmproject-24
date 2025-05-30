
import React from 'react';

const CatalogSectionHeader: React.FC = () => {
  return (
    <div className="mb-8 md:mb-12 text-center">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Nossos Catálogos</h2>
      <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-6 md:mb-8"></div>
      <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base">
        Navegue por nossos catálogos e veja como nossos móveis transformam espaços.
      </p>
    </div>
  );
};

export default CatalogSectionHeader;
