
import { CatalogCategory } from "@/types/catalogTypes";

// Mock functions for frontend-only implementation
export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
  try {
    // Return empty array since we don't have a database
    return [];
  } catch (error) {
    console.error('Error fetching catalog categories:', error);
    return [];
  }
};

export const saveCategory = async (category: Partial<CatalogCategory>): Promise<CatalogCategory | null> => {
  try {
    // Return mock data since we don't have a database
    if (!category.name) {
      throw new Error('Name is required for new categories');
    }
    
    const mockCategory: CatalogCategory = {
      id: category.id || crypto.randomUUID(),
      name: category.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockCategory;
  } catch (error) {
    console.error('Error saving category:', error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    // Return true since we don't have a database
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// Alias for backward compatibility
export const deleteCatalogCategory = deleteCategory;
