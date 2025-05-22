
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProductImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string | null;
  position?: string;
  scale?: number;
}

const ProductImageDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedImage, 
  position = 'center', 
  scale = 1 
}: ProductImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <DialogTitle>
          <VisuallyHidden>Visualização em tela cheia</VisuallyHidden>
        </DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={selectedImage || ''} 
            alt="Visualização em tela cheia" 
            className="max-w-full max-h-[80vh] object-contain"
            style={{
              objectPosition: position,
              transform: `scale(${scale})`
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageDialog;
