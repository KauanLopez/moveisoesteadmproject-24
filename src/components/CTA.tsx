
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import ContactForm from './ContactForm';

const CTA = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section className="py-16 bg-furniture-green text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para Transformar Seu Espaço?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Entre em contato conosco e descubra como podemos criar os móveis sob medida perfeitos para você.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-furniture-green hover:bg-gray-100"
            onClick={() => setShowContactForm(true)}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Enviar Mensagem
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-furniture-green"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full p-2 z-10"
              onClick={() => setShowContactForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <ContactForm />
          </div>
        </div>
      )}
    </section>
  );
};

export default CTA;
