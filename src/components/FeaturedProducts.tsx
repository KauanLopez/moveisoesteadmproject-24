
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import ProductImageDialog from './featured/ProductImageDialog';
import ProductCarousel from './featured/ProductCarousel';
import { useFeaturedProducts, FeaturedProduct } from '@/hooks/useFeaturedProducts';

const FeaturedProducts = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<{
    src: string;
    position: string;
    scale: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { products, loading } = useFeaturedProducts();

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

  const handleImageClick = (product: FeaturedProduct) => {
    setSelectedImage(product.image);
    setSelectedImageData({
      src: product.image,
      position: product.objectPosition || 'center',
      scale: product.scale || 1
    });
  };

  if (loading) {
    return <div className="py-16 text-center">Carregando produtos...</div>;
  }

  return (
    <section id="featured-products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>

        {products.length > 0 && (
          <ProductCarousel 
            products={products}
            isMobile={isMobile}
            onImageClick={handleImageClick}
          />
        )}
        
        {/* Button to link to catalog page */}
        <div className="mt-12 text-center">
          <Link to="/catalogo">
            <Button variant="default" className="gap-2" size="lg">
              <LayoutGrid className="h-5 w-5" />
              Ver Catálogo Completo
            </Button>
          </Link>
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
