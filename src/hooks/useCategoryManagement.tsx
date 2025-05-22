
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CatalogCategory } from '@/types/catalogTypes';
import { 
  fetchCatalogCategories, 
  saveCategory, 
  deleteCategory 
} from '@/services/categoryService';

export function useCategoryManagement(onCategoriesUpdated?: () => void) {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCatalogCategories();
      setCategories(data);
      if (onCategoriesUpdated) {
        onCategoriesUpdated();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias do catálogo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenDialog = (category: CatalogCategory | null = null) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (name: string) => {
    try {
      const categoryData = {
        ...(selectedCategory ? { id: selectedCategory.id } : {}),
        name,
      };

      const result = await saveCategory(categoryData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Categoria ${selectedCategory ? 'atualizada' : 'criada'} com sucesso.`,
        });
        handleCloseDialog();
        loadCategories();
        return true;
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${selectedCategory ? 'atualizar' : 'criar'} a categoria.`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${selectedCategory ? 'atualizar' : 'criar'} a categoria.`,
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      try {
        const success = await deleteCategory(id);
        if (success) {
          toast({
            title: "Categoria excluída",
            description: "A categoria foi excluída com sucesso."
          });
          loadCategories();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a categoria.",
          variant: "destructive"
        });
        return false;
      }
    }
    return false;
  };

  return {
    categories,
    selectedCategory,
    isDialogOpen,
    loading,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveCategory,
    handleDeleteCategory,
  };
}
