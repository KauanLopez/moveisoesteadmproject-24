
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { CatalogFormValues } from '../types/CatalogFormTypes';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ImageUploadFieldProps {
  form: UseFormReturn<CatalogFormValues>;
  originalImageUrl?: string;
  onFileChange: (file: File | null) => void;
  imagePreview: string | null;
  isUploading?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
  form, 
  originalImageUrl, 
  onFileChange, 
  imagePreview,
  isUploading = false
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Clear errors when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setFileError(null);
    }
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (!isAuthenticated) {
      setFileError("Você precisa estar autenticado para fazer upload de imagens.");
      e.target.value = '';
      return;
    }
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Arquivo muito grande. O tamanho máximo é 5MB.");
        e.target.value = '';
        return;
      }
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Formato de arquivo não suportado. Utilize JPG, PNG ou WebP.");
        e.target.value = '';
        return;
      }
      
      onFileChange(file);
      
      // Update the form field with a temporary placeholder
      form.setValue('cover_image', 'uploading...', { shouldValidate: true });
    }
  };

  return (
    <FormField
      control={form.control}
      name="cover_image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Imagem de Capa</FormLabel>
          {!isAuthenticated && (
            <Alert variant="destructive" className="mb-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de autenticação</AlertTitle>
              <AlertDescription>
                Você precisa estar autenticado para fazer upload de imagens.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            {/* Image URL input */}
            <FormControl>
              <Input 
                placeholder="https://..." 
                {...field} 
                disabled={!!imagePreview || isUploading || !isAuthenticated}
              />
            </FormControl>
            
            {/* File upload button */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('cover-image-upload')?.click()}
                  disabled={isUploading || !isAuthenticated}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload da Imagem
                    </>
                  )}
                </Button>
                {imagePreview && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      onFileChange(null);
                      field.onChange(originalImageUrl || '');
                      setFileError(null);
                    }}
                    disabled={isUploading || !isAuthenticated}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <input 
                id="cover-image-upload"
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || !isAuthenticated}
              />
              
              {fileError && (
                <div className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {fileError}
                </div>
              )}
            </div>
            
            {/* Image preview */}
            {(imagePreview || field.value) && (
              <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                <img 
                  src={imagePreview || field.value} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Handle image loading error
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Imagem+não+encontrada';
                  }}
                />
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
