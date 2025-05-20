
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageContent } from '@/context/ContentContext';

interface TabNavigationProps {
  items: ImageContent[];
  activeTab: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  items, 
  activeTab 
}) => {
  return (
    <TabsList className="w-full overflow-x-auto flex whitespace-nowrap pb-2" style={{ scrollbarWidth: 'none' }}>
      {items.map(item => (
        <TabsTrigger 
          key={item.id}
          value={item.id}
          className="flex-shrink-0"
        >
          {item.title || `Item ${item.id}`}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabNavigation;
