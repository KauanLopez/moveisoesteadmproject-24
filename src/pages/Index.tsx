
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Manager from '@/components/Manager';
import Location from '@/components/Location';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Projects />
      <About />
      <Manager />
      <CTA />
      <Location />
      <Footer />
    </div>
  );
};

export default Index;
