
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminTab {
  id: string;
  label: string;
}

interface AdminTabsProps {
  tabs: AdminTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabsList className="w-full mb-4 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-2">
      {tabs.map((tab) => (
        <TabsTrigger 
          key={tab.id}
          value={tab.id}
          className="text-xs md:text-sm lg:text-base px-2 py-1 md:p-2"
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default AdminTabs;
