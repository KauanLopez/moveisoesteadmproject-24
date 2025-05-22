
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Catalog, CatalogCategory } from '@/types/catalogTypes';
import { uploadCatalogImage } from '@/services/imageService';
import { saveCatalog } from '@/services/catalogService';
import { useToast } from '@/components/ui/use-toast';

// Import our new components
import CatalogTitleField from './form-components/CatalogTitleField';
import CatalogDescriptionField from './form-components/CatalogDescriptionField';
import CategoryField from './form-components/CategoryField';
import ImageUploadField from './form-components/ImageUploadField';
import FormActions from './form-components/FormActions';
import { catalogFormSchema, CatalogFormValues } from './types/CatalogFormTypes';

interface CatalogFormProps {
  catalog: Catalog | null;
  categories: CatalogCategory[];
  onClose: (shouldRefresh: boolean) => void;
}

const CatalogForm: React.FC<CatalogFormProps> = ({ catalog, categories, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: {
      title: catalog?.title || '',
      description: catalog?.description || '',
      cover_image: catalog?.cover_image || '',
      category_id: catalog?.category_id || '',
    },
  });

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    
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
    try {
      // Upload image if a new file is selected
      let imageUrl = data.cover_image;
      
      if (imageFile) {
        const uploadedUrl = await uploadCatalogImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Prepare data for saving
      const catalogData = {
        ...(catalog ? { id: catalog.id } : {}),
        title: data.title,
        description: data.description || null,
        cover_image: imageUrl,
        category_id: data.category_id,
      };

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
    } catch (error) {
      console.error('Error saving catalog:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${catalog ? 'atualizar' : 'criar'} o catálogo.`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{catalog ? 'Editar Catálogo' : 'Novo Catálogo'}</CardTitle>
      </CardHeader>
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
            />
            <CategoryField form={form} categories={categories} />
          </CardContent>

          <FormActions 
            isEditing={!!catalog}
            isSubmitting={submitting} 
            onCancel={() => onClose(false)}
          />
        </form>
      </Form>
    </Card>
  );
};

export default CatalogForm;
