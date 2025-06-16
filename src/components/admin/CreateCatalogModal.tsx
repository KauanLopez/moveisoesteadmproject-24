
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import ImageUploadOptions from './ImageUploadOptions';

interface CreateCatalogModalProps {
  onClose: () => void;
  onCreate: (catalog: { name: string; description: string; coverImage: string }) => void;
}

const CreateCatalogModal: React.FC<CreateCatalogModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSubmit = async (file: File) => {
    setIsUploading(true);
    try {
      // Create a mock URL for the file (in a real app, you'd upload to a server)
      const mockUrl = URL.createObjectURL(file);
      setCoverImage(mockUrl);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    setCoverImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !coverImage) return;

    setIsSubmitting(true);
    try {
      onCreate({
        name: name.trim(),
        description: description.trim(),
        coverImage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Criar Novo Catálogo</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Catálogo *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Móveis de Sala"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frase Breve
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Sofás, mesas e decoração moderna"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capa do Catálogo *
              </label>
              <ImageUploadOptions
                onFileSubmit={handleFileSubmit}
                onUrlSubmit={handleUrlSubmit}
                isUploading={isUploading}
              />
              {coverImage && (
                <div className="mt-3 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={coverImage} 
                    alt="Preview da capa" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!name.trim() || !coverImage || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Criando...' : 'Criar Catálogo'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCatalogModal;
