
import { supabase } from "@/integrations/supabase/client";
import { CatalogCategory } from "@/types/catalogTypes";

// Fetch categories
export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('catalog_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching catalog categories:', error);
    return [];
  }
};

// Save category (create or update)
export const saveCategory = async (category: Partial<CatalogCategory>): Promise<CatalogCategory | null> => {
  try {
    // Ensure name is provided when required by database
    if (!category.id && !category.name) {
      throw new Error('Name is required for new categories');
    }
    
    const { data, error } = await supabase
      .from('catalog_categories')
      .upsert({
        id: category.id,
        name: category.name || '', // Ensure name is not undefined
        // Don't include created_at or updated_at, they have defaults
      })
      .select();
    
    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error saving category:', error);
    return null;
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('catalog_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// Alias for backward compatibility
export const deleteCatalogCategory = deleteCategory;
