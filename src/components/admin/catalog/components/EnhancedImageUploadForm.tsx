
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, Plus, Upload, Link, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { uploadCatalogImage } from '@/services/imageService';
import { uploadImageFromUrl, validateImageUrl } from '@/services/urlImageService';

interface EnhancedImageUploadFormProps {
  onUpload: (file: File, title: string, description: string) => Promise<boolean | undefined>;
  onUrlUpload?: (imageUrl: string, title: string, description: string) => Promise<boolean | undefined>;
  uploading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  bucketName?: 'catalog-images' | 'catalog-covers';
}

const EnhancedImageUploadForm: React.FC<EnhancedImageUploadFormProps> = ({ 
  onUpload, 
  onUrlUpload,
  uploading,
  error,
  isAuthenticated,
  bucketName = 'catalog-images'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [urlValidated, setUrlValidated] = useState(false);
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

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setUrlValidated(false);
    setLocalError(null);
    
    if (url && validateImageUrl(url)) {
      setUrlValidated(true);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!selectedFile) {
      setLocalError("Por favor, selecione uma imagem.");
      return;
    }
    
    if (!isAuthenticated) {
      setLocalError("Usuário não autenticado. Por favor, faça login.");
      return;
    }
    
    try {
      const success = await onUpload(selectedFile, title, description);
      
      if (success) {
        // Reset form fields on success
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        
        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error: any) {
      setLocalError(error.message || "Erro ao processar upload da imagem.");
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!imageUrl) {
      setLocalError("Por favor, forneça uma URL válida.");
      return;
    }
    
    if (!validateImageUrl(imageUrl)) {
      setLocalError("URL não parece ser de uma imagem válida.");
      return;
    }
    
    if (!isAuthenticated) {
      setLocalError("Usuário não autenticado. Por favor, faça login.");
      return;
    }
    
    try {
      // Use the URL upload service if available, otherwise upload directly
      if (onUrlUpload) {
        const success = await onUrlUpload(imageUrl, title, description);
        if (success) {
          setTitle('');
          setDescription('');
          setImageUrl('');
          setUrlValidated(false);
        }
      } else {
        // Fallback: download and upload as file
        const uploadedUrl = await uploadImageFromUrl(imageUrl, bucketName);
        if (uploadedUrl) {
          toast({
            title: "Upload concluído",
            description: "Imagem carregada da URL com sucesso."
          });
          setTitle('');
          setDescription('');
          setImageUrl('');
          setUrlValidated(false);
        }
      }
    } catch (error: any) {
      setLocalError(error.message || "Erro ao processar upload da URL.");
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado para adicionar imagens.
          Por favor, faça login para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Adicionar Nova Imagem</h3>
      
      {(error || localError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="w-4 h-4 mr-2" />
            Upload de Arquivo
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="w-4 h-4 mr-2" />
            Upload por URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título (opcional)</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da imagem"
                disabled={uploading}
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
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="file-upload">Selecionar Arquivo</Label>
              <Input 
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full"
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Imagem
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="url">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title-url">Título (opcional)</Label>
              <Input 
                id="title-url"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da imagem"
                disabled={uploading}
              />
            </div>
            
            <div>
              <Label htmlFor="description-url">Descrição (opcional)</Label>
              <Textarea 
                id="description-url"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da imagem"
                rows={2}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="image-url">URL da Imagem</Label>
              <div className="relative">
                <Input 
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  disabled={uploading}
                />
                {urlValidated && (
                  <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full"
              disabled={!imageUrl || !urlValidated || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Baixando e enviando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar da URL
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedImageUploadForm;
