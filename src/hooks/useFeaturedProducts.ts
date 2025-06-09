
import { useState, useEffect } from 'react';
import { ImageContent } from '@/types/customTypes';

export const useFeaturedProducts = (): { products: ImageContent[], loading: boolean } => {
  const [products, setProducts] = useState<ImageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        console.log('useFeaturedProducts: Loading featured products...');
        
        // Load from localStorage where the main site stores content
        const storedContent = localStorage.getItem('moveis_oeste_content');
        console.log('useFeaturedProducts: Raw localStorage content:', storedContent);
        
        if (storedContent) {
          const allContent = JSON.parse(storedContent);
          console.log('useFeaturedProducts: Parsed content:', allContent);
          
          // Filter for products section and items marked as featured
          const featuredProducts = allContent.filter((item: any) => {
            const isProductSection = item.section === 'products';
            const isFeatured = item.eh_favorito === true || item.isFeatured === true;
            console.log(`useFeaturedProducts: Item ${item.id} - section: ${item.section}, eh_favorito: ${item.eh_favorito}, isFeatured: ${item.isFeatured}`);
            return isProductSection && isFeatured;
          });
          
          console.log('useFeaturedProducts: Filtered featured products:', featuredProducts);
          
          // Map to ImageContent format
          const mappedProducts: ImageContent[] = featuredProducts.map((item: any) => ({
            id: item.id,
            image: item.image_url || item.image,
            title: item.title,
            description: item.description,
            section: item.section
          }));
          
          console.log('useFeaturedProducts: Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.log('useFeaturedProducts: No content found in localStorage');
          setProducts([]);
        }
      } catch (error) {
        console.error('useFeaturedProducts: Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return { products, loading };
};
