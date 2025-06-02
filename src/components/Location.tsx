import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Location = () => {
  const address = "Av. João Teotônio Moreira Sáles Neto, 877 - Moreira Sales-PR, 87370-000";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="location" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-furniture-green">
          Venha nos Conhecer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Informações de Contato e Endereço */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-furniture-green" /> Endereço
              </h3>
              <a 
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-600 hover:text-furniture-green transition-colors leading-relaxed block"
              >
                Av. João Teotônio Moreira Sáles Neto, 877<br />
                Moreira Sales - PR, CEP: 87370-000
              </a>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <Phone className="h-5 w-5 mr-3 text-furniture-green" /> Telefone
              </h3>
              <a href="tel:+554435321521" className="text-lg text-gray-600 hover:text-furniture-green transition-colors">
                +55 (44) 3532-1521
              </a>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <Mail className="h-5 w-5 mr-3 text-furniture-green" /> Email
              </h3>
              <a href="mailto:moveisoestems@gmail.com" className="text-lg text-gray-600 hover:text-furniture-green transition-colors">
                moveisoestems@gmail.com
              </a>
            </div>
          </div>

          {/* Mapa Incorporado */}
          <div className="rounded-lg overflow-hidden shadow-xl h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.688116903611!2d-53.01587782466881!3d-24.051104878472502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x949287b85557b237%3A0x1838636707822f26!2sM%C3%B3veis%20Oeste!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" // Substitua pela URL de incorporação correta do Google Maps
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Móveis Oeste no Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;