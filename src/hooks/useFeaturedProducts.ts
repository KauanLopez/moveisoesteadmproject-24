
import { useState, useEffect } from 'react';
import { getFavoriteItems } from "@/services/favoriteService";
import { ImageContent, mapDbContentToImageContent } from '@/types/customTypes';

export const useFeaturedProducts = (): { products: ImageContent[], loading: boolean } => {
  const [products, setProducts] = useState<ImageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // First try to load products from featured items (favorites)
        const favoriteItems = await getFavoriteItems();
        
        if (favoriteItems && favoriteItems.length > 0) {
          // Use mapDbContentToImageContent for consistency
          setProducts(favoriteItems.map(mapDbContentToImageContent));
        } else {
          // Fallback to localStorage
          const storedContent = localStorage.getItem('moveis_oeste_content');
          if (storedContent) {
            const allContent = JSON.parse(storedContent);
            const productItems = allContent.filter((item: any) => item.section === 'products');
            setProducts(productItems.map(mapDbContentToImageContent));
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to localStorage in case of error
        const storedContent = localStorage.getItem('moveis_oeste_content');
        if (storedContent) {
          const allContent = JSON.parse(storedContent);
          const productItems = allContent.filter((item: any) => item.section === 'products');
          setProducts(productItems.map(mapDbContentToImageContent));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return { products, loading };
};
