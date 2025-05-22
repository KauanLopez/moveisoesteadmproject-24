
import { supabase } from "@/integrations/supabase/client";
import { CatalogCategory } from "@/types/catalogTypes";

// Fetch all catalog categories
export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('catalog_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching categories:', error);
    return [];
  }
};

// Save a category (create or update)
export const saveCategory = async (category: Partial<CatalogCategory> & { name: string }): Promise<CatalogCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('catalog_categories')
      .upsert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving category:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception saving category:', error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('catalog_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting category:', error);
    return false;
  }
};
