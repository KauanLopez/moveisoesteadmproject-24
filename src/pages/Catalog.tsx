
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CatalogGrid from '@/components/catalog/CatalogGrid';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ContentProvider } from '@/context/ContentContext';

const Catalog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <ContentProvider>
        <main className="flex-grow">
          <CatalogHeader />
          <CatalogGrid />
        </main>
      </ContentProvider>
      
      <Footer />
    </div>
  );
};

export default Catalog;
