
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CatalogModalHeader from './CatalogModalHeader';

interface EmptyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  message: string;
}

const EmptyModal: React.FC<EmptyModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  message
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] p-0 rounded-lg overflow-hidden border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Visualização do catálogo {title}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex flex-col w-full h-full bg-white">
          <CatalogModalHeader
            title={title}
            description={description}
            onClose={onClose}
          />
          
          <div className="flex-1 min-h-0 overflow-hidden relative bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmptyModal;
