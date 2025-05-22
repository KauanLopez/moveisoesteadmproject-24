
import { supabase } from "@/integrations/supabase/client";
import { CatalogItem } from "@/types/catalogTypes";

// Define a simpler interface for favorite items
export interface FavoriteItem {
  id: string;
  title?: string | null;
  image_url?: string | null;
}

// Toggle favorite status for a catalog item
export const toggleFavoriteStatus = async (itemId: string, isFavorite: boolean): Promise<boolean> => {
  // Currently, we'll handle favorites by adding the item to the content table with 'products' section
  
  const { data: catalogItem, error: fetchError } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('id', itemId)
    .single();
  
  if (fetchError || !catalogItem) {
    console.error('Error fetching catalog item:', fetchError);
    return false;
  }
  
  if (isFavorite) {
    // Add to favorites (content table, products section)
    const { error } = await supabase
      .from('content')
      .insert({
        title: catalogItem.title || 'Produto em destaque',
        image_url: catalogItem.image_url,
        section: 'products'
      });
      
    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  } else {
    // Remove from favorites
    // Since we don't have catalog_item_id, we'll remove based on matching image_url
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('image_url', catalogItem.image_url)
      .eq('section', 'products');
      
    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }
  
  return true;
};

// Check if an item is already a favorite
export const checkFavoriteStatus = async (itemId: string): Promise<boolean> => {
  // First get the catalog item to find its image_url
  const { data: catalogItem, error: fetchError } = await supabase
    .from('catalog_items')
    .select('image_url')
    .eq('id', itemId)
    .single();
    
  if (fetchError || !catalogItem) {
    console.error('Error fetching catalog item:', fetchError);
    return false;
  }
  
  // Then check if this image_url exists in the content table
  const { data, error } = await supabase
    .from('content')
    .select('id')
    .eq('image_url', catalogItem.image_url)
    .eq('section', 'products');
    
  if (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
  
  return data && data.length > 0;
};

// Get all favorite items - using a simpler approach with explicit typing
export const getFavoriteItems = async (): Promise<FavoriteItem[]> => {
  // Using explicit typing to avoid deep type instantiation
  const response = await supabase
    .from('content')
    .select('id, title, image_url')
    .eq('section', 'products');
  
  if (response.error) {
    console.error('Error fetching favorite items:', response.error);
    return [];
  }
  
  // Simple type assertion that avoids complex nesting
  return (response.data || []) as FavoriteItem[];
};
