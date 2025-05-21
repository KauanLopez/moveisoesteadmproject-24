
import React, { useState, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import CatalogFilter from './CatalogFilter';
import CatalogItem from './CatalogItem';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ImageContent } from '@/types/customTypes';

const CatalogGrid = () => {
  const { content } = useContent();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<ImageContent | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ImageContent[]>([]);

  // Filter products based on the active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducts(content.filter(item => item.section === 'products'));
    } else {
      const filtered = content.filter(item => 
        item.section === 'products' && 
        item.title.toLowerCase().includes(activeFilter.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [activeFilter, content]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleImageClick = (product: ImageContent) => {
    setSelectedImage(product);
  };

  const productCategories = [
    { id: 'all', label: 'Todos' },
    { id: 'sofa', label: 'Sofás' },
    { id: 'mesa', label: 'Mesas' },
    { id: 'cadeira', label: 'Cadeiras' },
    { id: 'cama', label: 'Camas' },
    { id: 'estante', label: 'Estantes' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <CatalogFilter 
          categories={productCategories}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map((product) => (
            <CatalogItem 
              key={product.id}
              product={product}
              onClick={() => handleImageClick(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Nenhum produto encontrado com o filtro selecionado.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
          <VisuallyHidden>Visualização em tela cheia</VisuallyHidden>
          {selectedImage && (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-700 mb-4">{selectedImage.description}</p>
              )}
              <div className="relative w-full h-full max-h-[60vh]">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-[60vh] object-contain mx-auto"
                  style={{
                    objectPosition: selectedImage.objectPosition,
                    transform: `scale(${selectedImage.scale || 1})`
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CatalogGrid;
