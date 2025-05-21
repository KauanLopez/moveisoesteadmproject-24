
import { Database } from "@/integrations/supabase/types";

// Export convenience types that reference the generated types
export type CatalogCategory = Database['public']['Tables']['catalog_categories']['Row'];
export type Catalog = Database['public']['Tables']['catalogs']['Row'];
export type CatalogItem = Database['public']['Tables']['catalog_items']['Row'];

// Helper function to generate route for catalog
export const getCatalogRoute = (slug: string) => `/catalogo/${slug}`;
