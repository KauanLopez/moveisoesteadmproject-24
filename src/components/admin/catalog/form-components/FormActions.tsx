
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean; // Added the disabled prop as optional
}

const FormActions: React.FC<FormActionsProps> = ({ isEditing, isSubmitting, onCancel, disabled = false }) => {
  return (
    <CardFooter className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting || disabled}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
      </Button>
    </CardFooter>
  );
};

export default FormActions;
