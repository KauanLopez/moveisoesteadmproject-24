
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

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filtra as rotas para remover a rota de catálogo
  const filteredRoutes = navRoutes.filter(route => route.path !== '/catalogo');

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo - Left Side with increased padding */}
          <div className="flex-shrink-0 pl-2">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/636b600d-cab1-4922-9a44-7868ac3d73e5.png"
                alt="Móveis Oeste"
                className="h-14 md:h-17 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Centered Navigation Links - Desktop Only */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {filteredRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Contact Button - Right Side with increased padding */}
          <div className="hidden md:flex flex-shrink-0 pr-2">
            <Button asChild>
              <a href="#contato">Contato</a>
            </Button>
          </div>

          {/* Menu Hambúrguer para Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 transition-all duration-300">
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
              <a href="#contato">Contato</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
