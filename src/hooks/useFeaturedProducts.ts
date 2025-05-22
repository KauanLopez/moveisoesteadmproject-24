
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getFavoriteItems } from "@/services/favoriteService";
import { mapDbContentToImageContent } from '@/types/customTypes';

export interface FeaturedProduct {
  id: string;
  title: string;
  image: string;
  objectPosition?: string;
  scale?: number;
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // First try to load products from featured items (favorites)
        const favoriteItems = await getFavoriteItems();
        
        if (favoriteItems && favoriteItems.length > 0) {
          const mappedProducts = favoriteItems.map(item => ({
            id: item.id,
            title: item.title || 'Produto em destaque',
            image: item.image_url || '',
            objectPosition: 'center',  // Default value
            scale: 1  // Default value
          }));
          setProducts(mappedProducts);
        } else {
          // Fallback to regular content
          const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('section', 'products');
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setProducts(data.map(mapDbContentToImageContent));
          } else {
            // Fallback to localStorage
            fallbackToLocalStorage();
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      const storedContent = localStorage.getItem('moveis_oeste_content');
      if (storedContent) {
        const allContent = JSON.parse(storedContent);
        const productItems = allContent.filter((item: any) => item.section === 'products');
        setProducts(productItems);
      }
    };
    
    loadProducts();
  }, []);

  return { products, loading };
};
