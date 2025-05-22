
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CatalogItem } from '@/types/catalogTypes';
import { fetchCatalogItems, deleteCatalogItem, saveCatalogItem } from '@/services/catalogService';
import { uploadCatalogImage } from '@/services/imageService';
import { supabase } from '@/integrations/supabase/client';

export const useCatalogImages = (catalogId: string) => {
  const [images, setImages] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check authentication status
  const checkAuth = async () => {
    const { data: session } = await supabase.auth.getSession();
    return !!session.session;
  };

  // Load existing catalog images
  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        setError("Usuário não autenticado. Por favor, faça login.");
        setLoading(false);
        return;
      }
      
      const items = await fetchCatalogItems(catalogId);
      setImages(items);
    } catch (error) {
      console.error('Error loading catalog images:', error);
      setError("Não foi possível carregar as imagens do catálogo.");
      toast({
        title: "Erro ao carregar imagens",
        description: "Não foi possível carregar as imagens do catálogo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, [catalogId]);

  // Handle image upload
  const handleImageUpload = async (file: File, title: string, description: string) => {
    if (!file) return;
    
    setError(null);

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError("O tamanho máximo permitido é 5MB.");
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return;
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
      return;
    }

    setUploading(true);
    try {
      // Verify authentication
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        setError("Usuário não autenticado. Por favor, faça login.");
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado para fazer upload de imagens.",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }
      
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
        description: error.message || "Não foi possível fazer o upload da imagem. Verifique se você está logado e tem permissões.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        // Verify authentication
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          setError("Usuário não autenticado. Por favor, faça login.");
          toast({
            title: "Erro de autenticação",
            description: "Você precisa estar autenticado para excluir imagens.",
            variant: "destructive"
          });
          return;
        }
        
        await deleteCatalogItem(id);
        setImages(images.filter(img => img.id !== id));
        toast({
          title: "Imagem removida",
          description: "A imagem foi removida do catálogo."
        });
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: "Erro ao remover imagem",
          description: "Não foi possível remover a imagem.",
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
    handleDeleteImage
  };
};
