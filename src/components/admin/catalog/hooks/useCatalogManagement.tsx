
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CatalogWithCategory } from '@/types/catalogTypes';
import { fetchCatalogs, deleteCatalog } from '@/services/catalogService';
import { fetchCatalogCategories } from '@/services/categoryService';

export const useCatalogManagement = () => {
  const [catalogs, setCatalogs] = useState<CatalogWithCategory[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogWithCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const data = await fetchCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error('Error loading catalogs:', error);
      toast({
        title: "Erro ao carregar catálogos",
        description: "Não foi possível carregar os catálogos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCatalogCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadCatalogs();
    loadCategories();
  }, []);

  const handleEditCatalog = (catalog: CatalogWithCategory) => {
    setSelectedCatalog(catalog);
    setShowForm(true);
  };

  const handleCreateCatalog = () => {
    setSelectedCatalog(null);
    setShowForm(true);
  };

  const handleCloseForm = (shouldRefresh: boolean) => {
    setShowForm(false);
    setSelectedCatalog(null);
    if (shouldRefresh) {
      loadCatalogs();
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este catálogo? Esta ação não pode ser desfeita.')) {
      try {
        const success = await deleteCatalog(id);
        if (success) {
          toast({
            title: "Catálogo excluído",
            description: "O catálogo foi excluído com sucesso."
          });
          loadCatalogs();
        } else {
          throw new Error('Failed to delete catalog');
        }
      } catch (error) {
        console.error('Error deleting catalog:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o catálogo.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    catalogs,
    selectedCatalog,
    showForm,
    loading,
    categories,
    loadCatalogs,
    loadCategories,
    handleEditCatalog,
    handleCreateCatalog,
    handleCloseForm,
    handleDeleteCatalog
  };
};
