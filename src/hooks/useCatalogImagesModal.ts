import { useState, useEffect, useCallback } from 'react'; // <-- MUDANÇA: useCallback foi adicionado aqui
import { useToast } from '@/hooks/use-toast';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import { favoriteSyncService, SyncedCatalogImage } from '@/services/favoriteSyncService';
import { uploadCatalogImage } from '@/services/imageService';
import { externalCatalogService } from '@/services/externalCatalogService';

export const useCatalogImagesModal = (catalog: ExternalUrlCatalog) => {
  const [images, setImages] = useState<SyncedCatalogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const loadCatalogImages = useCallback(async () => {
    setLoading(true);
    try {
      // Recarrega o catálogo para obter a lista de imagens mais recente
      const updatedCatalogs = await externalCatalogService.getAllCatalogs();
      const currentCatalog = updatedCatalogs.find(c => c.id === catalog.id);

      if (currentCatalog) {
        const syncedImages = favoriteSyncService.syncCatalogImagesWithFavorites(currentCatalog);
        setImages(syncedImages);
      }
    } catch (error) {
      console.error('CatalogImagesModal: Error loading catalog images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [catalog.id]);


  useEffect(() => {
    loadCatalogImages();
  }, [loadCatalogImages]);

  const handleImageSelect = async (imageData: { file?: File; url?: string }) => {
    if (!imageData.file && !imageData.url) return;
    
    setIsUploading(true);
    try {
      let uploadedUrl: string;

      if (imageData.file) {
        // O serviço de upload já é um mock que retorna uma URL local
        uploadedUrl = await uploadCatalogImage(imageData.file, 'catalog-images');
      } else {
        // Se for URL, usamos a própria URL (assumindo que já está hospedada)
        uploadedUrl = imageData.url!;
      }

      // Adiciona a nova URL ao array de imagens de conteúdo do catálogo
      const updatedUrls = [...catalog.external_content_image_urls, uploadedUrl];

      // Atualiza o catálogo no localStorage
      await externalCatalogService.updateCatalog(catalog.id, {
        external_content_image_urls: updatedUrls,
      });

      toast({
        title: "Sucesso",
        description: "Imagem adicionada ao catálogo.",
      });

      // Recarrega as imagens para exibir a nova
      await loadCatalogImages();

    } catch (error: any) {
      console.error("Error adding image to catalog:", error);
      toast({
        title: "Erro ao adicionar imagem",
        description: error.message || "Não foi possível adicionar a imagem.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };


  const toggleFavorite = async (imageId: string) => {
    try {
      const imageIndex = images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) throw new Error('Imagem não encontrada');
      
      const image = images[imageIndex];
      const newFavoriteStatus = !image.isFavorite;
      
      const success = favoriteSyncService.updateImageFavoriteStatus(image.image, newFavoriteStatus);
      
      if (success) {
        const updatedImages = [...images];
        updatedImages[imageIndex] = { ...image, isFavorite: newFavoriteStatus };
        setImages(updatedImages);
        
        window.dispatchEvent(new CustomEvent('localStorageUpdated'));
        
        toast({
          title: newFavoriteStatus ? "Produto destacado" : "Produto removido dos destaques",
          description: newFavoriteStatus 
            ? "Item adicionado à seção 'Produtos em Destaque'."
            : "Item removido da seção 'Produtos em Destaque'.",
        });
      } else {
        throw new Error('Falha ao atualizar status de favorito');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de destaque do item.",
        variant: "destructive"
      });
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta imagem do catálogo?")) return;

    try {
        const imageToDelete = images.find(img => img.id === imageId);
        if (!imageToDelete) throw new Error("Imagem não encontrada para exclusão.");

        const updatedUrls = catalog.external_content_image_urls.filter(
            url => url !== imageToDelete.image
        );

        await externalCatalogService.updateCatalog(catalog.id, {
            external_content_image_urls: updatedUrls
        });

        toast({
            title: "Imagem removida",
            description: "A imagem foi removida do catálogo com sucesso.",
        });

        await loadCatalogImages();

    } catch (error: any) {
        console.error("Error deleting image:", error);
        toast({
            title: "Erro ao remover imagem",
            description: error.message || "Não foi possível remover a imagem.",
            variant: "destructive"
        });
    }
  };

  return {
    images,
    loading,
    isUploading, 
    handleImageSelect,
    toggleFavorite,
    deleteImage
  };
};