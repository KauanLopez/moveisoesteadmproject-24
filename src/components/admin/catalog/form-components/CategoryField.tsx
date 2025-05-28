
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
    
    // Check if category has valid id
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

  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || ""}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validCategories.length > 0 ? (
                validCategories.map(category => {
                  // Double-check the category ID before rendering
                  if (!category.id || category.id.trim() === '') {
                    console.error('CategoryField - Attempting to render SelectItem with invalid ID:', category);
                    return null;
                  }
                  
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  );
                }).filter(Boolean) // Remove any null items
              ) : (
                <SelectItem value="no-categories-available" disabled>
                  Nenhuma categoria disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
