
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CatalogCategory } from '@/types/catalogTypes';

interface CategoryTableProps {
  categories: CatalogCategory[];
  loading: boolean;
  onEdit: (category: CatalogCategory) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, loading, onEdit, onDelete }) => {
  return (
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
                  <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(category.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
