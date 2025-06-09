
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Star, Trash2, Plus } from 'lucide-react';
import { AdminCatalog, AdminCatalogImage, updateImageInCatalog, addImageToCatalog, deleteImageFromCatalog } from '@/services/adminCatalogService';
import { useToast } from '@/components/ui/use-toast';
import ImageUploadOptions from './ImageUploadOptions';

interface CatalogImagesModalProps {
  catalog: AdminCatalog;
  onClose: () => void;
}

const CatalogImagesModal: React.FC<CatalogImagesModalProps> = ({ catalog, onClose }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [images, setImages] = useState(catalog.images);
  const { toast } = useToast();

  const handleImageSelect = (imageData: { file?: File; url?: string }) => {
    let imageUrl = '';
    
    if (imageData.file) {
      // Create a mock URL for the file
      imageUrl = URL.createObjectURL(imageData.file);
    } else if (imageData.url) {
      imageUrl = imageData.url;
    }

    if (imageUrl) {
      const newImage = addImageToCatalog(catalog.id, {
        url: imageUrl,
        isFeatured: false
      });

      if (newImage) {
        setImages([...images, newImage]);
        setShowUpload(false);
        toast({
          title: "Imagem adicionada",
          description: "A imagem foi adicionada ao catálogo com sucesso."
        });
      }
    }
  };

  const toggleFavorite = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const updatedImage = updateImageInCatalog(catalog.id, imageId, {
      isFeatured: !image.isFeatured
    });

    if (updatedImage) {
      setImages(images.map(img => 
        img.id === imageId ? updatedImage : img
      ));
      
      toast({
        title: updatedImage.isFeatured ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `A imagem foi ${updatedImage.isFeatured ? 'marcada como destaque' : 'removida do destaque'}.`
      });
    }
  };

  const deleteImage = (imageId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      const success = deleteImageFromCatalog(catalog.id, imageId);
      
      if (success) {
        setImages(images.filter(img => img.id !== imageId));
        toast({
          title: "Imagem excluída",
          description: "A imagem foi removida do catálogo."
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Imagens do Catálogo: {catalog.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {images.length} {images.length === 1 ? 'imagem' : 'imagens'} • {images.filter(img => img.isFeatured).length} em destaque
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Images Button */}
          {!showUpload && (
            <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Novas Imagens
            </Button>
          )}

          {/* Upload Form */}
          {showUpload && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <ImageUploadOptions
                  title="Adicionar Nova Imagem ao Catálogo"
                  onImageSelect={handleImageSelect}
                />
                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images Gallery */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.title || 'Imagem do catálogo'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant={image.isFeatured ? "default" : "outline"}
                        onClick={() => toggleFavorite(image.id)}
                        className="p-1 h-8 w-8"
                      >
                        <Star 
                          className={`h-4 w-4 ${image.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        className="p-1 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    {image.title && (
                      <p className="font-medium truncate">{image.title}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {image.isFeatured ? '⭐️ Em destaque' : 'Não destacado'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma imagem adicionada ainda.</p>
              <Button onClick={() => setShowUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Imagem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogImagesModal;
