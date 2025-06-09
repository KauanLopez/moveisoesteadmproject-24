
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';

export const useCatalogImagesModal = (catalog: ExternalUrlCatalog) => {
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
      
      const storedContent = localStorage.getItem('moveis_oeste_content');
      let allContent = storedContent ? JSON.parse(storedContent) : [];
      
      const imageIndex = images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) {
        throw new Error('Imagem não encontrada');
      }
      
      const image = images[imageIndex];
      
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
      
      const existingIndex = allContent.findIndex((item: any) => 
        item.id === contentItem.id || 
        (item.image_url === image.image && item.section === 'products')
      );
      
      if (existingIndex >= 0) {
        allContent[existingIndex].eh_favorito = !allContent[existingIndex].eh_favorito;
        allContent[existingIndex].isFeatured = !allContent[existingIndex].isFeatured;
      } else {
        allContent.push(contentItem);
      }
      
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

  return {
    images,
    loading,
    handleImageSelect,
    toggleFavorite,
    deleteImage
  };
};
