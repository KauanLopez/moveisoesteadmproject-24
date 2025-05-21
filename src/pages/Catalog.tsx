
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatalogGrid from '@/components/catalog/CatalogGrid';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';

const Catalog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <CatalogHeader />
        <CatalogGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
