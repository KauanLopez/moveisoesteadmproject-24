
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CatalogFormValues } from '../types/CatalogFormTypes';

interface CatalogTitleFieldProps {
  form: UseFormReturn<CatalogFormValues>;
}

const CatalogTitleField: React.FC<CatalogTitleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Título</FormLabel>
          <FormControl>
            <Input placeholder="Título do catálogo" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CatalogTitleField;
