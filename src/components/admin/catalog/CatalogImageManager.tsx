
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchCatalogItems, saveCatalogItem, deleteCatalogItem } from '@/services/catalogService';
import { CatalogItem } from '@/types/catalogTypes';
import { uploadCatalogImage } from '@/services/imageService';

interface CatalogImageManagerProps {
  catalogId: string;
}

const CatalogImageManager: React.FC<CatalogImageManagerProps> = ({ catalogId }) => {
  const [images, setImages] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  // Load existing catalog images
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const items = await fetchCatalogItems(catalogId);
        setImages(items);
      } catch (error) {
        console.error('Error loading catalog images:', error);
        toast({
          title: "Erro ao carregar imagens",
          description: "Não foi possível carregar as imagens do catálogo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [catalogId, toast]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho do arquivo
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Utilize JPG, PNG ou WebP.",
        variant: "destructive"
      });
      return;
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
          setTitle('');
          setDescription('');
          toast({
            title: "Imagem adicionada",
            description: "A imagem foi adicionada ao catálogo com sucesso."
          });
          
          // Reset the file input
          event.target.value = '';
        }
      } else {
        throw new Error('Falha ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer o upload da imagem. Verifique se você está logado e tem permissões.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
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

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Adicionar Nova Imagem</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título (opcional)</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da imagem"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da imagem"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="image" className="block mb-2">Selecionar Imagem</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              <div className="w-32">
                {uploading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </Button>
                ) : (
                  <label 
                    htmlFor="image" 
                    className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Escolher
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Imagens do Catálogo ({images.length})</h3>
        {loading ? (
          <p>Carregando imagens...</p>
        ) : images.length === 0 ? (
          <p>Nenhuma imagem adicionada ao catálogo.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 relative">
                  <img 
                    src={image.image_url} 
                    alt={image.title || 'Imagem do catálogo'} 
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Erro+ao+carregar';
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  {image.title && <p className="font-medium truncate">{image.title}</p>}
                  {image.description && <p className="text-sm text-gray-500 line-clamp-2">{image.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogImageManager;
