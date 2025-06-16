import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductImageDialog from './featured/ProductImageDialog';
import ModernProductCarousel from './featured/ModernProductCarousel';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { products, loading } = useFeaturedProducts(); // Apenas usamos o que vem do hook

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

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Carregando produtos...</p>
          </div>
        ) : products.length > 0 ? (
          <ModernProductCarousel 
            products={products} // Usando diretamente os produtos do hook
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>Nenhum produto em destaque no momento.</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            variant="default" 
            className="gap-2" 
            size="lg"
            onClick={() => window.open('https://wa.me/554435321521', '_blank')}
          >
            Entre em contato para saber mais
          </Button>
        </div>
      </div>

      <ProductImageDialog
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        selectedImage={selectedImage}
      />
    </section>
  );
};

export default FeaturedProducts;