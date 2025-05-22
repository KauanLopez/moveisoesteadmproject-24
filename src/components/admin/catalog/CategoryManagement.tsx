
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import CategoryTable from './components/CategoryTable';
import CategoryFormDialog from './components/CategoryFormDialog';

interface CategoryManagementProps {
  onCategoriesUpdated?: () => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ onCategoriesUpdated }) => {
  const {
    categories,
    selectedCategory,
    isDialogOpen,
    loading,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveCategory,
    handleDeleteCategory
  } = useCategoryManagement(onCategoriesUpdated);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <CategoryTable 
        categories={categories}
        loading={loading}
        onEdit={(category) => handleOpenDialog(category)}
        onDelete={handleDeleteCategory}
      />
      
      <CategoryFormDialog
        open={isDialogOpen}
        selectedCategory={selectedCategory}
        onClose={handleCloseDialog}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoryManagement;
