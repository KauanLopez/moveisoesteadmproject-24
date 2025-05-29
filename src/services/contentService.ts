
import { ImageContent, mapDbContentToImageContent, mapImageContentToDb } from '@/types/customTypes';
import { localStorageService } from './localStorageService';

// Fetch content by section from localStorage
export const fetchContent = async (section: string): Promise<ImageContent[]> => {
  try {
    const allContent = localStorageService.getContent();
    const sectionContent = allContent.filter(item => item.section === section);
    
    return sectionContent.map(item => ({
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      image: item.image_url,
      objectPosition: item.object_position || 'center',
      scale: item.scale || 1
    }));
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error);
    return [];
  }
};

// Save content item
export const saveContent = async (item: ImageContent): Promise<ImageContent | null> => {
  try {
    const storageItem = {
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      image_url: item.image,
      object_position: item.objectPosition,
      scale: item.scale
    };
    
    localStorageService.addContent(storageItem);
    return item;
  } catch (error) {
    console.error('Error saving content:', error);
    return null;
  }
};

// Delete content item
export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    localStorageService.deleteContent(id);
    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
};

// Fetch content from localStorage
export const fetchContentFromSupabase = async (): Promise<ImageContent[] | null> => {
  try {
    const content = localStorageService.getContent();
    return content.map(item => ({
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      image: item.image_url,
      objectPosition: item.object_position || 'center',
      scale: item.scale || 1
    }));
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
};

// Save default content to localStorage
export const saveDefaultContentToSupabase = async (): Promise<void> => {
  // This is handled by localStorageService.initializeDefaultData()
};

// Save content to localStorage
export const saveContentToSupabase = async (content: ImageContent[]): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};
