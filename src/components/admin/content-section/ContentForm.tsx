
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageContent } from '@/types/customTypes';
import { saveContent } from '@/services/contentService';
import { useToast } from '@/components/ui/use-toast';

interface ContentFormProps {
  section: string;
  sectionTitle: string;
  itemId: string | null;
  onClose: (savedItem?: ImageContent) => Promise<void>;
}

const ContentForm: React.FC<ContentFormProps> = ({
  section,
  sectionTitle,
  itemId,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ImageContent>({
    id: '',
    section: section,
    title: '',
    description: '',
    image: '',
    objectPosition: 'center',
    scale: 1
  });
  
  const { toast } = useToast();
  
  // Load item if editing existing
  useEffect(() => {
    if (itemId) {
      // Load the item data
      const loadItem = async () => {
        try {
          // In a real implementation, you would fetch the item by ID
          // For now, we'll use a placeholder
          setItem(prev => ({
            ...prev,
            id: itemId,
          }));
        } catch (error) {
          console.error('Error loading content item:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do item.",
            variant: "destructive"
          });
        }
      };
      
      loadItem();
    } else {
      // Generate a new ID for new items
      setItem(prev => ({
        ...prev,
        id: crypto.randomUUID(),
      }));
    }
  }, [itemId]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({ ...prev, title: e.target.value }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItem(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const savedItem = await saveContent(item);
      toast({
        title: "Sucesso",
        description: "Item salvo com sucesso."
      });
      await onClose(savedItem || undefined);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o item.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {itemId ? `Editar ${sectionTitle}` : `Novo Item em ${sectionTitle}`}
        </h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onClose()} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Informações</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <Input
              type="text"
              value={item.title}
              onChange={handleTitleChange}
              placeholder="Título"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={item.description}
              onChange={handleDescriptionChange}
              placeholder="Descrição"
              className="w-full min-h-[100px] p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
