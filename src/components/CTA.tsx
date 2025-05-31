import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // MessageCircle e Zap removidos se não forem mais usados
import ContactForm from './ContactForm';

const CTA = () => {
  const [showContactForm, setShowContactForm] = useState(false); // Mantido caso queira reutilizar o modal no futuro

  return (
    <section 
      id="contato"
      className="py-20 md:py-24 bg-gradient-to-br from-furniture-green to-green-700 text-white relative overflow-hidden"
    >
      {/* Elementos decorativos opcionais (mantidos da sugestão anterior) */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-12 -right-12 w-60 h-60 bg-furniture-yellow/10 rounded-full opacity-70"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Ícone Zap removido */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"> {/* Cor do título alterada para text-white */}
          Pronto para Transformar <br className="hidden sm:block" /> Seu Espaço?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Nossa equipe está pronta para ajudar você a criar ambientes únicos e funcionais. 
          Entre em contato e solicite um orçamento sem compromisso!
        </p>
        
        <div className="flex justify-center items-center"> {/* Removido flex-col e sm:flex-row pois agora é só um botão */}
          {/* Botão "Enviar Mensagem Agora" removido */}
          
          <Button 
            variant="default" // Mudado para default para aplicar as cores diretamente
            size="lg" 
            className="bg-furniture-yellow text-green-900 hover:bg-yellow-400 text-base font-semibold px-8 py-3 shadow-lg transform transition-transform hover:scale-105"
            // Ajuste hover:bg-yellow-400 para um tom de amarelo mais escuro se preferir, ou use furniture-yellow/90
            onClick={() => window.open('https://wa.me/554435321521', '_blank')}
          >
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Modal de Contato (mantido caso precise no futuro, mas o botão que o abre foi removido) */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 z-20"
              onClick={() => setShowContactForm(false)}
              aria-label="Fechar formulário"
            >
              <X className="h-5 w-5" />
            </Button>
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