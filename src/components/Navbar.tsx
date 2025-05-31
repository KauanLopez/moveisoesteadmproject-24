import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navRoutes } from '@/config/routes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Verifica o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu ao redimensionar para desktop e gerencia o overflow do body
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 pl-2">
            <Link to="/" className="flex items-center">
              <img
                src="/LogoNavBar.svg" {/* CAMINHO DA LOGO ATUALIZADO */}
                alt="Móveis Oeste"
                className="h-10 w-auto object-contain" 
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {filteredRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`${
                  isScrolled || isMenuOpen ? 'text-gray-700' : 'text-white'
                } hover:text-primary transition-colors font-medium`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-shrink-0 pr-2">
            <Button asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>

          <button
            onClick={toggleMenu}
            className={`md:hidden ${ isScrolled || isMenuOpen ? 'text-gray-700' : 'text-white'} hover:text-primary transition-colors`}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 transition-all duration-300 ease-in-out"
        >
          <nav className="flex flex-col space-y-4">
            {filteredRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <Button
              asChild
              className="w-full mt-2"
              onClick={() => setIsMenuOpen(false)} 
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;