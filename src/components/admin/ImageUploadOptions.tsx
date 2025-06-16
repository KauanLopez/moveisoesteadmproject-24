import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadOptionsProps {
  onFileSubmit: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isUploading: boolean;
}

const ImageUploadOptions: React.FC<ImageUploadOptionsProps> = ({ onFileSubmit, onUrlSubmit, isUploading }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Erro", description: "Por favor, selecione apenas arquivos de imagem.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Erro", description: "O arquivo deve ter no máximo 5MB.", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      setImageUrl(''); // Clear URL input if a file is selected
    }
  };

  const handleFileFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onFileSubmit(selectedFile);
      setSelectedFile(null); // Reset after submit
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast({ title: "Erro", description: "Por favor, insira uma URL válida.", variant: "destructive" });
      return;
    }
    try {
      new URL(imageUrl);
      onUrlSubmit(imageUrl.trim());
      setImageUrl(''); // Reset after submit
    } catch {
      toast({ title: "Erro", description: "Por favor, insira uma URL válida.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleFileFormSubmit} className="border rounded-lg p-4 space-y-3">
        <h5 className="font-medium flex items-center gap-2"><Upload className="h-4 w-4" />Opção A: Fazer Upload do Dispositivo</h5>
        <div className="flex gap-2 items-center">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Escolher Arquivo
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload-revised" />
            <Button type="submit" disabled={!selectedFile || isUploading} className="flex-shrink-0">
                <Send className="h-4 w-4 mr-2" />
                Enviar
            </Button>
        </div>
        {selectedFile && <p className="text-sm text-green-600 mt-2">✓ Arquivo selecionado: {selectedFile.name}</p>}
      </form>
      
      <form onSubmit={handleUrlFormSubmit} className="border rounded-lg p-4 space-y-3">
        <h5 className="font-medium flex items-center gap-2"><Link className="h-4 w-4" />Opção B: Inserir a partir de URL</h5>
        <div className="flex gap-2">
          <Input type="url" placeholder="https://exemplo.com/imagem.jpg" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); }} disabled={isUploading} className="flex-1" />
          <Button type="submit" disabled={!imageUrl || isUploading}>
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploadOptions;