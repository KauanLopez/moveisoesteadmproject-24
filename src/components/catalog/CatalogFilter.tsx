
import React from 'react';
import { Button } from '@/components/ui/button';

interface CatalogFilterProps {
  categories: Array<{ id: string; label: string }>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CatalogFilter: React.FC<CatalogFilterProps> = ({ 
  categories, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeFilter === category.id ? 'default' : 'outline'}
          className={`rounded-full ${
            activeFilter === category.id ? 'bg-primary text-white' : 'bg-white'
          }`}
          onClick={() => onFilterChange(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CatalogFilter;
