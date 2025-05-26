
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, Upload, FileText, Link } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CatalogCategory } from '@/types/catalogTypes';

interface CatalogPdfUploadFormProps {
  onUpload: (pdfFile: File | null, pdfUrl: string, title: string, description: string, categoryId: string) => Promise<boolean | undefined>;
  uploading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  categories: CatalogCategory[];
}

const CatalogPdfUploadForm: React.FC<CatalogPdfUploadFormProps> = ({ 
  onUpload, 
  uploading,
  error,
  isAuthenticated,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');
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
        description: "Você precisa estar autenticado para fazer upload de PDFs.",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    // Validate file size (max 50MB for PDFs)
    if (file.size > 50 * 1024 * 1024) {
      setLocalError("O tamanho máximo permitido é 50MB.");
      event.target.value = '';
      return;
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setLocalError("Apenas arquivos PDF são permitidos.");
      event.target.value = '';
      return;
    }
    
    setSelectedFile(file);
    setPdfUrl(''); // Clear URL when file is selected
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPdfUrl(event.target.value);
    setLocalError(null);
    if (event.target.value) {
      setSelectedFile(null); // Clear file when URL is entered
      // Reset the file input
      const fileInput = document.getElementById('pdf') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!selectedFile && !pdfUrl) {
      setLocalError("Por favor, selecione um arquivo PDF ou forneça uma URL.");
      return;
    }
    
    if (!title.trim()) {
      setLocalError("O título é obrigatório.");
      return;
    }
    
    if (!isAuthenticated) {
      setLocalError("Usuário não autenticado. Por favor, faça login.");
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para fazer upload de PDFs.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await onUpload(selectedFile, pdfUrl, title, description, categoryId);
      
      if (success) {
        // Reset form fields on success
        setTitle('');
        setDescription('');
        setCategoryId('');
        setSelectedFile(null);
        setPdfUrl('');
        
        // Reset the file input
        const fileInput = document.getElementById('pdf') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error: any) {
      setLocalError(error.message || "Erro ao processar upload do PDF.");
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado para adicionar catálogos PDF.
          Por favor, faça login para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Adicionar Novo Catálogo PDF
      </h3>
      
      {(error || localError) && (
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Erro</h4>
            <p className="text-sm text-red-700">{error || localError}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do catálogo"
            disabled={uploading || !isAuthenticated}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={categoryId} onValueChange={setCategoryId} disabled={uploading || !isAuthenticated}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem categoria</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do catálogo"
          rows={3}
          disabled={uploading || !isAuthenticated}
        />
      </div>

      {/* Upload method selector */}
      <div className="space-y-3">
        <Label>Método de Upload</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === 'file' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setUploadMethod('file');
              setPdfUrl('');
            }}
            disabled={uploading || !isAuthenticated}
          >
            <Upload className="w-4 h-4 mr-1" />
            Arquivo
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setUploadMethod('url');
              setSelectedFile(null);
              const fileInput = document.getElementById('pdf') as HTMLInputElement;
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
          <Label htmlFor="pdf" className="block mb-2">Selecionar PDF</Label>
          <Input 
            id="pdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            disabled={uploading || !isAuthenticated}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-500 mt-1">
            Apenas arquivos PDF são aceitos. Tamanho máximo: 50MB.
          </p>
          {selectedFile && (
            <p className="text-sm text-green-600 mt-1">
              Arquivo selecionado: {selectedFile.name}
            </p>
          )}
        </div>
      ) : (
        <div>
          <Label htmlFor="pdfUrl" className="block mb-2">URL do PDF</Label>
          <Input 
            id="pdfUrl"
            type="url"
            value={pdfUrl}
            onChange={handleUrlChange}
            placeholder="https://exemplo.com/catalogo.pdf"
            disabled={uploading || !isAuthenticated}
          />
        </div>
      )}
      
      <div className="pt-4">
        {uploading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando PDF...
          </Button>
        ) : (
          <Button 
            type="submit"
            className="w-full"
            disabled={(!selectedFile && !pdfUrl) || !title.trim() || !isAuthenticated}
          >
            <Upload className="mr-2 h-4 w-4" />
            Criar Catálogo PDF
          </Button>
        )}
      </div>
    </form>
  );
};

export default CatalogPdfUploadForm;
