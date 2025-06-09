
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadOptionsProps {
  onImageSelect: (imageData: { file?: File; url?: string }) => void;
  currentImage?: string;
  title: string;
}

const ImageUploadOptions: React.FC<ImageUploadOptionsProps> = ({ 
  onImageSelect, 
  currentImage, 
  title 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro", 
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setImageUrl('');
      onImageSelect({ file });
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      setSelectedFile(null);
      onImageSelect({ url: imageUrl.trim() });
      toast({
        title: "Sucesso",
        description: "URL da imagem adicionada com sucesso."
      });
    } catch {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      
      {/* Current Image Preview */}
      {(currentImage || selectedFile) && (
        <div className="relative">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Option A: Upload from Device */}
      <div className="border rounded-lg p-4 space-y-3">
        <h5 className="font-medium flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Opção A: Fazer Upload do Dispositivo
        </h5>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id={`file-upload-${title}`}
          />
          <Button 
            type="button"
            variant="outline" 
            onClick={() => document.getElementById(`file-upload-${title}`)?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Escolher Arquivo do Dispositivo
          </Button>
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Arquivo selecionado: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Option B: Insert from URL */}
      <div className="border rounded-lg p-4 space-y-3">
        <h5 className="font-medium flex items-center gap-2">
          <Link className="h-4 w-4" />
          Opção B: Inserir a partir de URL
        </h5>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleUrlSubmit}>
            Usar URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadOptions;
