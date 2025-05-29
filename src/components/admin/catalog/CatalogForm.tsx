
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Catalog, CatalogCategory } from '@/types/catalogTypes';
import { uploadCatalogImage } from '@/services/imageService';
import { saveCatalog } from '@/services/catalogService';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

// Import our new components
import CatalogTitleField from './form-components/CatalogTitleField';
import CatalogDescriptionField from './form-components/CatalogDescriptionField';
import CategoryField from './form-components/CategoryField';
import ImageUploadField from './form-components/ImageUploadField';
import FormActions from './form-components/FormActions';
import { catalogFormSchema, CatalogFormValues } from './types/CatalogFormTypes';
import { useAuth } from '@/context/AuthContext';

interface CatalogFormProps {
  catalog: Catalog | null;
  categories: CatalogCategory[];
  onClose: (shouldRefresh: boolean) => void;
}

const CatalogForm: React.FC<CatalogFormProps> = ({ catalog, categories, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: {
      title: catalog?.title || '',
      description: catalog?.description || '',
      cover_image: catalog?.cover_image || '',
      category_id: catalog?.category_id || '',
    },
  });

  // Verificar autenticação no carregamento do componente e quando mudar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          setAuthError("Usuário não autenticado. Por favor, faça login para continuar.");
        } else {
          setAuthError(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthError("Erro ao verificar autenticação. Por favor, recarregue a página.");
      }
    };
    
    checkAuth();
  }, [isAuthenticated]);

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    setUploadError(null);
    
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: CatalogFormValues) => {
    setSubmitting(true);
    setUploadError(null);
    
    // Verificar novamente autenticação antes de submeter
    if (!isAuthenticated) {
      setAuthError("Usuário não autenticado. Por favor, faça login para continuar.");
      setSubmitting(false);
      return;
    }
    
    try {
      // Upload image if a new file is selected
      let imageUrl = data.cover_image;
      
      if (imageFile) {
        console.log('Uploading image file:', imageFile.name);
        setIsUploading(true);
        
        try {
          const uploadedUrl = await uploadCatalogImage(imageFile);
          
          if (uploadedUrl) {
            console.log('Image uploaded successfully:', uploadedUrl);
            imageUrl = uploadedUrl;
          } else {
            setUploadError('Falha ao fazer upload da imagem. Tente novamente.');
            toast({
              title: "Erro",
              description: "Falha ao fazer upload da imagem. Verifique se você está logado e tem permissões para fazer upload.",
              variant: "destructive"
            });
            setSubmitting(false);
            setIsUploading(false);
            return;
          }
        } catch (error: any) {
          console.error("Upload error:", error);
          setUploadError(error.message || 'Falha ao fazer upload da imagem. Tente novamente.');
          toast({
            title: "Erro",
            description: error.message || "Falha ao fazer upload da imagem. Verifique sua conexão ou tente uma imagem menor.",
            variant: "destructive"
          });
          setSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!imageUrl && !imageFile) {
        toast({
          title: "Erro",
          description: "A imagem de capa é obrigatória.",
          variant: "destructive"
        });
        form.setError('cover_image', { 
          type: 'manual', 
          message: 'A imagem de capa é obrigatória.' 
        });
        setSubmitting(false);
        return;
      }

      // Prepare data for saving
      const catalogData = {
        ...(catalog ? { id: catalog.id } : {}),
        title: data.title,
        description: data.description || null,
        cover_image: imageUrl,
        category_id: data.category_id,
      };

      console.log('Submitting catalog data:', catalogData);

      const result = await saveCatalog(catalogData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Catálogo ${catalog ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onClose(true);
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${catalog ? 'atualizar' : 'criar'} o catálogo.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error saving catalog:', error);
      
      // Verificar se é um erro de autenticação
      if (error.message?.includes('autenticado') || error.message?.includes('login') || 
          error.message?.includes('JWT') || error.message?.includes('session')) {
        setAuthError(error.message || "Erro de autenticação. Por favor, faça login novamente.");
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${catalog ? 'atualizar' : 'criar'} o catálogo: ${error.message || "erro desconhecido"}`,
          variant: "destructive"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{catalog ? 'Editar Catálogo' : 'Novo Catálogo'}</CardTitle>
      </CardHeader>
      
      {authError && (
        <div className="mx-6 mb-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p>{authError}</p>
            </div>
          </Alert>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <CatalogTitleField form={form} />
            <CatalogDescriptionField form={form} />
            <ImageUploadField 
              form={form}
              originalImageUrl={catalog?.cover_image}
              onFileChange={handleFileChange}
              imagePreview={imagePreview}
              isUploading={isUploading}
            />
            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div>{uploadError}</div>
              </Alert>
            )}
            <CategoryField form={form} categories={categories} />
          </CardContent>

          <FormActions 
            isEditing={!!catalog}
            isSubmitting={submitting} 
            onCancel={() => onClose(false)}
            disabled={!isAuthenticated}
          />
        </form>
      </Form>
    </Card>
  );
};

export default CatalogForm;
