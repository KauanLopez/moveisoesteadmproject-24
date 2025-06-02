// src/config/routes.ts
export interface NavRoute {
  path: string;
  label: string;
  isExternal?: boolean;
}

export const navRoutes: NavRoute[] = [
  {
    path: '/#hero', // Leva para a seção com id="hero"
    label: 'Início'
  },
  {
    path: '/#catalogs', // Leva para a seção com id="catalogs"
    label: 'Produtos'
  },
  {
    path: '/#about', // Leva para a seção com id="about"
    label: 'Sobre'
  },
  // Mantém a rota para a página de catálogo completo, que é filtrada na navbar
  // para não aparecer como um link de navegação principal, mas pode ser usada em outros lugares.
  {
    path: '/catalogo', 
    label: 'Catálogo Completo'
  }
];