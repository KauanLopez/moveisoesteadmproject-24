
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
  order: number | null;
  created_at: string;
  updated_at: string;
}

export interface FeaturedItemRow {
  id: string;
  catalog_id: string;
  image_url: string;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
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
    async selectAll() {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .select(`
          *,
          catalog_categories!inner(name)
        `)
        .order('created_at', { ascending: false });
      return { data: data as CatalogRow[] | null, error };
    },
    
    async selectById(id: string) {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .select('*')
        .eq('id', id)
        .single();
      return { data: data as CatalogRow | null, error };
    },
    
    async selectBySlug(slug: string) {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .select('*')
        .eq('slug', slug)
        .single();
      return { data: data as CatalogRow | null, error };
    },
    
    async insert(catalog: Partial<CatalogRow>) {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .insert(catalog)
        .select()
        .single();
      return { data: data as CatalogRow | null, error };
    },
    
    async update(id: string, catalog: Partial<CatalogRow>) {
      const { data, error } = await (supabase as any)
        .from('catalogs')
        .update(catalog)
        .eq('id', id)
        .select()
        .single();
      return { data: data as CatalogRow | null, error };
    },
    
    async delete(id: string) {
      const { error } = await (supabase as any)
        .from('catalogs')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  catalogItems: {
    async selectByCatalogId(catalogId: string) {
      const { data, error } = await (supabase as any)
        .from('catalog_items')
        .select('*')
        .eq('catalog_id', catalogId)
        .order('order', { ascending: true });
      return { data: data as CatalogItemRow[] | null, error };
    },
    
    async insert(item: Partial<CatalogItemRow>) {
      const { data, error } = await (supabase as any)
        .from('catalog_items')
        .insert(item)
        .select()
        .single();
      return { data: data as CatalogItemRow | null, error };
    },
    
    async update(id: string, item: Partial<CatalogItemRow>) {
      const { data, error } = await (supabase as any)
        .from('catalog_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      return { data: data as CatalogItemRow | null, error };
    },
    
    async delete(id: string) {
      const { error } = await (supabase as any)
        .from('catalog_items')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  featuredItems: {
    async selectAll() {
      const { data, error } = await (supabase as any)
        .from('featured_items')
        .select('*')
        .order('created_at', { ascending: false });
      return { data: data as FeaturedItemRow[] | null, error };
    },
    
    async insert(item: Partial<FeaturedItemRow>) {
      const { data, error } = await (supabase as any)
        .from('featured_items')
        .insert(item)
        .select()
        .single();
      return { data: data as FeaturedItemRow | null, error };
    },
    
    async delete(id: string) {
      const { error } = await (supabase as any)
        .from('featured_items')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  categories: {
    async selectAll() {
      const { data, error } = await (supabase as any)
        .from('catalog_categories')
        .select('*')
        .order('name', { ascending: true });
      return { data: data as CategoryRow[] | null, error };
    },
    
    async insert(category: Partial<CategoryRow>) {
      const { data, error } = await (supabase as any)
        .from('catalog_categories')
        .insert(category)
        .select()
        .single();
      return { data: data as CategoryRow | null, error };
    },
    
    async update(id: string, category: Partial<CategoryRow>) {
      const { data, error } = await (supabase as any)
        .from('catalog_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      return { data: data as CategoryRow | null, error };
    },
    
    async delete(id: string) {
      const { error } = await (supabase as any)
        .from('catalog_categories')
        .delete()
        .eq('id', id);
      return { error };
    }
  }
};
