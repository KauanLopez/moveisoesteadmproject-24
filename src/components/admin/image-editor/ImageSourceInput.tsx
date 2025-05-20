
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

interface ImageSourceInputProps {
  initialUrl: string;
  onUrlChange: (url: string) => void;
  onFileUpload: (file: File) => void;
}

const ImageSourceInput: React.FC<ImageSourceInputProps> = ({
  initialUrl,
  onUrlChange,
  onFileUpload
}) => {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleApplyUrl = () => {
    onUrlChange(imageUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Image URL Input */}
      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="flex-grow"
          />
          <Button onClick={handleApplyUrl}>Aplicar</Button>
        </div>
      </div>
      
      {/* File Upload */}
      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Carregar do Dispositivo</label>
        <div className="flex space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Image className="mr-2 h-4 w-4" />
            Escolher Arquivo
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImageSourceInput;
