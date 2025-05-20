
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SectionHeaderProps {
  title: string;
  section: string;
  onAddItem: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  section,
  onAddItem 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-gray-600">
          Edite o conteúdo desta seção do site.
        </p>
      </div>
      <Button onClick={onAddItem} className="flex-shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Novo Item
      </Button>
    </div>
  );
};

export default SectionHeader;
