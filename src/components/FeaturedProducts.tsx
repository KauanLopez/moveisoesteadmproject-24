
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductImageDialog from './featured/ProductImageDialog';
import ProductCarousel from './featured/ProductCarousel';
import { useContent } from '@/context/ContentContext';
import { ImageContent } from '@/types/customTypes';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<{
    src: string;
    position: string;
    scale: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { content } = useContent();
  const products = content.filter(item => item.section === 'products');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Verificação inicial
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleImageClick = (product: ImageContent) => {
    setSelectedImage(product.image);
    setSelectedImageData({
      src: product.image,
      position: product.objectPosition || 'center',
      scale: product.scale || 1
    });
  };

  if (products.length === 0) {
    return <div className="py-16 text-center">Nenhum produto em destaque disponível.</div>;
  }

  return (
    <section id="featured-products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>

        <ProductCarousel 
          products={products}
          isMobile={isMobile}
          onImageClick={handleImageClick}
        />
        
        <div className="mt-12 text-center">
          <Button variant="default" className="gap-2" size="lg">
            Entre em contato para saber mais
          </Button>
        </div>
      </div>

      {/* Modal de imagem em tela cheia */}
      <ProductImageDialog
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        selectedImage={selectedImage}
        position={selectedImageData?.position}
        scale={selectedImageData?.scale}
      />
    </section>
  );
};

export default FeaturedProducts;
