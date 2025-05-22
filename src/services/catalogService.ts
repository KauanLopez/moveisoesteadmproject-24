
import { supabase } from "@/integrations/supabase/client";
import { Catalog, CatalogItem, CatalogWithCategory, CatalogFormData } from "@/types/catalogTypes";

// Verificar autenticação
const checkAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw new Error("Usuário não autenticado. Faça login para continuar.");
  }
};

// Fetch all catalogs with their categories
export const fetchCatalogs = async (): Promise<CatalogWithCategory[]> => {
  try {
    await checkAuthenticated();
    
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
      throw error;
    }
    
    // Transform data to include category name directly
    return data.map(catalog => ({
      ...catalog,
      category_name: catalog.catalog_categories?.name
    })) || [];
  } catch (error) {
    console.error('Exception fetching catalogs:', error);
    throw error;
  }
};

// Fetch a single catalog by slug
export const fetchCatalogBySlug = async (slug: string): Promise<CatalogWithCategory | null> => {
  try {
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
      throw error;
    }
    
    return {
      ...data,
      category_name: data.catalog_categories?.name
    };
  } catch (error) {
    console.error(`Exception fetching catalog with slug ${slug}:`, error);
    throw error;
  }
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
export const saveCatalog = async (catalogData: CatalogFormData | (Partial<Catalog> & { title: string })): Promise<Catalog | null> => {
  try {
    await checkAuthenticated();
    
    // Se um slug não for fornecido, gerar um a partir do título
    const dataToSave = {
      ...catalogData,
      slug: 'slug' in catalogData && catalogData.slug ? catalogData.slug : generateSlug(catalogData.title),
    };

    console.log('Saving catalog with data:', dataToSave);

    const { data, error } = await supabase
      .from('catalogs')
      .upsert(dataToSave)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving catalog:', error);
      throw error;
    }
    
    console.log('Catalog saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception saving catalog:', error);
    throw error;
  }
};

// Delete a catalog
export const deleteCatalog = async (id: string): Promise<boolean> => {
  try {
    await checkAuthenticated();
    
    const { error } = await supabase
      .from('catalogs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting catalog:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting catalog:', error);
    throw error;
  }
};

// Fetch catalog items for a specific catalog
export const fetchCatalogItems = async (catalogId: string): Promise<CatalogItem[]> => {
  try {
    await checkAuthenticated();
    
    const { data, error } = await supabase
      .from('catalog_items')
      .select('*')
      .eq('catalog_id', catalogId)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error(`Error fetching items for catalog ${catalogId}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Exception fetching items for catalog ${catalogId}:`, error);
    throw error;
  }
};

// Create or update a catalog item
export const saveCatalogItem = async (item: Partial<CatalogItem> & { catalog_id: string, image_url: string }): Promise<CatalogItem | null> => {
  try {
    await checkAuthenticated();
    
    const { data, error } = await supabase
      .from('catalog_items')
      .upsert(item)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving catalog item:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving catalog item:', error);
    throw error;
  }
};

// Delete a catalog item
export const deleteCatalogItem = async (id: string): Promise<boolean> => {
  try {
    await checkAuthenticated();
    
    const { error } = await supabase
      .from('catalog_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting catalog item:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting catalog item:', error);
    throw error;
  }
};
