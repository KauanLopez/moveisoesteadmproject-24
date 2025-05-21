
import React from 'react';
import { Input } from '@/components/ui/input';
import { ImageContent } from '@/types/customTypes';

interface ContentFormProps {
  item: ImageContent;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  item, 
  onTitleChange, 
  onDescriptionChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Informações</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <Input
            type="text"
            value={item.title}
            onChange={onTitleChange}
            placeholder="Título"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={item.description}
            onChange={onDescriptionChange}
            placeholder="Descrição"
            className="w-full min-h-[100px] p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
