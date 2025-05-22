
import React from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

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
  
  const validateFile = (file: File): boolean => {
    // Validar tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return false;
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Utilize JPG, PNG ou WebP.",
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
      }
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL da Imagem
        </label>
        <Input
          type="text"
          value={imageUrl}
          onChange={onImageUrlChange}
          placeholder="https://exemplo.com/imagem.jpg"
          disabled={isUploading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ou faça upload de uma imagem
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="text-sm text-blue-500">Enviando...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContentImageUploader;
