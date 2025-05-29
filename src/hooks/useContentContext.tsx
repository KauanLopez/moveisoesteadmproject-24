
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ImageContent } from '@/types/customTypes';
import { localStorageService } from '@/services/localStorageService';

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
  const mapStorageContentToImageContent = (storageContent: any): ImageContent => {
    return {
      id: storageContent.id,
      section: storageContent.section,
      title: storageContent.title || '',
      description: storageContent.description || '',
      image: storageContent.image_url || '',
      objectPosition: storageContent.object_position || 'center',
      scale: storageContent.scale || 1
    };
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Initialize default data if needed
        localStorageService.initializeDefaultData();
        
        // Load content from localStorage
        const storageContent = localStorageService.getContent();
        
        if (storageContent && storageContent.length > 0) {
          console.log('Loaded content from localStorage:', storageContent);
          const mappedContent = storageContent.map(mapStorageContentToImageContent);
          setContent(mappedContent);
        }
      } catch (err) {
        console.error('Error in content loading:', err);
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
      // Save all content to localStorage
      const storageContent = content.map(item => ({
        id: item.id,
        section: item.section,
        title: item.title,
        description: item.description,
        image_url: item.image,
        object_position: item.objectPosition,
        scale: item.scale
      }));
      
      localStorageService.setContent(storageContent);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  const addContent = (newItem: ImageContent) => {
    setContent(prevContent => [...prevContent, newItem]);
    
    // Also save to localStorage
    const storageItem = {
      id: newItem.id,
      section: newItem.section,
      title: newItem.title,
      description: newItem.description,
      image_url: newItem.image,
      object_position: newItem.objectPosition,
      scale: newItem.scale
    };
    
    localStorageService.addContent(storageItem);
  };
  
  const deleteContent = async (id: string): Promise<boolean> => {
    try {
      localStorageService.deleteContent(id);
      
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
