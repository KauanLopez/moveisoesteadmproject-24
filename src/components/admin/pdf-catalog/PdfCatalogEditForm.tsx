
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { updatePdfCatalog, PdfCatalog } from '@/services/pdfCatalogService';

interface PdfCatalogEditFormProps {
  catalog: PdfCatalog;
  onComplete: () => void;
  onCancel: () => void;
}

const PdfCatalogEditForm: React.FC<PdfCatalogEditFormProps> = ({ catalog, onComplete, onCancel }) => {
  const [title, setTitle] = useState(catalog.title);
  const [description, setDescription] = useState(catalog.description || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para o catálogo.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updatePdfCatalog(catalog.id, {
        title: title.trim(),
        description: description.trim() || undefined
      });
      
      toast({
        title: "Catálogo atualizado",
        description: "As informações do catálogo foram atualizadas com sucesso.",
      });
      onComplete();
    } catch (error: any) {
      console.error('Error updating catalog:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível atualizar o catálogo.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Editar Catálogo PDF</CardTitle>
        <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-6">
          {catalog.cover_image_url && (
            <div className="flex-shrink-0">
              <img 
                src={catalog.cover_image_url} 
                alt={catalog.title}
                className="w-32 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="title">Título do Catálogo</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do catálogo"
                disabled={saving}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição para o catálogo"
                rows={4}
                disabled={saving}
              />
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Informações do PDF</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Arquivo:</strong> {catalog.original_pdf_filename || 'Não informado'}</p>
                <p><strong>Total de páginas:</strong> {catalog.total_pages}</p>
                <p><strong>Status:</strong> {catalog.processing_status}</p>
                <p><strong>Criado em:</strong> {new Date(catalog.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfCatalogEditForm;
