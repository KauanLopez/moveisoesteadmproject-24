import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Location = () => {
  // A URL do mapa no seu código original era "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.4422198224024!2d-53.01357242465488!3d-24.050726978466596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f292fba2531207%3A0x646ce8edaafefdd2!2sM%C3%B3veis%20Oeste!5e0!3m2!1spt-BR!2sbr!4v1747766612823!5m2!1spt-BR!2sbr"
  // Esta ainda é uma URL genérica. Você precisará substituí-la pela URL de incorporação correta do Google Maps para o seu endereço.
  // Exemplo de como obter:
  // 1. Vá para o Google Maps.
  // 2. Pesquise o endereço da sua loja.
  // 3. Clique em "Compartilhar".
  // 4. Clique na aba "Incorporar um mapa".
  // 5. Copie o SRC do iframe.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.4426449052667!2d-53.0109939!3d-24.050711999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f292fb07fc4d27%3A0x17c5c4cfdf3c3cb3!2sAv.%20Jo%C3%A3o%20Teot%C3%B4nio%20Moreira%20S%C3%A1les%20Neto%2C%20877%20-%20Moreira%20Sales%2C%20PR%2C%2087370-000!5e0!3m2!1spt-BR!2sbr!4v1748903878106!5m2!1spt-BR!2sbr"; // Ex: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."

  return (
    <section id="location" className="py-16 bg-gray-50"> {/* Mantido py-16 do seu original */}
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-furniture-green"> {/* FONTE E COR AJUSTADAS */}
            Venha nos Conhecer
          </h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Visite nossa loja para explorar nossa coleção e receber assistência personalizada.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 overflow-hidden rounded-lg shadow-md">
            <div className="h-full w-full min-h-[400px]"> {/* Garante altura mínima para o iframe */}
              <iframe 
                src={mapEmbedUrl} // Use a variável com a URL correta
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} // allowFullScreen sem valor é booleano true, mas false é mais explícito se não quiser
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Móveis Oeste"
              ></iframe>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-display font-semibold text-furniture-green mb-6"> {/* Título secundário também com font-display e cor ajustada */}
              Informações da Loja
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-furniture-green/10 p-3 rounded-full mr-4 mt-1"> {/* Fundo do ícone com verde */}
                  <MapPin className="h-5 w-5 text-furniture-green" /> {/* Ícone verde */}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 font-display">Endereço</h4> {/* Adicionado font-display */}
                  <p className="text-gray-600">
                    Av. João Teotônio Moreira Sáles Neto, 877 - Neto, 819 - Centro, Moreira Sales - PR, 87370-000
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-furniture-green/10 p-3 rounded-full mr-4 mt-1">
                  <Clock className="h-5 w-5 text-furniture-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 font-display">Horário de Funcionamento</h4> {/* Adicionado font-display */}
                  <p className="text-gray-600">
                    Segunda - Sexta: 8:00 - 18:00<br />
                    Sábado: 08:00 - 12:00<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-furniture-green/10 p-3 rounded-full mr-4 mt-1">
                  <Phone className="h-5 w-5 text-furniture-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 font-display">Telefone</h4> {/* Adicionado font-display */}
                  <p className="text-gray-600">
                    <a href="tel:+554435321521" className="hover:text-furniture-green">+55 (44) 3532-1521</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-furniture-green/10 p-3 rounded-full mr-4 mt-1">
                  <Mail className="h-5 w-5 text-furniture-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 font-display">Email</h4> {/* Adicionado font-display */}
                  <p className="text-gray-600">
                    <a href="mailto:moveisoestems@gmail.com" className="hover:text-furniture-green">moveisoestems@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* O botão "Agendar uma Visita" pode ter o mesmo estilo do botão WhatsApp da CTA se desejar */}
            <Button 
              className="w-full mt-8 bg-furniture-yellow text-green-900 hover:bg-yellow-400 font-semibold"
              onClick={() => window.open('https://wa.me/554435321521', '_blank')} // Exemplo: Agendar via WhatsApp
            >
              Agendar uma Visita via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;