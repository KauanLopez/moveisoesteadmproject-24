
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Link, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateImageUrl } from '@/services/urlImageService';

interface ContentImageUploaderProps {
  imageUrl: string;
  imageFile: File | null;
  isUploading: boolean;
  onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContentImageUploader: React.FC<ContentImageUploaderProps> = ({
  imageUrl,
  imageFile,
  isUploading,
  onImageUrlChange,
  onFileChange
}) => {
  const { toast } = useToast();
  const [urlError, setUrlError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    // Validar tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const error = "O tamanho máximo permitido é 5MB.";
      setFileError(error);
      toast({
        title: "Arquivo muito grande",
        description: error,
        variant: "destructive"
      });
      return false;
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const error = "Utilize JPG, PNG ou WebP.";
      setFileError(error);
      toast({
        title: "Formato não suportado",
        description: error,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileChange(e);
      } else {
        // Clear the input
        e.target.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlError(null);
    const url = e.target.value;
    
    // Validate URL if not empty
    if (url && !validateImageUrl(url)) {
      setUrlError("URL não parece ser de uma imagem válida. Certifique-se de que termina com .jpg, .png, .webp ou similar.");
    }
    
    onImageUrlChange(e);
  };

  const clearFile = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    setFileError(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Link className="inline-block w-4 h-4 mr-1" />
          URL da Imagem
        </label>
        <Input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://exemplo.com/imagem.jpg"
          disabled={isUploading}
          className={urlError ? "border-red-500" : ""}
        />
        {urlError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{urlError}</AlertDescription>
          </Alert>
        )}
        {imageUrl && !urlError && (
          <p className="text-sm text-green-600 mt-1">✓ URL válida</p>
        )}
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Ou faça upload de uma imagem
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, WebP até 5MB
                </span>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        {fileError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}
        
        {imageFile && !fileError && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
            <span className="text-sm text-green-700">
              ✓ {imageFile.name} ({Math.round(imageFile.size / 1024)}KB)
            </span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={clearFile}
              disabled={isUploading}
            >
              Remover
            </Button>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Enviando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentImageUploader;
