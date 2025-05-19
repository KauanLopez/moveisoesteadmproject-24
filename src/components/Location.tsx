
import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Location = () => {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Venha nos Conhecer</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Visite nossa loja para explorar nossa coleção e receber assistência personalizada.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 overflow-hidden rounded-lg shadow-md">
            <div className="h-full w-full min-h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.2773509598815!2d-47.30372242370787!3d-23.521613560378063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf5d75f7b31f4f%3A0xaa27bece7bf51de7!2sAv.+Jo%C3%A3o+Teot%C3%B4nio+Moreira+S%C3%A1les+Neto%2C+877+-+Neto%2C+819!5e0!3m2!1spt-BR!2sbr!4v1716339587063!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Móveis Oeste"
              ></iframe>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-primary mb-6">Informações da Loja</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Endereço</h4>
                  <p className="text-gray-600">
                    Av. João Teotônio Moreira Sáles Neto, 877 – Neto, 819<br />
                    São Paulo, Brasil
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Horário de Funcionamento</h4>
                  <p className="text-gray-600">
                    Segunda - Sexta: 9:00 - 19:00<br />
                    Sábado: 10:00 - 18:00<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Telefone</h4>
                  <p className="text-gray-600">+55 11 9123 4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
                  <p className="text-gray-600">info@moveisooeste.com.br</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-8 bg-furniture-green hover:bg-furniture-green/90 text-white">
              Agendar uma Visita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
