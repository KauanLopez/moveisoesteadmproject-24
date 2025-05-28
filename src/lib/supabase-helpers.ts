
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types are regenerated
export interface ContentRow {
  id: string;
  section: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  object_position: string | null;
  scale: number | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogRow {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  slug: string;
  category_id: string | null;
  pdf_file_url: string | null;
  pdf_filename: string | null;
  total_pages: number | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogItemRow {
  id: string;
  catalog_id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

// Type-safe database operations
export const dbOperations = {
  content: {
    async selectAll() {
      const { data, error } = await (supabase as any)
        .from('content')
        .select('*');
      return { data: data as ContentRow[] | null, error };
    },
    
    async selectBySection(section: string) {
      const { data, error } = await (supabase as any)
        .from('content')
        .select('*')
        .eq('section', section);
      return { data: data as ContentRow[] | null, error };
    },
    
    async upsert(item: Partial<ContentRow>) {
      const { data, error } = await (supabase as any)
        .from('content')
        .upsert(item)
        .select();
      return { data: data as ContentRow[] | null, error };
    },
    
    async delete(id: string) {
      const { error } = await (supabase as any)
        .from('content')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  catalogs: {
    async selectById(id: string) {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .select('id, title, description, cover_image, pdf_file_url, total_pages')
        .eq('id', id)
        .single();
      return { data: data as CatalogRow | null, error };
    }
  },
  
  catalogItems: {
    async selectByCatalogId(catalogId: string) {
      const { data, error } = await (supabase as any)
        .from('catalog_items')
        .select('id, image_url, title, description')
        .eq('catalog_id', catalogId)
        .order('display_order', { ascending: true });
      return { data: data as CatalogItemRow[] | null, error };
    }
  }
};
