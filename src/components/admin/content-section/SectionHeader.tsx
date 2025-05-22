
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SectionHeaderProps {
  title: string;
  onAddNew: () => void;  // Changed from onAddItem to onAddNew to match usage
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  onAddNew 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-gray-600">
          Edite o conteúdo desta seção do site.
        </p>
      </div>
      <Button onClick={onAddNew} className="flex-shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Novo Item
      </Button>
    </div>
  );
};

export default SectionHeader;
