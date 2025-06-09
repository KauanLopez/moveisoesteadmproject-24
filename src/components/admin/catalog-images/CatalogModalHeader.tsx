
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';

interface CatalogModalHeaderProps {
  catalog: ExternalUrlCatalog;
  onClose: () => void;
}

const CatalogModalHeader: React.FC<CatalogModalHeaderProps> = ({ catalog, onClose }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
      <div>
        <CardTitle>Imagens do Catálogo: {catalog.title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">{catalog.description}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
};

export default CatalogModalHeader;
