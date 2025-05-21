
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ImageContent } from '@/types/customTypes';
import { 
  fetchContentFromSupabase, 
  saveDefaultContentToSupabase,
  saveContentToSupabase,
  getContentFromLocalStorage,
} from '@/services/contentService';
import { defaultContent } from '@/utils/contentUtils';

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
        const dbContent = await fetchContentFromSupabase();

        if (dbContent) {
          setContent(dbContent);
        } else {
          // If no content in database, use default and save it
          setContent(defaultContent);
          // Save default content to Supabase
          await saveDefaultContentToSupabase();
        }
      } catch (err) {
        console.error('Error in content loading:', err);
        // Fallback to localStorage if Supabase fails
        setContent(getContentFromLocalStorage());
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
      await saveContentToSupabase(content);
      return Promise.resolve();
    } catch (error) {
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
