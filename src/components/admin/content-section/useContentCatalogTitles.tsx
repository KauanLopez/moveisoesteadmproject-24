
import { useState, useEffect } from 'react';
import { ImageContent } from '@/types/customTypes';
import { dbOperations } from '@/lib/supabase-helpers';

export const useContentCatalogTitles = (items: ImageContent[], section: string) => {
  const [catalogTitles, setCatalogTitles] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (section === 'projects') {
      const fetchCatalogTitles = async () => {
        try {
          // For each catalog item, try to fetch its title from the catalogs table
          const titles: Record<string, string> = {};
          
          for (const item of items) {
            // Check if we already have this catalog's title
            if (!titles[item.id]) {
              const { data } = await dbOperations.catalogs.selectById(item.id);
                
              if (data) {
                titles[item.id] = data.title;
              }
            }
          }
          
          setCatalogTitles(titles);
        } catch (error) {
          console.error('Error fetching catalog titles:', error);
        }
      };
      
      if (items.length > 0) {
        fetchCatalogTitles();
      }
    }
  }, [items, section]);

  return catalogTitles;
};
