
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Catalog, CatalogItem } from '@/types/catalogTypes';
import { fetchCatalogItems, deleteCatalogItem } from '@/services/catalogService';
import CatalogItemForm from './CatalogItemForm';

interface CatalogItemManagementProps {
  catalog: Catalog;
}

const CatalogItemManagement: React.FC<CatalogItemManagementProps> = ({ catalog }) => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchCatalogItems(catalog.id);
      setItems(data);
    } catch (error) {
      console.error('Error loading catalog items:', error);
      toast({
        title: "Erro ao carregar itens",
        description: "Não foi possível carregar os itens do catálogo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [catalog.id]);

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: CatalogItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
      try {
        const success = await deleteCatalogItem(id);
        if (success) {
          toast({
            title: "Item excluído",
            description: "O item foi excluído com sucesso."
          });
          loadItems();
        }
      } catch (error) {
        console.error('Error deleting catalog item:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o item.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFormClose = (shouldRefresh: boolean) => {
    setIsFormOpen(false);
    if (shouldRefresh) {
      loadItems();
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Itens do Catálogo: {catalog.title}</h3>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Item
        </Button>
      </div>

      {isFormOpen && (
        <CatalogItemForm 
          item={selectedItem}
          catalogId={catalog.id}
          onClose={handleFormClose}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Carregando itens...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Nenhum item encontrado neste catálogo.</TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img 
                    src={item.image_url} 
                    alt={item.title || "Imagem do catálogo"} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.title || "Sem título"}</TableCell>
                <TableCell>{item.display_order || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

export default CatalogItemManagement;
