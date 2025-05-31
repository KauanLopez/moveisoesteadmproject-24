import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Zap } from 'lucide-react'; // Adicionado Zap para um ícone mais dinâmico
import ContactForm from './ContactForm';

const CTA = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section 
      id="contato" // Adicionado ID para o link de navegação
      className="py-20 md:py-24 bg-gradient-to-br from-furniture-green to-green-700 text-white relative overflow-hidden"
    >
      {/* Elemento decorativo opcional */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-12 -right-12 w-60 h-60 bg-furniture-yellow/10 rounded-full opacity-70"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <Zap className="mx-auto h-12 w-12 text-furniture-yellow mb-4" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Pronto para Transformar <br className="hidden sm:block" /> Seu Espaço?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Nossa equipe está pronta para ajudar você a criar ambientes únicos e funcionais. 
          Entre em contato e solicite um orçamento sem compromisso!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-furniture-yellow text-green-900 hover:bg-yellow-300 text-base font-semibold px-8 py-3 shadow-lg transform transition-transform hover:scale-105"
            onClick={() => setShowContactForm(true)}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Enviar Mensagem Agora
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white text-white hover:bg-white hover:text-furniture-green text-base font-semibold px-8 py-3 shadow-lg transform transition-transform hover:scale-105"
            onClick={() => window.open('https://wa.me/554435321521', '_blank')} // Telefone atualizado
          >
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon" // Usar size="icon" para botões de ícone
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 z-20"
              onClick={() => setShowContactForm(false)}
              aria-label="Fechar formulário"
            >
              <X className="h-5 w-5" />
            </Button>
            {/* Adicionar um padding ao container do formulário dentro do modal */}
            <div className="p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTA;