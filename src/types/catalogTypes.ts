
export interface CatalogCategory {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Catalog {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  slug: string;
  category_id?: string;
  pdf_file_url?: string;
  pdf_filename?: string;
  total_pages?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CatalogWithCategory extends Catalog {
  category_name?: string;
  catalog_categories?: {
    name: string;
  };
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

export interface CatalogPdfPage {
  id: string;
  catalog_id: string;
  page_number: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CatalogFormData {
  id?: string;
  title: string;
  description?: string;
  cover_image?: string;
  slug?: string;
  category_id?: string;
  pdf_file_url?: string;
  pdf_filename?: string;
  total_pages?: number;
}

// Helper function to generate catalog route
export const getCatalogRoute = (slug: string): string => {
  return `/catalogo/${slug}`;
};

// Other utility functions related to catalogs can be added here
