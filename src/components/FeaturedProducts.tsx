
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductImageDialog from './featured/ProductImageDialog';
import ModernProductCarousel from './featured/ModernProductCarousel';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use the provided image URLs
  const products = [
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
          products={products}
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
