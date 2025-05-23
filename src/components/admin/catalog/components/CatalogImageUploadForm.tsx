
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Plus, LockIcon, Link } from 'lucide-react';
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
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
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
    setImageUrl(''); // Clear URL when file is selected
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
    setLocalError(null);
    if (event.target.value) {
      setSelectedFile(null); // Clear file when URL is entered
      // Reset the file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const createFileFromUrl = async (url: string): Promise<File> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível baixar a imagem da URL fornecida.');
    }
    
    const blob = await response.blob();
    const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!selectedFile && !imageUrl) {
      setLocalError("Por favor, selecione uma imagem ou forneça uma URL.");
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
    
    try {
      let fileToUpload = selectedFile;
      
      // If using URL method, convert URL to file
      if (imageUrl && !selectedFile) {
        try {
          fileToUpload = await createFileFromUrl(imageUrl);
        } catch (error) {
          setLocalError("Erro ao baixar imagem da URL. Verifique se a URL é válida e acessível.");
          return;
        }
      }
      
      if (!fileToUpload) {
        setLocalError("Erro ao processar a imagem. Tente novamente.");
        return;
      }
      
      const success = await onUpload(fileToUpload, title, description);
      
      if (success) {
        // Reset form fields on success
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setImageUrl('');
        
        // Reset the file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error: any) {
      setLocalError(error.message || "Erro ao processar upload da imagem.");
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

        {/* Upload method selector */}
        <div className="space-y-2">
          <Label>Método de Upload</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUploadMethod('file');
                setImageUrl('');
              }}
              disabled={uploading || !isAuthenticated}
            >
              Arquivo
            </Button>
            <Button
              type="button"
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUploadMethod('url');
                setSelectedFile(null);
                const fileInput = document.getElementById('image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              disabled={uploading || !isAuthenticated}
            >
              <Link className="w-4 h-4 mr-1" />
              URL
            </Button>
          </div>
        </div>
        
        {uploadMethod === 'file' ? (
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
        ) : (
          <div>
            <Label htmlFor="imageUrl" className="block mb-2">URL da Imagem</Label>
            <Input 
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://exemplo.com/imagem.jpg"
              disabled={uploading || !isAuthenticated}
            />
          </div>
        )}
        
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
              disabled={(!selectedFile && !imageUrl) || !isAuthenticated}
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
