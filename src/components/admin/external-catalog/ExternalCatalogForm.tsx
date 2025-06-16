
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ExternalUrlCatalog, ExternalUrlCatalogFormData } from '@/types/customTypes';
import { saveExternalCatalog } from '@/services/externalCatalogService';

interface ExternalCatalogFormProps {
  catalog?: ExternalUrlCatalog;
  onClose: (shouldRefresh: boolean) => void;
}

const ExternalCatalogForm: React.FC<ExternalCatalogFormProps> = ({ catalog, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [contentUrls, setContentUrls] = useState<string[]>(
    catalog?.external_content_image_urls || ['']
  );
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ExternalUrlCatalogFormData>({
    defaultValues: {
      title: catalog?.title || '',
      description: catalog?.description || '',
      external_cover_image_url: catalog?.external_cover_image_url || '',
      external_content_image_urls: catalog?.external_content_image_urls || []
    }
  });

  const addContentUrl = () => {
    setContentUrls([...contentUrls, '']);
  };

  const removeContentUrl = (index: number) => {
    const newUrls = contentUrls.filter((_, i) => i !== index);
    setContentUrls(newUrls);
    setValue('external_content_image_urls', newUrls.filter(url => url.trim() !== ''));
  };

  const updateContentUrl = (index: number, value: string) => {
    const newUrls = [...contentUrls];
    newUrls[index] = value;
    setContentUrls(newUrls);
    setValue('external_content_image_urls', newUrls.filter(url => url.trim() !== ''));
  };

  const onSubmit = async (data: ExternalUrlCatalogFormData) => {
    setSubmitting(true);
    
    try {
      const catalogData = {
        ...data,
        external_content_image_urls: contentUrls.filter(url => url.trim() !== ''),
        ...(catalog ? { id: catalog.id } : {})
      };

      const result = await saveExternalCatalog(catalogData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Catálogo ${catalog ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onClose(true);
      }
    } catch (error: any) {
      console.error('Error saving external catalog:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${catalog ? 'atualizar' : 'criar'} o catálogo: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{catalog ? 'Editar Catálogo' : 'Novo Catálogo'} (URLs Externas)</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Título é obrigatório' })}
              placeholder="Digite o título do catálogo"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Digite a descrição do catálogo"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="cover_url">URL da Imagem de Capa *</Label>
            <Input
              id="cover_url"
              {...register('external_cover_image_url', { 
                required: 'URL da imagem de capa é obrigatória',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'URL deve começar com http:// ou https://'
                }
              })}
              placeholder="https://exemplo.com/imagem-capa.jpg"
            />
            {errors.external_cover_image_url && (
              <p className="text-red-500 text-sm mt-1">{errors.external_cover_image_url.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>URLs das Imagens de Conteúdo</Label>
              <Button type="button" onClick={addContentUrl} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar URL
              </Button>
            </div>
            
            <div className="space-y-2">
              {contentUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateContentUrl(index, e.target.value)}
                    placeholder="https://exemplo.com/imagem-conteudo.jpg"
                  />
                  {contentUrls.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeContentUrl(index)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button type="button" variant="outline" onClick={() => onClose(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : catalog ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExternalCatalogForm;
