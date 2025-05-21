
import { ImageContent, ContentItem } from '@/types/customTypes';

// Default content based on current site data
export const defaultContent: ImageContent[] = [
  // Projects section
  {
    id: 'project1',
    section: 'projects',
    title: "Sala de Estar Moderna",
    description: "Redesenho completo com sofá personalizado e peças de destaque",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'project2',
    section: 'projects',
    title: "Quarto de Luxo",
    description: "Conjunto elegante de quarto com cabeceira personalizada e criados-mudos",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'project3',
    section: 'projects',
    title: "Escritório Minimalista",
    description: "Espaço de trabalho limpo e funcional com armazenamento integrado",
    image: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1974&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'project4',
    section: 'projects',
    title: "Experiência Gastronômica",
    description: "Mesa personalizada com cadeiras combinando para reuniões familiares",
    image: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1974&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  // Featured products section
  {
    id: 'product1',
    section: 'products',
    title: "Sofá Moderno",
    description: "",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'product2',
    section: 'products',
    title: "Mesa de Jantar",
    description: "",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1974&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'product3',
    section: 'products',
    title: "Cadeira de Escritório",
    description: "",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2068&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'product4',
    section: 'products',
    title: "Estrutura de Cama",
    description: "",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'product5',
    section: 'products',
    title: "Estante",
    description: "",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1970&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  {
    id: 'product6',
    section: 'products',
    title: "Mesa de Centro",
    description: "",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1974&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  },
  // Manager section
  {
    id: 'manager1',
    section: 'manager',
    title: "Adriana Marconi",
    description: "Adriana é a gerente responsável por conduzir a Móveis Oeste com dedicação, carinho e um olhar apurado para o que há de melhor em móveis planejados e peças avulsas. Com anos de experiência no setor moveleiro, ela acompanha de perto cada etapa, desde o atendimento ao cliente até a entrega do produto final, garantindo que cada ambiente seja pensado com funcionalidade, beleza e personalidade.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    objectPosition: 'center',
    scale: 1
  }
];

// Constants
export const CONTENT_STORAGE_KEY = 'moveis_oeste_content';
