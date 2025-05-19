
import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-furniture-green mb-4">Moveis Oeste</h3>
            <p className="text-gray-400 mb-6">
              Crafting quality furniture that brings comfort and style to your home.
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
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-furniture-yellow hover:text-gray-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-furniture-yellow transition-colors">About Us</a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-furniture-yellow transition-colors">Our Work</a>
              </li>
              <li>
                <a href="#team" className="text-gray-400 hover:text-furniture-yellow transition-colors">Our Team</a>
              </li>
              <li>
                <a href="#location" className="text-gray-400 hover:text-furniture-yellow transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Sofas</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Beds</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Dining Tables</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Office Furniture</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-furniture-yellow transition-colors">Storage Solutions</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-400 not-italic">
              <p className="mb-2">Avenida da Liberdade, 120</p>
              <p className="mb-4">1250-142 Lisboa, Portugal</p>
              <p className="mb-2">Phone: +351 21 123 4567</p>
              <p>Email: info@moveisooeste.pt</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Moveis Oeste. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-furniture-yellow transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-furniture-yellow transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
