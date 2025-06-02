// src/config/routes.ts
export interface NavRoute {
  path: string;
  label: string;
  isExternal?: boolean; // Para links externos, se houver
}

export const navRoutes: NavRoute[] = [
  {
    path: '/#hero', // Ou simplesmente '/', assumindo que a seção Hero está no topo.
                     // Se sua seção Hero tiver um ID específico, como 'hero-section', use '/#hero-section'
    label: 'Início'
  },
  {
    path: '/#catalogs', // Alterado para apontar para a seção de catálogos
    label: 'Produtos'
  },
  {
    path: '/#about', // Alterado para apontar para a seção Sobre
    label: 'Sobre'
  },
  // A rota /catalogo (página separada) será filtrada na Navbar, conforme já implementado.
  {
    path: '/catalogo',
    label: 'Catálogo Completo' 
  }
];