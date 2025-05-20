
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ImageContent, useContent } from '@/context/ContentContext';
import ImageEditor from './image-editor/ImageEditor';
import { useToast } from '@/components/ui/use-toast';

// Import the new components
import SectionHeader from './content-section/SectionHeader';
import TabNavigation from './content-section/TabNavigation';
import ContentForm from './content-section/ContentForm';
import EmptySection from './content-section/EmptySection';
import SaveButton from './content-section/SaveButton';

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
    return <EmptySection onAddItem={handleAddNewItem} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader 
          title={title} 
          section={section} 
          onAddItem={handleAddNewItem} 
        />
        
        {/* Content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative">
            <TabNavigation items={sectionContent} activeTab={activeTab} />
          </div>

          {sectionContent.map(item => (
            <TabsContent key={item.id} value={item.id} className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Text content */}
                <div className="space-y-6">
                  <ContentForm
                    item={item}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                  />
                </div>
                
                {/* Right column: Image editor */}
                <div>
                  <ImageEditor 
                    content={item} 
                    onUpdate={handleUpdateImage} 
                    section={section} 
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <SaveButton isSaving={isSaving} onSave={handleSaveChanges} />
    </div>
  );
};

export default ContentSection;
