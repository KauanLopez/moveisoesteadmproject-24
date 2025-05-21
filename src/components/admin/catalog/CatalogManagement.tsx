
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Catalog, CatalogCategory } from '@/types/catalogTypes';
import { fetchCatalogs, fetchCatalogCategories, deleteCatalog } from '@/services/catalogService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import CatalogForm from './CatalogForm';

const CatalogManagement = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogsData, categoriesData] = await Promise.all([
        fetchCatalogs(),
        fetchCatalogCategories()
      ]);
      setCatalogs(catalogsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading catalog data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os catálogos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNew = () => {
    setSelectedCatalog(null);
    setIsFormOpen(true);
  };

  const handleEdit = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este catálogo? Esta ação não pode ser desfeita.')) {
      try {
        const success = await deleteCatalog(id);
        if (success) {
          toast({
            title: "Catálogo excluído",
            description: "O catálogo foi excluído com sucesso."
          });
          loadData();
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

  const handleFormClose = (shouldRefresh: boolean) => {
    setIsFormOpen(false);
    if (shouldRefresh) {
      loadData();
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Catálogos</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Catálogo
        </Button>
      </div>

      {isFormOpen && (
        <CatalogForm 
          catalog={selectedCatalog}
          categories={categories} 
          onClose={handleFormClose}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Carregando catálogos...</TableCell>
            </TableRow>
          ) : catalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Nenhum catálogo encontrado.</TableCell>
            </TableRow>
          ) : (
            catalogs.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell className="font-medium">{catalog.title}</TableCell>
                <TableCell>{getCategoryName(catalog.category_id)}</TableCell>
                <TableCell>{catalog.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(catalog)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(catalog.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CatalogManagement;
