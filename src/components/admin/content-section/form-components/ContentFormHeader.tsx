
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContentFormHeaderProps {
  sectionTitle: string;
  isEditing: boolean;
  loading: boolean;
  onClose: () => Promise<void>;
  onSave: () => Promise<void>;
}

const ContentFormHeader: React.FC<ContentFormHeaderProps> = ({
  sectionTitle,
  isEditing,
  loading,
  onClose,
  onSave
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">
        {isEditing ? `Editar ${sectionTitle}` : `Novo Item em ${sectionTitle}`}
      </h3>
      <div className="space-x-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading ? "Processando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default ContentFormHeader;
