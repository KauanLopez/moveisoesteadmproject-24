
import { StoredContent } from '@/services/localStorageService';

export const defaultContent: StoredContent[] = [
  {
    id: "hero-1",
    section: "hero",
    title: "Transformando Espaços",
    description: "Móveis sob medida que refletem sua personalidade",
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
    object_position: "center",
    scale: 1
  },
  {
    id: "about-1",
    section: "about",
    title: "Nossa História",
    description: "Com mais de 20 anos de experiência, criamos móveis que contam histórias",
    image_url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
    object_position: "center",
    scale: 1
  }
];
