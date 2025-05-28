
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { uploadPdfCatalog } from '@/services/pdfCatalogService';

interface PdfCatalogUploadFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PdfCatalogUploadForm: React.FC<PdfCatalogUploadFormProps> = ({ onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Formato inválido",
          description: "Apenas arquivos PDF são permitidos.",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      await uploadPdfCatalog(file);
      toast({
        title: "Upload iniciado",
        description: "O PDF foi enviado e está sendo processado. Você será notificado quando estiver pronto.",
      });
      onComplete();
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer upload do PDF.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upload de Catálogo PDF</CardTitle>
        <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload de Catálogo PDF</h3>
          <p className="text-gray-500 mb-6">
            Selecione um arquivo PDF para criar um novo catálogo. As páginas serão automaticamente extraídas como imagens.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pdf-file">Arquivo PDF</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Arquivo selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O PDF será processado automaticamente</li>
              <li>• A primeira página se tornará a capa do catálogo</li>
              <li>• As demais páginas serão as imagens do conteúdo</li>
              <li>• Você poderá editar o título e descrição depois</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={uploading}>
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfCatalogUploadForm;
