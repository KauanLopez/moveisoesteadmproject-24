
import { supabase } from "@/integrations/supabase/client";
import { CatalogCategory } from "@/types/catalogTypes";

// Fetch all catalog categories
export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
  const { data, error } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching catalog categories:', error);
    return [];
  }
  
  return data || [];
};

// Create a new catalog category
export const saveCatalogCategory = async (category: Partial<CatalogCategory> & { name: string }): Promise<CatalogCategory | null> => {
  const { data, error } = await supabase
    .from('catalog_categories')
    .upsert(category as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving catalog category:', error);
    return null;
  }
  
  return data;
};

// Delete a catalog category
export const deleteCatalogCategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('catalog_categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting catalog category:', error);
    return false;
  }
  
  return true;
};
