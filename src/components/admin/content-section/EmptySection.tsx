
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptySectionProps {
  onAddItem: () => void;
}

const EmptySection: React.FC<EmptySectionProps> = ({ onAddItem }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <p className="text-gray-500 mb-4">Nenhum conteúdo encontrado nesta seção</p>
      <Button onClick={onAddItem}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Novo Item
      </Button>
    </div>
  );
};

export default EmptySection;
