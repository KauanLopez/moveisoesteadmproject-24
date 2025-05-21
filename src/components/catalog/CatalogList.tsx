
import React from 'react';
import { Catalog } from '@/types/catalogTypes';
import CatalogCard from './CatalogCard';

interface CatalogListProps {
  catalogs: Catalog[];
}

export const CatalogList: React.FC<CatalogListProps> = ({ catalogs }) => {
  if (catalogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Nenhum catálogo encontrado.</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {catalogs.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </div>
      </div>
    </section>
  );
};
