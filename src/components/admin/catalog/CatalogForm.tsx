
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Catalog, CatalogCategory } from '@/types/catalogTypes';
import { saveCatalog } from '@/services/catalogService';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  cover_image: z.string().min(1, 'Imagem de capa é obrigatória'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
});

type FormValues = z.infer<typeof formSchema>;

interface CatalogFormProps {
  catalog: Catalog | null;
  categories: CatalogCategory[];
  onClose: (shouldRefresh: boolean) => void;
}

const CatalogForm: React.FC<CatalogFormProps> = ({ catalog, categories, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: catalog?.title || '',
      description: catalog?.description || '',
      cover_image: catalog?.cover_image || '',
      category_id: catalog?.category_id || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // Prepare data for saving
      const catalogData = {
        ...(catalog ? { id: catalog.id } : {}),
        title: data.title,
        description: data.description || null,
        cover_image: data.cover_image,
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do catálogo" {...field} />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do catálogo (opcional)"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem de Capa (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {submitting ? 'Salvando...' : catalog ? 'Atualizar' : 'Criar'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CatalogForm;
