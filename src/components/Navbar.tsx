import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Certifique-se que este é o botão shadcn/ui
import { navRoutes } from '@/config/routes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ... (useEffect para scroll e resize) ...

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filteredRoutes = navRoutes.filter(route => route.path !== '/catalogo');
  const whatsappLink = "https://wa.me/554435321521"; 

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center"> {/* items-center alinha verticalmente */}
          <div className="flex-shrink-0 pl-2">
            <Link to="/" className="flex items-center"> {/* flex items-center também ajuda */}
              <img
                src="/LogoNavBar.svg" 
                alt="Móveis Oeste"
                className="h-10 w-auto object-contain" // Altura da logo definida como h-10
              />
            </Link>
          </div>

          {/* ... (nav links) ... */}

          <div className="hidden md:flex flex-shrink-0 pr-2">
            {/* Botão usa o tamanho padrão que é h-10 */}
            <Button asChild> 
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>

          {/* ... (menu mobile button) ... */}
        </div>
      </div>

      {/* ... (menu mobile dropdown) ... */}
    </header>
  );
};

export default Navbar;