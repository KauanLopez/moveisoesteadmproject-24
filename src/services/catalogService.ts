
import { Catalog, CatalogItem, CatalogWithCategory, CatalogFormData } from "@/types/catalogTypes";
import { localStorageService } from './localStorageService';

// Mock authentication check for frontend-only
const checkAuthenticated = async () => {
  const isAuthenticated = localStorage.getItem('frontend_auth') === 'true';
  if (!isAuthenticated) {
    throw new Error("Usuário não autenticado. Faça login para continuar.");
  }
  return true;
};

// Fetch all catalogs with their categories
export const fetchCatalogs = async (): Promise<CatalogWithCategory[]> => {
  try {
    await checkAuthenticated();
    
    // Since we don't have a real database, return empty array or mock data
    // This function would need to be implemented with localStorage if needed
    return [];
  } catch (error: any) {
    console.error('Exception fetching catalogs:', error);
    throw error;
  }
};

// Fetch a single catalog by slug
export const fetchCatalogBySlug = async (slug: string): Promise<CatalogWithCategory | null> => {
  try {
    // Since we don't have a real database, return null
    // This function would need to be implemented with localStorage if needed
    return null;
  } catch (error: any) {
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
    
    // Since we don't have a real database, return mock data
    // This function would need to be implemented with localStorage if needed
    const mockCatalog: Catalog = {
      id: crypto.randomUUID(),
      title: catalogData.title,
      description: catalogData.description || '',
      slug: 'slug' in catalogData && catalogData.slug ? catalogData.slug : generateSlug(catalogData.title),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockCatalog;
  } catch (error: any) {
    console.error('Exception saving catalog:', error);
    throw error;
  }
};

// Delete a catalog
export const deleteCatalog = async (id: string): Promise<boolean> => {
  try {
    await checkAuthenticated();
    
    // Since we don't have a real database, return true
    // This function would need to be implemented with localStorage if needed
    return true;
  } catch (error: any) {
    console.error('Error deleting catalog:', error);
    throw error;
  }
};

// Fetch catalog items for a specific catalog
export const fetchCatalogItems = async (catalogId: string): Promise<CatalogItem[]> => {
  try {
    await checkAuthenticated();
    
    // Since we don't have a real database, return empty array
    // This function would need to be implemented with localStorage if needed
    return [];
  } catch (error: any) {
    console.error(`Exception fetching items for catalog ${catalogId}:`, error);
    throw error;
  }
};

// Create or update a catalog item
export const saveCatalogItem = async (item: Partial<CatalogItem> & { catalog_id: string, image_url: string }): Promise<CatalogItem | null> => {
  try {
    await checkAuthenticated();
    
    // Since we don't have a real database, return mock data
    // This function would need to be implemented with localStorage if needed
    const mockItem: CatalogItem = {
      id: crypto.randomUUID(),
      catalog_id: item.catalog_id,
      image_url: item.image_url,
      title: item.title,
      description: item.description,
      display_order: item.display_order || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockItem;
  } catch (error: any) {
    console.error('Error saving catalog item:', error);
    throw error;
  }
};

// Delete a catalog item
export const deleteCatalogItem = async (id: string): Promise<boolean> => {
  try {
    await checkAuthenticated();
    
    // Since we don't have a real database, return true
    // This function would need to be implemented with localStorage if needed
    return true;
  } catch (error: any) {
    console.error('Error deleting catalog item:', error);
    throw error;
  }
};
