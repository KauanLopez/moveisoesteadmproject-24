
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ImageContent } from '@/types/customTypes';
import SectionHeader from './content-section/SectionHeader';
import ContentForm from './content-section/ContentForm';
import EmptySection from './content-section/EmptySection';
import CatalogImagesButton from './catalog/CatalogImagesButton';
import { supabase } from '@/integrations/supabase/client';
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
  
  const { content, updateContent, addContent } = useContent();
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
  }, [section, content]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setShowForm(true);
  };

  const handleFormClose = async (savedItem?: ImageContent) => {
    setShowForm(false);
    // No need to reload, the context will be updated
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        // Delete from database
        const { error } = await supabase
          .from('content')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Also remove from context
        const updatedContent = content.filter(item => item.id !== id);
        
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
  const [catalogTitles, setCatalogTitles] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (section === 'projects') {
      const fetchCatalogTitles = async () => {
        try {
          // For each catalog item, try to fetch its title from the catalogs table
          const titles: Record<string, string> = {};
          
          for (const item of items) {
            // Check if we already have this catalog's title
            if (!titles[item.id]) {
              const { data } = await supabase
                .from('catalogs')
                .select('title')
                .eq('id', item.id)
                .single();
                
              if (data) {
                titles[item.id] = data.title;
              }
            }
          }
          
          setCatalogTitles(titles);
        } catch (error) {
          console.error('Error fetching catalog titles:', error);
        }
      };
      
      if (items.length > 0) {
        fetchCatalogTitles();
      }
    }
  }, [items, section]);

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

          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : items.length === 0 ? (
            <EmptySection onAdd={handleAdd} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md"
                >
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      style={{ 
                        objectPosition: item.objectPosition || 'center',
                        transform: item.scale ? `scale(${item.scale})` : 'scale(1)'
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                    
                    {/* Add the Catalog Images button for projects section */}
                    {section === 'projects' && (
                      <div className="mt-3">
                        <CatalogImagesButton 
                          catalogId={item.id} 
                          catalogTitle={catalogTitles[item.id] || item.title} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentSection;
