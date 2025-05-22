
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

interface CatalogImageUploadFormProps {
  onUpload: (file: File, title: string, description: string) => Promise<boolean | undefined>;
  uploading: boolean;
  error: string | null;
}

const CatalogImageUploadForm: React.FC<CatalogImageUploadFormProps> = ({ 
  onUpload, 
  uploading,
  error 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const success = await onUpload(file, title, description);
    
    if (success) {
      // Reset form fields on success
      setTitle('');
      setDescription('');
      
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Adicionar Nova Imagem</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 border border-red-200 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Erro</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
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
  );
};

export default CatalogImageUploadForm;
