
import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onSave }) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave} 
        className="bg-furniture-green hover:bg-furniture-green/90 px-8"
        disabled={isSaving}
      >
        {isSaving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
};

export default SaveButton;
