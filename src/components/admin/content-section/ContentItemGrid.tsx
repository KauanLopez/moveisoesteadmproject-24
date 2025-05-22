
import React from 'react';
import { ImageContent } from '@/types/customTypes';
import ContentItemCard from './ContentItemCard';

interface ContentItemGridProps {
  items: ImageContent[];
  section: string;
  catalogTitles?: Record<string, string>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContentItemGrid: React.FC<ContentItemGridProps> = ({
  items,
  section,
  catalogTitles = {},
  onEdit,
  onDelete
}) => {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {items.map((item) => (
        <ContentItemCard
          key={item.id}
          item={item}
          section={section}
          catalogTitles={catalogTitles}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ContentItemGrid;
