
import React from 'react';
import { Input } from '@/components/ui/input';
import { ImageContent } from '@/types/customTypes';

interface ContentTextFieldsProps {
  item: ImageContent;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ContentTextFields: React.FC<ContentTextFieldsProps> = ({
  item,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
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
    </>
  );
};

export default ContentTextFields;
