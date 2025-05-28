
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ImageContent } from '@/types/customTypes';
import SectionHeader from './content-section/SectionHeader';
import ContentForm from './content-section/ContentForm';
import EmptySection from './content-section/EmptySection';
import ContentItemGrid from './content-section/ContentItemGrid';
import { useContentCatalogTitles } from './content-section/useContentCatalogTitles';
import { dbOperations } from '@/lib/supabase-helpers';
import { useContent } from '@/context/ContentContext';

interface ContentSectionProps {
  title: string;
  section: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, section }) => {
  const [items, setItems] = useState<ImageContent[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const { content } = useContent();
  const { toast } = useToast();
  
  // Load content from context
  useEffect(() => {
    setLoading(true);
    try {
      // Filter content from the context based on section
      const sectionItems = content.filter(item => item.section === section);
      setItems(sectionItems);
    } catch (error) {
      console.error(`Error loading ${section} content:`, error);
      toast({
        title: "Erro ao carregar conteúdo",
        description: `Não foi possível carregar o conteúdo de ${title.toLowerCase()}.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [section, content, title, toast]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setShowForm(true);
  };

  const handleFormClose = async () => {
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        // Delete from database
        const { error } = await dbOperations.content.delete(id);
          
        if (error) throw error;
        
        toast({
          title: "Item excluído",
          description: "O item foi excluído com sucesso.",
        });
        
        // Refresh the items list
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting content:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o item.",
          variant: "destructive",
        });
      }
    }
  };

  // Get catalog titles for catalog image management
  const catalogTitles = useContentCatalogTitles(items, section);

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Carregando...</div>;
    }
    
    if (items.length === 0) {
      return <EmptySection onAdd={handleAdd} />;
    }
    
    return (
      <ContentItemGrid
        items={items}
        section={section}
        catalogTitles={catalogTitles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div>
      {showForm ? (
        <ContentForm
          section={section}
          sectionTitle={title}
          itemId={editId}
          onClose={handleFormClose}
        />
      ) : (
        <>
          <SectionHeader title={title} onAddNew={handleAdd} />
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default ContentSection;
