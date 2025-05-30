
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';
import Manager from '@/components/Manager';
import Location from '@/components/Location';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import CatalogSection from '@/components/CatalogSection';
import { ContentProvider } from '@/context/ContentContext';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContentProvider>
        <Hero />
        <FeaturedProducts />
        <CatalogSection />
        <About />
        <Manager />
        <CTA />
        <Location />
      </ContentProvider>
      <Footer />
    </div>
  );
};

export default Index;
