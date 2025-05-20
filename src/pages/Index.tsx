
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
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
      <Projects />
      <CTA />
      <About />
      <Manager />
      <Location />
      <Footer />
    </div>
  );
};

export default Index;
