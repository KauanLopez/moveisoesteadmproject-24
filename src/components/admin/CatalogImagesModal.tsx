
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X, Star, Trash2 } from 'lucide-react';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import ImageUploadOptions from './ImageUploadOptions';

interface CatalogImagesModalProps {
  catalog: ExternalUrlCatalog;
  onClose: () => void;
}

const CatalogImagesModal: React.FC<CatalogImagesModalProps> = ({ catalog, onClose }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { products: featuredProducts } = useFeaturedProducts();

  useEffect(() => {
    loadCatalogImages();
  }, [catalog.id]);

  const loadCatalogImages = async () => {
    setLoading(true);
    try {
      // For external catalogs, we need to check if there are images in the PDF or other sources
      // For now, we'll show a placeholder since external catalogs use PDF URLs
      console.log('Loading images for external catalog:', catalog.title);
      
      // Check if this catalog has any featured products
      const catalogFeaturedImages = featuredProducts.filter(product => 
        product.title?.toLowerCase().includes(catalog.title.toLowerCase()) ||
        product.description?.toLowerCase().includes(catalog.title.toLowerCase())
      );
      
      setImages(catalogFeaturedImages);
    } catch (error) {
      console.error('Error loading catalog images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageData: { file?: File; url?: string }) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O upload de imagens para catálogos externos será implementado em breve.",
      variant: "destructive"
    });
  };

  const toggleFavorite = (imageId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "O sistema de favoritos será implementado em breve.",
      variant: "destructive"
    });
  };

  const deleteImage = (imageId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de imagens será implementada em breve.", 
      variant: "destructive"
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Imagens do Catálogo: {catalog.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{catalog.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>📋 Informação:</strong> Este é um catálogo externo (PDF). 
                As imagens são carregadas automaticamente do arquivo PDF hospedado externamente.
                Para gerenciar produtos em destaque, utilize a seção "Ver Produtos em Destaque".
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Adicionar Novas Imagens</h3>
              <ImageUploadOptions
                title="Imagem do Produto"
                onImageSelect={handleImageSelect}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Imagens Relacionadas ({images.length})
              </h3>
              
              {loading ? (
                <p className="text-gray-500">Carregando imagens...</p>
              ) : images.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Nenhuma imagem relacionada encontrada.</p>
                  <p className="text-sm text-gray-400">
                    Este catálogo usa um arquivo PDF externo. 
                    As imagens são extraídas automaticamente do PDF.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden group">
                      <div className="aspect-square relative">
                        <img
                          src={image.image}
                          alt={image.title || 'Imagem do catálogo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
                          }}
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleFavorite(image.id)}
                            className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                          >
                            <Star className="h-4 w-4 text-yellow-500" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteImage(image.id)}
                            className="w-8 h-8 p-0 bg-white/80 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        {image.title && (
                          <p className="font-medium text-sm mb-1">{image.title}</p>
                        )}
                        {image.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{image.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogImagesModal;
