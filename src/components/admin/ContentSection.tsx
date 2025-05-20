
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageContent, useContent } from '@/context/ContentContext';
import ImageEditor from './image-editor/ImageEditor';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  section: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, section }) => {
  const { content, updateContent, saveContent, addContent } = useContent();
  const { toast } = useToast();
  const sectionContent = content.filter(item => item.section === section);
  const [activeTab, setActiveTab] = useState(sectionContent[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const currentItem = sectionContent.find(item => item.id === activeTab);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentItem) {
      updateContent(currentItem.id, { title: e.target.value });
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentItem) {
      updateContent(currentItem.id, { description: e.target.value });
    }
  };
  
  const handleUpdateImage = (updates: Partial<ImageContent>) => {
    if (currentItem) {
      updateContent(currentItem.id, updates);
    }
  };
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      saveContent();
      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewItem = () => {
    const newId = `${section}${sectionContent.length + 1}`;
    const newItem = {
      id: newId,
      section: section,
      title: `Novo ${title.split(' ')[0]}`,
      description: "",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
      objectPosition: 'center'
    };
    
    addContent(newItem);
    setActiveTab(newId);
    toast({
      title: "Item adicionado",
      description: "Um novo item foi adicionado. Não esqueça de salvar suas alterações!",
    });
  };

  if (sectionContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">Nenhum conteúdo encontrado nesta seção</p>
        <Button onClick={handleAddNewItem}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Item
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{title}</h2>
            <p className="text-gray-600">
              Edite o conteúdo desta seção do site.
            </p>
          </div>
          <Button onClick={handleAddNewItem} className="flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
        </div>
        
        {/* Content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative">
            <TabsList className="w-full overflow-x-auto flex whitespace-nowrap pb-2" style={{ scrollbarWidth: 'none' }}>
              {sectionContent.map(item => (
                <TabsTrigger 
                  key={item.id}
                  value={item.id}
                  className="flex-shrink-0"
                >
                  {item.title || `Item ${item.id}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {sectionContent.map(item => (
            <TabsContent key={item.id} value={item.id} className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Text content */}
                <div className="space-y-6">
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
                
                {/* Right column: Image editor */}
                <div>
                  <ImageEditor content={item} onUpdate={handleUpdateImage} section={section} />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveChanges} 
          className="bg-furniture-green hover:bg-furniture-green/90 px-8"
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
};

export default ContentSection;
