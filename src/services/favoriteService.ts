
import { supabase } from "@/integrations/supabase/client";
import { CatalogItem, CatalogItemWithFavorite } from "@/types/catalogTypes";

// Toggle favorite status for a catalog item
export const toggleFavoriteStatus = async (itemId: string, isFavorite: boolean): Promise<boolean> => {
  // Currently, we'll handle favorites by adding the item to the content table with 'products' section
  // In a real-world app with a dedicated favorites table, you'd update that instead
  
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
        section: 'products',
        catalog_item_id: itemId // Link to original catalog item
      });
      
    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  } else {
    // Remove from favorites
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('catalog_item_id', itemId)
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
  const { data, error } = await supabase
    .from('content')
    .select('id')
    .eq('catalog_item_id', itemId)
    .eq('section', 'products');
    
  if (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
  
  return data && data.length > 0;
};

// Get all favorite items
export const getFavoriteItems = async (): Promise<any[]> => {
  // Using explicit typing to avoid the "excessively deep" error
  interface FavoriteItem {
    id: string;
    title: string;
    image: string;
    catalog_item_id: string;
    catalog_items: CatalogItem;
  }
  
  const { data, error } = await supabase
    .from('content')
    .select(`
      id,
      title,
      image_url as image,
      catalog_item_id,
      catalog_items (*)
    `)
    .eq('section', 'products');
    
  if (error) {
    console.error('Error fetching favorite items:', error);
    return [];
  }
  
  return data as unknown as FavoriteItem[] || [];
};
