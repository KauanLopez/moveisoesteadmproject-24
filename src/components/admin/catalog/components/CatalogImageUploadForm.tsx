
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Plus, LockIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CatalogImageUploadFormProps {
  onUpload: (file: File, title: string, description: string) => Promise<boolean | undefined>;
  uploading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const CatalogImageUploadForm: React.FC<CatalogImageUploadFormProps> = ({ 
  onUpload, 
  uploading,
  error,
  isAuthenticated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setLocalError(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    if (!isAuthenticated) {
      setLocalError("Usuário não autenticado. Por favor, faça login.");
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para fazer upload de imagens.",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("O tamanho máximo permitido é 5MB.");
      event.target.value = '';
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setLocalError("Formato não suportado. Utilize JPG, PNG ou WebP.");
      event.target.value = '';
      return;
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!selectedFile) {
      setLocalError("Por favor, selecione uma imagem para fazer upload.");
      return;
    }
    
    if (!isAuthenticated) {
      setLocalError("Usuário não autenticado. Por favor, faça login.");
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para fazer upload de imagens.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await onUpload(selectedFile, title, description);
    
    if (success) {
      // Reset form fields on success
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="mb-4">
        <LockIcon className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado para adicionar imagens ao catálogo.
          Por favor, faça login para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Adicionar Nova Imagem</h3>
      
      {(error || localError) && (
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 border border-red-200 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Erro</h4>
            <p className="text-sm text-red-700">{error || localError}</p>
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
            disabled={uploading || !isAuthenticated}
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
            disabled={uploading || !isAuthenticated}
          />
        </div>
        
        <div>
          <Label htmlFor="image" className="block mb-2">Selecionar Imagem</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading || !isAuthenticated}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          {uploading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </Button>
          ) : (
            <Button 
              type="submit"
              className="w-full"
              disabled={!selectedFile || !isAuthenticated}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Imagem
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CatalogImageUploadForm;
