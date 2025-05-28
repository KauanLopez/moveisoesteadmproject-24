
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ImageContent } from '@/types/customTypes';
import { defaultContent } from '@/utils/contentUtils';
import { dbOperations } from '@/lib/supabase-helpers';

type ContentContextType = {
  content: ImageContent[];
  updateContent: (id: string, updates: Partial<ImageContent>) => void;
  saveContent: () => Promise<void>;
  addContent: (newItem: ImageContent) => void;
  deleteContent: (id: string) => Promise<boolean>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ImageContent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to map database content to ImageContent
  const mapDbContentToImageContent = (dbContent: any): ImageContent => {
    return {
      id: dbContent.id,
      section: dbContent.section,
      title: dbContent.title || '',
      description: dbContent.description || '',
      image: dbContent.image_url || '',
      objectPosition: dbContent.object_position || 'center',
      scale: dbContent.scale || 1
    };
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load content from Supabase
        const { data, error } = await dbOperations.content.selectAll();
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('Loaded content from Supabase:', data);
          const mappedContent = data.map(mapDbContentToImageContent);
          setContent(mappedContent);
        } else {
          console.log('No content in database, using default content');
          setContent(defaultContent);
          // Save default content to Supabase
          for (const item of defaultContent) {
            const dbItem = {
              id: item.id,
              section: item.section,
              title: item.title,
              description: item.description,
              image_url: item.image,
              object_position: item.objectPosition,
              scale: item.scale
            };
            
            await dbOperations.content.upsert(dbItem);
          }
        }
      } catch (err) {
        console.error('Error in content loading:', err);
        // Fallback to default content if Supabase fails
        setContent(defaultContent);
      } finally {
        setIsLoaded(true);
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
      // Save all content to Supabase
      for (const item of content) {
        const dbItem = {
          id: item.id,
          section: item.section,
          title: item.title,
          description: item.description,
          image_url: item.image,
          object_position: item.objectPosition,
          scale: item.scale
        };
        
        const { error } = await dbOperations.content.upsert(dbItem);
          
        if (error) throw error;
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  const addContent = (newItem: ImageContent) => {
    setContent(prevContent => [...prevContent, newItem]);
  };
  
  const deleteContent = async (id: string): Promise<boolean> => {
    try {
      const { error } = await dbOperations.content.delete(id);
        
      if (error) throw error;
      
      // Update local state
      setContent(prevContent => prevContent.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateContent, 
      saveContent, 
      addContent,
      deleteContent
    }}>
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
