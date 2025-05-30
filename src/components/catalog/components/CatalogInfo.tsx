
import React from 'react';

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: Array<{ url: string; title: string }>;
}

interface CatalogInfoProps {
  catalog: Catalog;
}

const CatalogInfo: React.FC<CatalogInfoProps> = ({ catalog }) => {
  return (
    <div className="text-center px-4 md:px-6 mt-6">
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
        {catalog.name}
      </h3>
      <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
        {catalog.description}
      </p>
    </div>
  );
};

export default CatalogInfo;
