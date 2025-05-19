
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-furniture-green mb-4">Móveis Oeste</h3>
            <p className="text-gray-400 mb-6">
              Fabricando móveis de qualidade que trazem conforto e estilo para sua casa.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-furniture-yellow hover:text-gray-900 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-furniture-yellow hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Início</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-furniture-yellow transition-colors">Sobre Nós</a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-furniture-yellow transition-colors">Nosso Trabalho</a>
              </li>
              <li>
                <a href="#team" className="text-gray-400 hover:text-furniture-yellow transition-colors">Nossa Equipe</a>
              </li>
              <li>
                <a href="#location" className="text-gray-400 hover:text-furniture-yellow transition-colors">Contato</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Sofás</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Camas</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Mesas de Jantar</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Móveis de Escritório</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Soluções de Armazenamento</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Fale Conosco</h4>
            <address className="text-gray-400 not-italic">
              <p className="mb-2">Av. João Teotônio Moreira Sáles Neto, 877</p>
              <p className="mb-4">Neto, 819 - São Paulo, Brasil</p>
              <p className="mb-2">Telefone: +55 11 9123 4567</p>
              <p>Email: info@moveisooeste.com.br</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Móveis Oeste. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-furniture-yellow transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-furniture-yellow transition-colors">Termos de Serviço</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
