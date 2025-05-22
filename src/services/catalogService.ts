
import { supabase } from "@/integrations/supabase/client";
import { Catalog, CatalogItem, CatalogWithCategory } from "@/types/catalogTypes";

// Fetch all catalogs with their categories
export const fetchCatalogs = async (): Promise<CatalogWithCategory[]> => {
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      *,
      catalog_categories (
        name
      )
    `)
    .order('title');
  
  if (error) {
    console.error('Error fetching catalogs:', error);
    return [];
  }
  
  // Transform data to include category name directly
  return data.map(catalog => ({
    ...catalog,
    category_name: catalog.catalog_categories?.name
  })) || [];
};

// Fetch a single catalog by slug
export const fetchCatalogBySlug = async (slug: string): Promise<CatalogWithCategory | null> => {
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      *,
      catalog_categories (
        name
      )
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching catalog with slug ${slug}:`, error);
    return null;
  }
  
  return {
    ...data,
    category_name: data.catalog_categories?.name
  };
};

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// Create or update a catalog
export const saveCatalog = async (catalog: Partial<Catalog> & { title: string }): Promise<Catalog | null> => {
  // If a slug is not provided, generate one from the title
  const catalogData = {
    ...catalog,
    slug: catalog.slug || generateSlug(catalog.title),
  };

  const { data, error } = await supabase
    .from('catalogs')
    .upsert(catalogData)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving catalog:', error);
    return null;
  }
  
  return data;
};

// Delete a catalog
export const deleteCatalog = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('catalogs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting catalog:', error);
    return false;
  }
  
  return true;
};

// Fetch catalog items for a specific catalog
export const fetchCatalogItems = async (catalogId: string): Promise<CatalogItem[]> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('catalog_id', catalogId)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error(`Error fetching items for catalog ${catalogId}:`, error);
    return [];
  }
  
  return data || [];
};

// Create or update a catalog item
export const saveCatalogItem = async (item: Partial<CatalogItem> & { catalog_id: string, image_url: string }): Promise<CatalogItem | null> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .upsert(item)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving catalog item:', error);
    return null;
  }
  
  return data;
};

// Delete a catalog item
export const deleteCatalogItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('catalog_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting catalog item:', error);
    return false;
  }
  
  return true;
};
