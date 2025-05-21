
import { supabase } from "@/integrations/supabase/client";
import { ImageContent, mapDbContentToImageContent, mapImageContentToDb } from '@/types/customTypes';
import { defaultContent, CONTENT_STORAGE_KEY } from '@/utils/contentUtils';

// Fetch content from Supabase
export const fetchContentFromSupabase = async (): Promise<ImageContent[] | null> => {
  try {
    const { data: dbContent, error } = await supabase
      .from('content')
      .select('*');

    if (error) {
      console.error('Error fetching content from Supabase:', error);
      return null;
    }

    if (dbContent && dbContent.length > 0) {
      return dbContent.map(mapDbContentToImageContent);
    }
    
    return null;
  } catch (err) {
    console.error('Error in content fetching:', err);
    return null;
  }
};

// Save initial default content to Supabase
export const saveDefaultContentToSupabase = async (): Promise<void> => {
  try {
    for (const item of defaultContent) {
      const mappedItem = mapImageContentToDb(item);
      // Make sure section is always included since it's required
      if (mappedItem && mappedItem.section) {
        await supabase
          .from('content')
          .upsert({
            ...mappedItem,
            section: mappedItem.section
          });
      }
    }
  } catch (err) {
    console.error('Error saving default content to Supabase:', err);
  }
};

// Save content to Supabase
export const saveContentToSupabase = async (content: ImageContent[]): Promise<void> => {
  try {
    for (const item of content) {
      const mappedItem = mapImageContentToDb(item);
      // Make sure section is always included since it's required
      if (mappedItem && mappedItem.section) {
        const { error } = await supabase
          .from('content')
          .upsert({
            ...mappedItem,
            section: mappedItem.section
          });
        
        if (error) {
          throw error;
        }
      }
    }
    
    // Also save to localStorage as backup
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.error('Error saving content:', error);
    // Still save to localStorage even if Supabase fails
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    throw error;
  }
};

// Get content from localStorage
export const getContentFromLocalStorage = (): ImageContent[] => {
  const storedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
  if (storedContent) {
    return JSON.parse(storedContent);
  }
  return defaultContent;
};
