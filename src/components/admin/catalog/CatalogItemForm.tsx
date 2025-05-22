
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CatalogItem } from '@/types/catalogTypes';
import { saveCatalogItem } from '@/services/catalogService';
import { uploadCatalogImage } from '@/services/imageService';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Star, StarOff } from 'lucide-react';

const catalogItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, 'A imagem é obrigatória'),
  display_order: z.coerce.number().default(0),
  is_favorite: z.boolean().optional().default(false),
});

type CatalogItemFormValues = z.infer<typeof catalogItemSchema>;

interface CatalogItemFormProps {
  item: CatalogItem | null;
  catalogId: string;
  onClose: (shouldRefresh: boolean) => void;
}

const CatalogItemForm: React.FC<CatalogItemFormProps> = ({ item, catalogId, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: {
      title: item?.title || '',
      description: item?.description || '',
      image_url: item?.image_url || '',
      display_order: item?.display_order || 0,
      is_favorite: false, // We'll implement favorites later
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update the form field
      form.setValue('image_url', 'uploading...', { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CatalogItemFormValues) => {
    setSubmitting(true);
    try {
      // Upload image if a new file is selected
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadCatalogImage(imageFile, 'catalog_items');
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Prepare data for saving
      const itemData = {
        ...(item ? { id: item.id } : {}),
        catalog_id: catalogId,
        title: data.title,
        description: data.description || null,
        image_url: imageUrl,
        display_order: data.display_order,
      };

      const result = await saveCatalogItem(itemData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Item do catálogo ${item ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onClose(true);
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${item ? 'atualizar' : 'criar'} o item do catálogo.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving catalog item:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${item ? 'atualizar' : 'criar'} o item do catálogo.`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{item ? 'Editar Item' : 'Novo Item'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do item" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do item" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <div className="space-y-4">
                    <FormControl>
                      <Input 
                        placeholder="https://..." 
                        {...field} 
                        disabled={!!imagePreview}
                      />
                    </FormControl>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('item-image-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload da Imagem
                      </Button>
                      {imagePreview && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            field.onChange(item?.image_url || '');
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                    <input 
                      id="item-image-upload"
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {(imagePreview || field.value) && field.value !== 'uploading...' && (
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
            
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de exibição</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : item ? 'Atualizar' : 'Criar'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CatalogItemForm;
