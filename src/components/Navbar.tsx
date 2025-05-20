
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-furniture-green font-bold text-xl md:text-2xl">Móveis Oeste</a>
        </div>
        
        {/* Desktop Menu - links alterados para branco quando não rolado */}
        <div className="hidden md:flex space-x-8">
          <a href="#about" className={`${isScrolled || isOpen ? 'text-gray-700' : 'text-[#eee]'} hover:text-primary font-medium`}>Sobre Nós</a>
          <a href="#projects" className={`${isScrolled || isOpen ? 'text-gray-700' : 'text-[#eee]'} hover:text-primary font-medium`}>Nosso Trabalho</a>
          <a href="#location" className={`${isScrolled || isOpen ? 'text-gray-700' : 'text-[#eee]'} hover:text-primary font-medium`}>Localização</a>
        </div>
        
        <div className="hidden md:block">
          <Button className="bg-furniture-green hover:bg-furniture-green/90 text-white">
            Fale Conosco
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className={`${isScrolled || isOpen ? 'text-gray-700' : 'text-white'}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="#about" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Sobre Nós</a>
            <a href="#projects" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Nosso Trabalho</a>
            <a href="#location" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Localização</a>
            <Button className="bg-furniture-green hover:bg-furniture-green/90 text-white w-full">
              Fale Conosco
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
