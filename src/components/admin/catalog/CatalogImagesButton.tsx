
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CatalogImageManager from './CatalogImageManager';

interface CatalogImagesButtonProps {
  catalogId: string;
  catalogTitle: string;
}

const CatalogImagesButton: React.FC<CatalogImagesButtonProps> = ({ catalogId, catalogTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <Image className="h-4 w-4 mr-1" />
        Fotos do Catálogo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gerenciar fotos: {catalogTitle}</DialogTitle>
          </DialogHeader>
          <CatalogImageManager catalogId={catalogId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CatalogImagesButton;
