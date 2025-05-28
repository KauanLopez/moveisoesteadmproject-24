
import { supabase } from "@/integrations/supabase/client";
import { authService } from "./authService";

export interface FeaturedItem {
  id: string;
  catalog_id: string;
  image_url: string;
  created_at: string;
}

// Fetch all featured items
export const fetchFeaturedItems = async (): Promise<FeaturedItem[]> => {
  try {
    const { data, error } = await supabase
      .from('featured_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Exception fetching featured items:', error);
    throw error;
  }
};

// Add featured item
export const addFeaturedItem = async (catalogId: string, imageUrl: string): Promise<FeaturedItem | null> => {
  return await authService.withValidSession(async () => {
    try {
      const { data, error } = await supabase
        .from('featured_items')
        .insert({
          catalog_id: catalogId,
          image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding featured item:', error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Exception adding featured item:', error);
      throw error;
    }
  });
};

// Remove featured item
export const removeFeaturedItem = async (id: string): Promise<boolean> => {
  return await authService.withValidSession(async () => {
    try {
      const { error } = await supabase
        .from('featured_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error removing featured item:', error);
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error removing featured item:', error);
      throw error;
    }
  });
};
