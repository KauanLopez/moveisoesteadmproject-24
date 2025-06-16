
import { useState, useEffect } from 'react';
import { featuredProductsService } from '@/services/supabaseService';
import { FeaturedProduct } from '@/types/customTypes';
import { ImageContent } from '@/types/customTypes';

export const useFeaturedProducts = (): { products: ImageContent[], loading: boolean } => {
  const [products, setProducts] = useState<ImageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        console.log('useFeaturedProducts: Loading featured products from Supabase...');
        
        const featuredProducts = await featuredProductsService.getFeaturedProducts();
        console.log('useFeaturedProducts: Loaded products:', featuredProducts);
        
        // Convert FeaturedProduct to ImageContent format
        const mappedProducts: ImageContent[] = featuredProducts.map((product: FeaturedProduct) => ({
          id: product.id,
          image: product.image_url,
          title: product.title || 'Produto em Destaque',
          description: product.description || '',
          section: 'products',
          objectPosition: 'center',
          scale: 1
        }));
        
        console.log('useFeaturedProducts: Mapped products:', mappedProducts);
        setProducts(mappedProducts);
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
