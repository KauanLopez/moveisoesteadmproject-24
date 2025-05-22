
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageContent } from '@/types/customTypes';
import CatalogImagesButton from '../catalog/CatalogImagesButton';

interface ContentItemCardProps {
  item: ImageContent;
  section: string;
  catalogTitles?: Record<string, string>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  item,
  section,
  catalogTitles = {},
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover"
          style={{ 
            objectPosition: item.objectPosition || 'center',
            transform: item.scale ? `scale(${item.scale})` : 'scale(1)'
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item.id)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item.id)}
          >
            Excluir
          </Button>
        </div>
        
        {/* Add the Catalog Images button for projects section */}
        {section === 'projects' && (
          <div className="mt-3">
            <CatalogImagesButton 
              catalogId={item.id} 
              catalogTitle={catalogTitles[item.id] || item.title} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentItemCard;
