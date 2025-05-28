
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
  // More robust filtering to ensure we only get valid categories
  const validCategories = categories.filter(category => {
    return category && 
           category.id && 
           typeof category.id === 'string' && 
           category.id.trim().length > 0 &&
           category.name &&
           typeof category.name === 'string' &&
           category.name.trim().length > 0;
  });

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
                validCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-categories" disabled>
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
