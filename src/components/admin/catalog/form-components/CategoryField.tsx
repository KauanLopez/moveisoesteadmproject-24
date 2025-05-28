
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { CatalogFormValues } from '../types/CatalogFormTypes';
import { CatalogCategory } from '@/types/catalogTypes';

interface CategoryFieldProps {
  form: UseFormReturn<CatalogFormValues>;
  categories: CatalogCategory[];
}

const CategoryField: React.FC<CategoryFieldProps> = ({ form, categories }) => {
  // Add console logging to debug the categories data
  console.log('CategoryField - Raw categories:', categories);
  
  // Ultra-defensive filtering to ensure we only get valid categories
  const validCategories = (categories || []).filter(category => {
    // Check if category exists and is an object
    if (!category || typeof category !== 'object') {
      console.log('CategoryField - Invalid category (not object):', category);
      return false;
    }
    
    // Check if category has valid id - must be non-empty string
    if (!category.id || typeof category.id !== 'string' || category.id.trim().length === 0) {
      console.log('CategoryField - Invalid category ID:', category);
      return false;
    }
    
    // Check if category has valid name
    if (!category.name || typeof category.name !== 'string' || category.name.trim().length === 0) {
      console.log('CategoryField - Invalid category name:', category);
      return false;
    }
    
    return true;
  });

  console.log('CategoryField - Valid categories after filtering:', validCategories);

  // Safety function to ensure we never pass empty values to SelectItem
  const renderSelectItems = () => {
    if (validCategories.length === 0) {
      return (
        <SelectItem value="placeholder-no-categories" disabled>
          Nenhuma categoria disponível
        </SelectItem>
      );
    }

    return validCategories.map(category => {
      // Triple check the category ID before rendering
      const categoryId = category.id?.toString().trim();
      if (!categoryId || categoryId === '') {
        console.error('CategoryField - Skipping category with invalid ID:', category);
        return null;
      }
      
      return (
        <SelectItem key={categoryId} value={categoryId}>
          {category.name}
        </SelectItem>
      );
    }).filter(Boolean); // Remove any null items
  };

  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select 
            onValueChange={(value) => {
              // Ensure we never set empty string
              if (value && value.trim() !== '' && value !== 'placeholder-no-categories') {
                field.onChange(value);
              }
            }} 
            defaultValue={field.value || ""}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderSelectItems()}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
