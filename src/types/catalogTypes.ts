
import { Database } from "@/integrations/supabase/types";

// Export convenience types that reference the generated types
export type CatalogCategory = Database['public']['Tables']['catalog_categories']['Row'];
export type Catalog = Database['public']['Tables']['catalogs']['Row'];
export type CatalogItem = Database['public']['Tables']['catalog_items']['Row'];

// Extended types with additional properties
export type CatalogWithCategory = Catalog & { 
  category_name?: string 
};

// Extended types with favorite status (not in DB schema)
export type CatalogItemWithFavorite = CatalogItem & {
  is_favorite?: boolean
};

// Content type with catalog item id
export type ContentItem = Database['public']['Tables']['content']['Row'];

// Helper function to generate route for catalog
export const getCatalogRoute = (slug: string) => `/catalogo/${slug}`;
