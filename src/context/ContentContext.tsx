import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ImageContent, mapDbContentToImageContent, mapImageContentToDb } from '@/types/customTypes';

// Default content based on current site data
const defaultContent: ImageContent[] = [
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

const CONTENT_STORAGE_KEY = 'moveis_oeste_content';

type ContentContextType = {
  content: ImageContent[];
  updateContent: (id: string, updates: Partial<ImageContent>) => void;
  saveContent: () => Promise<void>;
  addContent: (newItem: ImageContent) => void;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ImageContent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load content from Supabase
        const { data: dbContent, error } = await supabase
          .from('content')
          .select('*');

        if (error) {
          console.error('Error fetching content from Supabase:', error);
          // Fallback to localStorage if Supabase fails
          fallbackToLocalStorage();
          return;
        }

        if (dbContent && dbContent.length > 0) {
          // Map the database content to our ImageContent format
          const mappedContent = dbContent.map(mapDbContentToImageContent);
          setContent(mappedContent);
        } else {
          // If no content in database, use default and save it
          setContent(defaultContent);
          // Save default content to Supabase
          for (const item of defaultContent) {
            await supabase
              .from('content')
              .upsert(mapImageContentToDb(item));
          }
        }
      } catch (err) {
        console.error('Error in content loading:', err);
        fallbackToLocalStorage();
      } finally {
        setIsLoaded(true);
      }
    };

    const fallbackToLocalStorage = () => {
      const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (storedContent) {
        setContent(JSON.parse(storedContent));
      } else {
        setContent(defaultContent);
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(defaultContent));
      }
    };

    loadContent();
  }, []);

  const updateContent = (id: string, updates: Partial<ImageContent>) => {
    setContent(prevContent => 
      prevContent.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const saveContent = async () => {
    try {
      // Save to Supabase
      for (const item of content) {
        const { error } = await supabase
          .from('content')
          .upsert(mapImageContentToDb(item));
        
        if (error) {
          throw error;
        }
      }
      
      // Also save to localStorage as backup
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving content:', error);
      // Still save to localStorage even if Supabase fails
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      return Promise.reject(error);
    }
  };
  
  const addContent = (newItem: ImageContent) => {
    setContent(prevContent => [...prevContent, newItem]);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, saveContent, addContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export { ImageContent };
