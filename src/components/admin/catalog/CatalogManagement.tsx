
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Catalog, CatalogWithCategory } from '@/types/catalogTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  fetchCatalogs,
  deleteCatalog,
  saveCatalog
} from '@/services/catalogService';
import { fetchCatalogCategories } from '@/services/categoryService';

const catalogFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  category_id: z.string().optional(),
});

type CatalogFormValues = z.infer<typeof catalogFormSchema>;

const CatalogManagement: React.FC = () => {
  const [catalogs, setCatalogs] = useState<CatalogWithCategory[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogWithCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  
  const { toast } = useToast();
  
  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: { 
      title: '',
      category_id: undefined
    }
  });

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

  const handleOpenDialog = (catalog: CatalogWithCategory | null = null) => {
    setSelectedCatalog(catalog);
    if (catalog) {
      form.reset({ 
        title: catalog.title,
        category_id: catalog.category_id 
      });
    } else {
      form.reset({ 
        title: '',
        category_id: undefined 
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  const handleSaveCatalog = async (data: CatalogFormValues) => {
    try {
      // Create the catalog object with the necessary fields
      const catalogData = {
        ...(selectedCatalog ? { id: selectedCatalog.id } : {}),
        title: data.title,
        category_id: data.category_id || null
      };
      
      const result = await saveCatalog(catalogData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: `Catálogo ${selectedCatalog ? 'atualizado' : 'criado'} com sucesso.`,
        });
        handleCloseDialog();
        loadCatalogs();
      } else {
        toast({
          title: "Erro",
          description: `Erro ao ${selectedCatalog ? 'atualizar' : 'criar'} o catálogo.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving catalog:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${selectedCatalog ? 'atualizar' : 'criar'} o catálogo.`,
        variant: "destructive"
      });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Catálogos</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Catálogo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">Carregando catálogos...</TableCell>
            </TableRow>
          ) : catalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">Nenhum catálogo encontrado.</TableCell>
            </TableRow>
          ) : (
            catalogs.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell className="font-medium">{catalog.title}</TableCell>
                <TableCell className="font-medium">{catalog.category_name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(catalog)}>
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
      
      {/* Catalog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCatalog ? 'Editar Catálogo' : 'Novo Catálogo'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveCatalog)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Catálogo</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do catálogo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedCatalog ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogManagement;
