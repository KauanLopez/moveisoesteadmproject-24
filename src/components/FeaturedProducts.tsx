
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductImageDialog from './featured/ProductImageDialog';
import ModernProductCarousel from './featured/ModernProductCarousel';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { products, loading } = useFeaturedProducts();

  // Initialize localStorage with the correct featured products if not already set
  useEffect(() => {
    const initializeFeaturedProducts = () => {
      const storedContent = localStorage.getItem('moveis_oeste_content');
      let allContent = storedContent ? JSON.parse(storedContent) : [];
      
      // URLs that should be featured
      const featuredUrls = [
        'https://i.imgur.com/cprFFbE.jpeg',
        'https://i.imgur.com/52e2KQf.jpeg',
        'https://i.imgur.com/zT3javQ.jpeg',
        'https://i.imgur.com/XhMDFqh.jpeg',
        'https://i.imgur.com/FHfJvDx.jpeg',
        'https://i.imgur.com/foRmZ8L.jpeg'
      ];

      // Check if featured products are already in localStorage
      const existingFeatured = allContent.filter((item: any) => 
        item.section === 'products' && (item.eh_favorito === true || item.isFeatured === true)
      );

      // If no featured products exist, add them
      if (existingFeatured.length === 0) {
        featuredUrls.forEach((url, index) => {
          const contentItem = {
            id: `featured-${crypto.randomUUID()}`,
            image_url: url,
            image: url,
            title: `Produto ${index + 1}`,
            description: 'Produto em destaque',
            section: 'products',
            eh_favorito: true,
            isFeatured: true,
            created_at: new Date().toISOString()
          };
          allContent.push(contentItem);
        });

        localStorage.setItem('moveis_oeste_content', JSON.stringify(allContent));
        console.log('FeaturedProducts: Initialized featured products in localStorage');
      }
    };

    initializeFeaturedProducts();
  }, []);

  // Use the products from the hook if they exist, otherwise fallback to hardcoded
  const displayProducts = products.length > 0 ? products : [
    {
      id: 'product1',
      title: 'Produto 1',
      image: 'https://i.imgur.com/cprFFbE.jpeg'
    },
    {
      id: 'product2', 
      title: 'Produto 2',
      image: 'https://i.imgur.com/52e2KQf.jpeg'
    },
    {
      id: 'product3',
      title: 'Produto 3', 
      image: 'https://i.imgur.com/zT3javQ.jpeg'
    },
    {
      id: 'product4',
      title: 'Produto 4',
      image: 'https://i.imgur.com/XhMDFqh.jpeg'
    },
    {
      id: 'product5',
      title: 'Produto 5',
      image: 'https://i.imgur.com/FHfJvDx.jpeg'
    },
    {
      id: 'product6',
      title: 'Produto 6',
      image: 'https://i.imgur.com/foRmZ8L.jpeg'
    }
  ];

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <section id="featured-products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-furniture-green">Produtos em Destaque</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>

        <ModernProductCarousel 
          products={displayProducts}
          onImageClick={handleImageClick}
        />
        
        <div className="mt-12 text-center">
          <Button variant="default" className="gap-2" size="lg">
            Entre em contato para saber mais
          </Button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <ProductImageDialog
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        selectedImage={selectedImage}
      />
    </section>
  );
};

export default FeaturedProducts;
