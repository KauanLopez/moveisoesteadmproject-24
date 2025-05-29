
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CatalogItem } from '@/types/catalogTypes';
import { fetchCatalogItems, deleteCatalogItem, saveCatalogItem } from '@/services/catalogService';
import { uploadCatalogImage } from '@/services/imageService';
import { useAuth } from '@/context/AuthContext';

export const useCatalogImages = (catalogId: string) => {
  const [images, setImages] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // Check authentication status when the hook is initialized
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        setError("Usuário não autenticado. Por favor, faça login para continuar.");
        setLoading(false);
      } else {
        // Clear error if user is authenticated
        setError(null);
        loadImages();
      }
    };
    
    checkAuth();
  }, [isAuthenticated, catalogId]);

  // Load existing catalog images
  const loadImages = async () => {
    if (!isAuthenticated) {
      setError("Usuário não autenticado. Por favor, faça login.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const items = await fetchCatalogItems(catalogId);
      setImages(items);
    } catch (error: any) {
      console.error('Error loading catalog images:', error);
      setError(error.message || "Não foi possível carregar as imagens do catálogo.");
      toast({
        title: "Erro ao carregar imagens",
        description: error.message || "Não foi possível carregar as imagens do catálogo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File, title: string, description: string) => {
    if (!file) return false;
    
    setError(null);

    // Check authentication first
    if (!isAuthenticated) {
      setError("Usuário não autenticado. Por favor, faça login.");
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para fazer upload de imagens.",
        variant: "destructive"
      });
      return false;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError("O tamanho máximo permitido é 5MB.");
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Formato não suportado. Utilize JPG, PNG ou WebP.");
      toast({
        title: "Formato não suportado",
        description: "Utilize JPG, PNG ou WebP.",
        variant: "destructive"
      });
      return false;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadCatalogImage(file, 'catalog-images');
      
      if (imageUrl) {
        // Create new catalog item with the uploaded image
        const newItem: Partial<CatalogItem> & { catalog_id: string, image_url: string } = {
          catalog_id: catalogId,
          image_url: imageUrl,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          display_order: images.length + 1
        };

        const savedItem = await saveCatalogItem(newItem);
        
        if (savedItem) {
          setImages([...images, savedItem]);
          toast({
            title: "Imagem adicionada",
            description: "A imagem foi adicionada ao catálogo com sucesso."
          });
          return true;
        }
      } else {
        throw new Error('Falha ao fazer upload da imagem');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || "Falha ao fazer upload da imagem");
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Não foi possível fazer o upload da imagem.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
    
    return false;
  };

  // Handle image deletion
  const handleDeleteImage = async (id: string) => {
    if (!isAuthenticated) {
      setError("Usuário não autenticado. Por favor, faça login.");
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para excluir imagens.",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        await deleteCatalogItem(id);
        setImages(images.filter(img => img.id !== id));
        toast({
          title: "Imagem removida",
          description: "A imagem foi removida do catálogo."
        });
      } catch (error: any) {
        console.error('Error deleting image:', error);
        toast({
          title: "Erro ao remover imagem",
          description: error.message || "Não foi possível remover a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    images,
    loading,
    uploading,
    error,
    setError,
    handleImageUpload,
    handleDeleteImage,
    isAuthenticated,
    reloadImages: loadImages
  };
};
