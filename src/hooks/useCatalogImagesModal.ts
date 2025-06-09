
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import { favoriteSyncService, SyncedCatalogImage } from '@/services/favoriteSyncService';

export const useCatalogImagesModal = (catalog: ExternalUrlCatalog) => {
  const [images, setImages] = useState<SyncedCatalogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCatalogImages();
  }, [catalog.id]);

  const loadCatalogImages = async () => {
    setLoading(true);
    try {
      console.log('CatalogImagesModal: Loading images for catalog:', catalog.title);
      
      // Use the sync service to get images with favorite status
      const syncedImages = favoriteSyncService.syncCatalogImagesWithFavorites(catalog);
      
      console.log('CatalogImagesModal: Loaded synced images:', syncedImages);
      setImages(syncedImages);
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
      
      const imageIndex = images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) {
        throw new Error('Imagem não encontrada');
      }
      
      const image = images[imageIndex];
      const newFavoriteStatus = !image.isFavorite;
      
      // Update in the sync service
      const success = favoriteSyncService.updateImageFavoriteStatus(image.image, newFavoriteStatus);
      
      if (success) {
        // Update local state
        const updatedImages = [...images];
        updatedImages[imageIndex] = { ...image, isFavorite: newFavoriteStatus };
        setImages(updatedImages);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('localStorageUpdated'));
        
        toast({
          title: newFavoriteStatus ? "Produto destacado" : "Produto removido dos destaques",
          description: newFavoriteStatus 
            ? "Item adicionado à seção 'Produtos em Destaque' da página inicial."
            : "Item removido da seção 'Produtos em Destaque' da página inicial.",
        });
      } else {
        throw new Error('Falha ao atualizar status de favorito');
      }
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
