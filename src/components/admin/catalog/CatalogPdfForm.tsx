
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CatalogCategory } from '@/types/catalogTypes';
import { uploadPdfFile, processPdfToImages } from '@/services/pdfService';
import { saveCatalog } from '@/services/catalogService';
import CatalogPdfUploadForm from './components/CatalogPdfUploadForm';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface CatalogPdfFormProps {
  onClose: (shouldRefresh: boolean) => void;
  categories: CatalogCategory[];
}

const CatalogPdfForm: React.FC<CatalogPdfFormProps> = ({ onClose, categories }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handlePdfUpload = async (
    pdfFile: File | null, 
    pdfUrl: string, 
    title: string, 
    description: string,
    categoryId: string
  ): Promise<boolean | undefined> => {
    setUploading(true);
    setError(null);

    try {
      let finalPdfUrl = pdfUrl;

      // Upload PDF file if provided
      if (pdfFile) {
        console.log('Uploading PDF file:', pdfFile.name);
        finalPdfUrl = await uploadPdfFile(pdfFile);
      }

      if (!finalPdfUrl) {
        throw new Error('URL do PDF é obrigatória.');
      }

      // Create catalog first
      const catalogData = {
        title,
        description: description || null,
        category_id: categoryId || null,
        pdf_file_url: finalPdfUrl,
        pdf_filename: pdfFile?.name || null,
        cover_image: '', // Will be set after PDF processing
        total_pages: 0, // Will be set after PDF processing
      };

      console.log('Creating catalog with data:', catalogData);
      const newCatalog = await saveCatalog(catalogData);
      
      if (!newCatalog) {
        throw new Error('Falha ao criar catálogo.');
      }

      // Process PDF and extract pages
      console.log('Processing PDF to extract pages...');
      const result = await processPdfToImages(finalPdfUrl, newCatalog.id);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Catálogo PDF criado com sucesso! ${result.pagesCount} páginas extraídas.`,
        });
        return true;
      } else {
        throw new Error('Falha ao processar o PDF.');
      }
    } catch (error: any) {
      console.error('Error creating PDF catalog:', error);
      setError(error.message || 'Erro ao criar catálogo PDF.');
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar catálogo PDF.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Novo Catálogo PDF</CardTitle>
        <Button 
          variant="ghost" 
          onClick={() => onClose(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </CardHeader>
      <CardContent>
        <CatalogPdfUploadForm
          onUpload={handlePdfUpload}
          uploading={uploading}
          error={error}
          isAuthenticated={isAuthenticated}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default CatalogPdfForm;
