
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatalogModalHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
}

const CatalogModalHeader: React.FC<CatalogModalHeaderProps> = ({
  title,
  description,
  onClose
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b bg-white z-50 flex-shrink-0 min-h-[64px]">
      <div className="min-w-0 flex-1 mr-4">
        <h2 className="text-lg sm:text-xl font-bold truncate text-gray-900">{title}</h2>
        {description && (
          <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{description}</p>
        )}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose} 
        className="rounded-full p-2 flex-shrink-0 hover:bg-gray-100 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CatalogModalHeader;
