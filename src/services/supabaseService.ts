
import { supabase } from '@/integrations/supabase/client';
import { ExternalUrlCatalog, FeaturedProduct, ContentItem } from '@/types/customTypes';

// Authentication helpers
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Catalog operations
export const catalogService = {
  async getAllCatalogs(): Promise<ExternalUrlCatalog[]> {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCatalog(catalog: {
    title: string;
    description?: string;
    external_cover_image_url: string;
    external_content_image_urls?: string[];
  }): Promise<ExternalUrlCatalog> {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .insert([{
        ...catalog,
        external_content_image_urls: catalog.external_content_image_urls || []
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCatalog(id: string, updates: Partial<ExternalUrlCatalog>): Promise<ExternalUrlCatalog> {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCatalog(id: string): Promise<void> {
    const { error } = await supabase
      .from('external_url_catalogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Featured products operations
export const featuredProductsService = {
  async getFeaturedProducts(): Promise<FeaturedProduct[]> {
    const { data, error } = await supabase
      .from('featured_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addFeaturedProduct(product: {
    image_url: string;
    catalog_id?: string;
    title?: string;
    description?: string;
  }): Promise<FeaturedProduct> {
    const { data, error } = await supabase
      .from('featured_products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFeaturedProduct(imageUrl: string): Promise<void> {
    const { error } = await supabase
      .from('featured_products')
      .delete()
      .eq('image_url', imageUrl);

    if (error) throw error;
  },

  async isFeatured(imageUrl: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('featured_products')
      .select('id')
      .eq('image_url', imageUrl)
      .single();

    return !error && !!data;
  }
};

// Content operations
export const contentService = {
  async getContent(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getContentBySection(section: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section', section)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createContent(content: {
    section: string;
    title?: string;
    description?: string;
    image_url?: string;
    object_position?: string;
    scale?: number;
  }): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content')
      .insert([content])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Profile operations
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: { full_name?: string; role?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
