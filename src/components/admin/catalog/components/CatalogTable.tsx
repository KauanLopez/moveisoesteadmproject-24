
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Image, Pencil, Trash2 } from 'lucide-react';
import { CatalogWithCategory } from '@/types/catalogTypes';

interface CatalogTableProps {
  catalogs: CatalogWithCategory[];
  loading: boolean;
  onEdit: (catalog: CatalogWithCategory) => void;
  onDelete: (id: string) => void;
}

const CatalogTable: React.FC<CatalogTableProps> = ({ 
  catalogs, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  return (
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
                  <Button variant="outline" size="sm" onClick={() => onEdit(catalog)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(catalog.id)}>
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

export default CatalogTable;
