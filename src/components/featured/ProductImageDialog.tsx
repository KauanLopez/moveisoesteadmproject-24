
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X, Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Reset loading state when a new image is selected
    if (selectedImage) {
      setIsLoading(true);
    }
  }, [selectedImage]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <DialogTitle>
          <VisuallyHidden>Visualização em tela cheia</VisuallyHidden>
        </DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          )}
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Visualização em tela cheia" 
              className="max-w-full max-h-[80vh] object-contain"
              style={{
                objectPosition: position,
                transform: `scale(${scale})`
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
          <button 
            onClick={() => onOpenChange(false)} 
            className="absolute top-3 right-3 bg-white/70 hover:bg-white rounded-full p-2 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageDialog;
