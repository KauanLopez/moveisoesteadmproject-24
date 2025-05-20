
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [termsOpen, setTermsOpen] = React.useState(false);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-furniture-green mb-4">Móveis Oeste</h3>
            <p className="text-gray-400 mb-6">
              O cliente em primeiro lugar!
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
          
          <div className="flex flex-col">
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
                <a href="#location" className="text-gray-400 hover:text-furniture-yellow transition-colors">Contato</a>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-furniture-yellow transition-colors">Área Administrativa</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Fale Conosco</h4>
            <address className="text-gray-400 not-italic">
              <p className="mb-2">Av. João Teotônio Moreira Sáles Neto, 877</p>
              <p className="mb-4">Neto, 819 - Moreira Sales-PR</p>
              <p className="mb-2">Telefone: +55 (44) 3532-1521</p>
              <p>Email: moveisoestems@gmail.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Móveis Oeste. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <button 
              className="hover:text-furniture-yellow transition-colors"
              onClick={() => setPrivacyOpen(true)}
            >
              Política de Privacidade
            </button>
            <button 
              className="hover:text-furniture-yellow transition-colors"
              onClick={() => setTermsOpen(true)}
            >
              Termos de Serviço
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Política de Privacidade</DialogTitle>
            <DialogDescription>
              Este site respeita a sua privacidade.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-gray-700">
            <p>Este site respeita a sua privacidade. As informações fornecidas por você, como nome, e-mail e telefone, são utilizadas apenas para fins de contato e atendimento, sem serem compartilhadas com terceiros. Dados de navegação podem ser coletados de forma automática para melhorar sua experiência, sempre respeitando a legislação vigente. Ao utilizar este site, você concorda com esta política de privacidade.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termos de Serviço</DialogTitle>
            <DialogDescription>
              Termos e condições de uso do site.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-gray-700">
            <p>Ao acessar este site, o usuário declara estar de acordo com os presentes Termos de Serviço. Todo o conteúdo disponibilizado tem finalidade informativa e está sujeito a alterações sem aviso prévio. É vedada a reprodução, distribuição ou modificação de qualquer parte deste site sem autorização expressa. Reservamo-nos o direito de suspender, modificar ou encerrar, a qualquer momento, qualquer funcionalidade ou conteúdo, bem como de atualizar os termos aqui estabelecidos, cuja continuidade de uso implicará na aceitação integral das novas condições.</p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
