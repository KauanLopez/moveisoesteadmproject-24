
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageContent } from '@/types/customTypes';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/context/ContentContext';
import { supabase } from '@/integrations/supabase/client';

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
  
  const { content, updateContent, addContent } = useContent();
  const { toast } = useToast();
  
  // Load item if editing existing
  useEffect(() => {
    if (itemId) {
      // Find the item in context
      const existingItem = content.find(item => item.id === itemId);
      
      if (existingItem) {
        setItem(existingItem);
      } else {
        toast({
          title: "Erro",
          description: "Item não encontrado.",
          variant: "destructive"
        });
      }
    } else {
      // Generate a new ID for new items
      setItem(prev => ({
        ...prev,
        id: crypto.randomUUID(),
      }));
    }
  }, [itemId, content]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({ ...prev, title: e.target.value }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItem(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({ ...prev, image: e.target.value }));
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      // Convert to database format
      const dbItem = {
        id: item.id,
        section: item.section,
        title: item.title,
        description: item.description,
        image_url: item.image,
        object_position: item.objectPosition,
        scale: item.scale
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('content')
        .upsert(dbItem)
        .select();
        
      if (error) throw error;
      
      // Update context
      if (itemId) {
        // Update existing item
        updateContent(item.id, item);
      } else {
        // Add new item
        addContent(item);
      }
      
      toast({
        title: "Sucesso",
        description: "Item salvo com sucesso."
      });
      
      await onClose(item);
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <Input
              type="text"
              value={item.image}
              onChange={handleImageUrlChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          
          {item.image && (
            <div className="mt-4">
              <p className="block text-sm font-medium text-gray-700 mb-1">
                Visualização
              </p>
              <div className="w-full h-60 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt="Visualização"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300?text=Imagem+Inválida";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
