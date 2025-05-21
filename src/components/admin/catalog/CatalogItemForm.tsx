
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CatalogItem } from '@/types/catalogTypes';
import { saveCatalogItem } from '@/services/catalogService';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, 'URL da imagem é obrigatória'),
  display_order: z.coerce.number().int().default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface CatalogItemFormProps {
  item: CatalogItem | null;
  catalogId: string;
  onClose: (shouldRefresh: boolean) => void;
}

const CatalogItemForm: React.FC<CatalogItemFormProps> = ({ item, catalogId, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || '',
      description: item?.description || '',
      image_url: item?.image_url || '',
      display_order: item?.display_order || 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // Prepare data for saving
      const itemData = {
        ...(item ? { id: item.id } : {}),
        catalog_id: catalogId,
        title: data.title || null,
        description: data.description || null,
        image_url: data.image_url,
        display_order: data.display_order,
      };

      const result = await saveCatalogItem(itemData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Item ${item ? 'atualizado' : 'adicionado'} com sucesso.`,
        });
        onClose(true);
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${item ? 'atualizar' : 'adicionar'} o item.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving catalog item:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${item ? 'atualizar' : 'adicionar'} o item.`,
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
                    <Input placeholder="Título do item" {...field} value={field.value || ''} />
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
                    <Textarea 
                      placeholder="Descrição do item"
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
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Exibição</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                    />
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
              {submitting ? 'Salvando...' : item ? 'Atualizar' : 'Adicionar'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CatalogItemForm;
