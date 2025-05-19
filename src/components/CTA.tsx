
import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 bg-furniture-green">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Space?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Let us help you find the perfect pieces to elevate your home's comfort and style.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-white hover:bg-gray-100 text-furniture-green font-semibold px-8">
            View Our Catalog
          </Button>
          <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/20 font-semibold px-8">
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
