
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Upload, Link, Plus, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AdminCatalog, AdminCatalogImage, addImageToCatalog, updateImageInCatalog, deleteImageFromCatalog } from '@/services/adminCatalogService';

interface CatalogImagesModalProps {
  catalog: AdminCatalog;
  onClose: () => void;
}

const CatalogImagesModal: React.FC<CatalogImagesModalProps> = ({ catalog, onClose }) => {
  const [images, setImages] = useState<AdminCatalogImage[]>(catalog.images);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const newImage = addImageToCatalog(catalog.id, {
        url: newImageUrl.trim(),
        title: newImageTitle.trim() || undefined,
        isFeatured: false
      });

      if (newImage) {
        setImages([...images, newImage]);
        setNewImageUrl('');
        setNewImageTitle('');
        setShowAddForm(false);
        toast({
          title: "Imagem adicionada",
          description: "A imagem foi adicionada ao catálogo com sucesso."
        });
      }
    }
  };

  const handleToggleFeatured = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const updatedImage = updateImageInCatalog(catalog.id, imageId, {
      isFeatured: !image.isFeatured
    });

    if (updatedImage) {
      setImages(images.map(img => img.id === imageId ? updatedImage : img));
      toast({
        title: updatedImage.isFeatured ? "Adicionado aos destaques" : "Removido dos destaques",
        description: `A imagem foi ${updatedImage.isFeatured ? 'marcada como destaque' : 'removida dos destaques'}.`
      });
    }
  };

  const handleDeleteImage = (imageId: string) => {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Imagens - {catalog.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total: {images.length} imagens | Em destaque: {images.filter(img => img.isFeatured).length}
            </p>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Novas Imagens
            </Button>
          </div>

          {showAddForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-4">Adicionar Nova Imagem</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageTitle">Título da Imagem (opcional)</Label>
                  <Input
                    id="imageTitle"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="Ex: Sofá Moderno"
                  />
                </div>

                <div>
                  <Label>Fonte da Imagem</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant={!useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseUrl(false)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseUrl(true)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      URL
                    </Button>
                  </div>

                  {useUrl ? (
                    <Input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                      />
                      {newImageUrl ? (
                        <div>
                          <img src={newImageUrl} alt="Preview" className="max-h-32 mx-auto mb-2 rounded" />
                          <p className="text-sm text-green-600">Imagem carregada!</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Arraste imagens aqui ou clique para selecionar
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {newImageUrl && useUrl && (
                    <div className="mt-2">
                      <img src={newImageUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddImage} disabled={!newImageUrl.trim()}>
                    Adicionar Imagem
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg border">
                  <img
                    src={image.url}
                    alt={image.title || 'Imagem do catálogo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/200x200?text=Erro';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        variant={image.isFeatured ? "default" : "outline"}
                        onClick={() => handleToggleFeatured(image.id)}
                        className={image.isFeatured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      >
                        <Star className={`h-4 w-4 ${image.isFeatured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {image.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
                
                {image.title && (
                  <p className="text-sm font-medium mt-2 truncate">{image.title}</p>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma imagem adicionada a este catálogo.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogImagesModal;
