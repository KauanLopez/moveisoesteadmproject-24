
import React from 'react';
import { Button } from "@/components/ui/button";

interface AdminTabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2 border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={`rounded-lg px-4 py-2 ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-gray-600 hover:text-primary hover:bg-gray-100"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default AdminTabs;
