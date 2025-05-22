
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isEditing, 
  isSubmitting, 
  onCancel 
}) => {
  return (
    <CardFooter className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
      </Button>
    </CardFooter>
  );
};

export default FormActions;
