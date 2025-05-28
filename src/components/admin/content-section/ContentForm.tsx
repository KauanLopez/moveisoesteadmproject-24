
import React, { useState, useEffect } from 'react';
import { ImageContent } from '@/types/customTypes';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/context/ContentContext';
import { dbOperations } from '@/lib/supabase-helpers';
import { uploadCatalogImage } from '@/services/imageService';

// Import refactored components
import ContentFormHeader from './form-components/ContentFormHeader';
import ContentTextFields from './form-components/ContentTextFields';
import ContentImageUploader from './form-components/ContentImageUploader';
import ContentImagePreview from './form-components/ContentImagePreview';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = item.image;
      
      // Upload image if a file was selected
      if (imageFile) {
        setIsUploading(true);
        try {
          const uploadedUrl = await uploadCatalogImage(imageFile);
          
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
            setItem(prev => ({ ...prev, image: uploadedUrl }));
          } else {
            throw new Error("Falha ao fazer upload da imagem");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "Erro no upload",
            description: "Não foi possível fazer upload da imagem.",
            variant: "destructive"
          });
          setLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }
      
      if (!imageUrl) {
        toast({
          title: "Imagem obrigatória",
          description: "Por favor, informe uma URL de imagem ou faça upload de uma imagem.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Convert to database format
      const dbItem = {
        id: item.id,
        section: item.section,
        title: item.title,
        description: item.description,
        image_url: imageUrl,
        object_position: item.objectPosition,
        scale: item.scale
      };
      
      // Save to database
      const { data, error } = await dbOperations.content.upsert(dbItem);
        
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
      <ContentFormHeader 
        sectionTitle={sectionTitle} 
        isEditing={!!itemId}
        loading={loading || isUploading}
        onClose={() => onClose()}
        onSave={handleSave}
      />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Informações</h3>
        
        <div className="space-y-4">
          <ContentTextFields 
            item={item}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
          />
          
          <ContentImageUploader 
            imageUrl={item.image}
            imageFile={imageFile}
            isUploading={isUploading}
            onImageUrlChange={handleImageUrlChange}
            onFileChange={handleFileChange}
          />
          
          <ContentImagePreview 
            imageUrl={item.image}
            imageFile={imageFile}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
