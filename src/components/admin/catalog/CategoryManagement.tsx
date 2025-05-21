
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CatalogCategory } from '@/types/catalogTypes';
import { 
  fetchCatalogCategories, 
  saveCatalogCategory, 
  deleteCatalogCategory 
} from '@/services/categoryService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryManagementProps {
  onCategoriesUpdated?: () => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ onCategoriesUpdated }) => {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '' }
  });

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
    if (category) {
      form.reset({ name: category.name });
    } else {
      form.reset({ name: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  const handleSaveCategory = async (data: CategoryFormValues) => {
    try {
      const categoryData = {
        ...(selectedCategory ? { id: selectedCategory.id } : {}),
        name: data.name,
      };

      const result = await saveCatalogCategory(categoryData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Categoria ${selectedCategory ? 'atualizada' : 'criada'} com sucesso.`,
        });
        handleCloseDialog();
        loadCategories();
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${selectedCategory ? 'atualizar' : 'criar'} a categoria.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${selectedCategory ? 'atualizar' : 'criar'} a categoria.`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      try {
        const success = await deleteCatalogCategory(id);
        if (success) {
          toast({
            title: "Categoria excluída",
            description: "A categoria foi excluída com sucesso."
          });
          loadCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a categoria.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">Carregando categorias...</TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">Nenhuma categoria encontrada.</TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(category)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
