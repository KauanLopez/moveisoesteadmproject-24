
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, Plus, Upload, Link, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  const [urlUploading, setUrlUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return false;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

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

    if (!validateFile(file)) {
      setLocalError("Arquivo inválido. Verifique o tamanho (máx 5MB) e formato (JPG, PNG, WebP).");
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
        
        toast({
          title: "Upload concluído",
          description: "Imagem enviada com sucesso."
        });
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
    
    setUrlUploading(true);
    
    try {
      if (onUrlUpload) {
        const success = await onUrlUpload(imageUrl, title, description);
        if (success) {
          setTitle('');
          setDescription('');
          setImageUrl('');
          setUrlValidated(false);
          toast({
            title: "Upload concluído",
            description: "Imagem carregada da URL com sucesso."
          });
        }
      } else {
        // Fallback: use the URL upload service directly
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
    } finally {
      setUrlUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
              <div className="mt-1 flex items-center space-x-2">
                <Input 
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSelectedFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {selectedFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">
                    ✓ {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                  </p>
                </div>
              )}
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
                disabled={uploading || urlUploading}
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
                disabled={uploading || urlUploading}
              />
            </div>

            <div>
              <Label htmlFor="image-url">URL da Imagem</Label>
              <div className="relative mt-1">
                <Input 
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  disabled={uploading || urlUploading}
                  className={urlValidated ? "pr-10" : ""}
                />
                {urlValidated && (
                  <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              
              {imageUrl && !urlValidated && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ Verifique se a URL é de uma imagem válida
                </p>
              )}
            </div>
            
            <Button 
              type="submit"
              className="w-full"
              disabled={!imageUrl || !urlValidated || uploading || urlUploading}
            >
              {(uploading || urlUploading) ? (
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
