
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { Catalog, CatalogWithCategory } from '@/types/catalogTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import CatalogForm from './CatalogForm';
import CategoryManagement from './CategoryManagement';
import {
  fetchCatalogs,
  deleteCatalog,
} from '@/services/catalogService';
import { fetchCatalogCategories } from '@/services/categoryService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CatalogManagement: React.FC = () => {
  const [catalogs, setCatalogs] = useState<CatalogWithCategory[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogWithCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('catalogs');
  
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reload appropriate data when tab changes
    if (value === 'catalogs') {
      loadCatalogs();
    } else if (value === 'categories') {
      loadCategories();
    }
  };

  const renderCatalogContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Catálogos</h2>
        <Button onClick={handleCreateCatalog}>
          <Plus className="mr-2 h-4 w-4" /> Novo Catálogo
        </Button>
      </div>

      {showForm ? (
        <CatalogForm 
          catalog={selectedCatalog} 
          categories={categories} 
          onClose={handleCloseForm}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
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
                  <TableCell>
                    {catalog.cover_image ? (
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={catalog.cover_image} 
                          alt={catalog.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }} 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-200">
                        <Image size={20} className="opacity-50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{catalog.title}</TableCell>
                  <TableCell className="font-medium">{catalog.category_name || 'Sem categoria'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCatalog(catalog)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCatalog(catalog.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="catalogs">Catálogos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="catalogs" className="mt-0">
          {renderCatalogContent()}
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <CategoryManagement onCategoriesUpdated={loadCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogManagement;
