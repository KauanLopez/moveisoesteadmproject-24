
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Upload, Link } from 'lucide-react';

interface CreateCatalogModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; description: string; coverImage: string }) => void;
}

const CreateCatalogModal: React.FC<CreateCatalogModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && coverImage.trim()) {
      onCreate({
        name: name.trim(),
        description: description.trim(),
        coverImage: coverImage.trim()
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Catálogo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Catálogo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Móveis de Sala"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Frase Breve</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Sofás, mesas e móveis modernos"
              rows={2}
              required
            />
          </div>

          <div>
            <Label>Capa do Catálogo</Label>
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
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                required
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
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                {coverImage ? (
                  <div>
                    <img src={coverImage} alt="Preview" className="max-h-32 mx-auto mb-2 rounded" />
                    <p className="text-sm text-green-600">Imagem carregada com sucesso!</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Arraste uma imagem aqui ou clique para selecionar
                    </p>
                  </div>
                )}
              </div>
            )}

            {coverImage && useUrl && (
              <div className="mt-2">
                <img src={coverImage} alt="Preview" className="max-h-32 mx-auto rounded" />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim() || !description.trim() || !coverImage.trim()}>
              Criar Catálogo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCatalogModal;
