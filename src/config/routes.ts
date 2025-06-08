
// src/config/routes.ts
export interface NavRoute {
  path: string;
  label: string;
  isExternal?: boolean;
  isHashLink?: boolean;
}

export const navRoutes: NavRoute[] = [
  {
    path: '#hero',
    label: 'Início',
    isHashLink: true
  },
  {
    path: '#catalogs',
    label: 'Produtos',
    isHashLink: true
  },
  {
    path: '#about',
    label: 'Sobre',
    isHashLink: true
  },
  // Mantém a rota para a página de catálogo completo, que é filtrada na navbar
  // para não aparecer como um link de navegação principal, mas pode ser usada em outros lugares.
  {
    path: '/catalogo', 
    label: 'Catálogo Completo'
  }
];
