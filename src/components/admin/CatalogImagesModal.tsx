import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { X, Star, Trash2 } from 'lucide-react';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import ImageUploadOptions from './ImageUploadOptions';

interface CatalogImagesModalProps {
  catalog: ExternalUrlCatalog;
  onClose: () => void;
}

const CatalogImagesModal: React.FC<CatalogImagesModalProps> = ({ catalog, onClose }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCatalogImages();
  }, [catalog.id]);

  const loadCatalogImages = async () => {
    setLoading(true);
    try {
      console.log('CatalogImagesModal: Loading images for catalog:', catalog.title);
      
      // For external catalogs, show the content images from the external_content_image_urls
      if (catalog.external_content_image_urls && catalog.external_content_image_urls.length > 0) {
        const catalogImages = catalog.external_content_image_urls.map((url, index) => ({
          id: `${catalog.id}-${index}`,
          image: url,
          title: `Imagem ${index + 1} - ${catalog.title}`,
          description: `Imagem do catálogo ${catalog.title}`,
          section: 'catalog',
          catalog_id: catalog.id
        }));
        
        console.log('CatalogImagesModal: Loaded catalog images:', catalogImages);
        setImages(catalogImages);
      } else {
        console.log('CatalogImagesModal: No content images found for catalog');
        setImages([]);
      }
    } catch (error) {
      console.error('CatalogImagesModal: Error loading catalog images:', error);
      setImages([]);
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

  const toggleFavorite = async (imageId: string) => {
    try {
      console.log('CatalogImagesModal: Toggling favorite for image:', imageId);
      
      // Get current content from localStorage
      const storedContent = localStorage.getItem('moveis_oeste_content');
      let allContent = storedContent ? JSON.parse(storedContent) : [];
      
      // Find the image in the content
      const imageIndex = images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) {
        throw new Error('Imagem não encontrada');
      }
      
      const image = images[imageIndex];
      
      // Create a new content item or update existing one
      const contentItem = {
        id: `featured-${imageId}`,
        image_url: image.image,
        image: image.image,
        title: image.title,
        description: image.description,
        section: 'products',
        eh_favorito: true,
        isFeatured: true,
        created_at: new Date().toISOString()
      };
      
      // Check if already exists in content
      const existingIndex = allContent.findIndex((item: any) => 
        item.id === contentItem.id || 
        (item.image_url === image.image && item.section === 'products')
      );
      
      if (existingIndex >= 0) {
        // Toggle the favorite status
        allContent[existingIndex].eh_favorito = !allContent[existingIndex].eh_favorito;
        allContent[existingIndex].isFeatured = !allContent[existingIndex].isFeatured;
      } else {
        // Add as new featured item
        allContent.push(contentItem);
      }
      
      // Save back to localStorage
      localStorage.setItem('moveis_oeste_content', JSON.stringify(allContent));
      
      toast({
        title: "Produto destacado",
        description: "Item adicionado à seção 'Produtos em Destaque' da página inicial.",
      });
    } catch (error) {
      console.error('CatalogImagesModal: Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de destaque do item.",
        variant: "destructive"
      });
    }
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
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
          <div>
            <CardTitle>Imagens do Catálogo: {catalog.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{catalog.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="space-y-6 pr-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Dica:</strong> Clique no ícone da estrela para adicionar uma imagem à seção 
                  "Produtos em Destaque" da página principal do site.
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
                  Imagens do Catálogo ({images.length})
                </h3>
                
                {loading ? (
                  <p className="text-gray-500">Carregando imagens...</p>
                ) : images.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">Nenhuma imagem encontrada neste catálogo.</p>
                    <p className="text-sm text-gray-400">
                      Este catálogo não possui imagens de conteúdo configuradas.
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
                              title="Adicionar aos produtos em destaque"
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogImagesModal;
