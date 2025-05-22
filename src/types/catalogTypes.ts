
export interface CatalogCategory {
  id: string;
  name: string;
}

export interface CatalogItem {
  id: string;
  catalog_id: string;
  title?: string;
  description?: string;
  image_url: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Catalog {
  id: string;
  title: string;
  description?: string | null;
  cover_image?: string | null;
  category_id?: string | null;
  created_at?: string;
  updated_at?: string;
  slug?: string;
}

export interface CatalogWithCategory extends Catalog {
  category_name?: string;
}

export interface CatalogFormData {
  title: string;
  description?: string | null;
  cover_image: string;
  category_id: string;
}

// Helper function to get the catalog route (if needed in the future)
export const getCatalogRoute = (slug: string): string => `/catalog/${slug}`;
