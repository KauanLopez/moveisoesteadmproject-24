
import { supabase } from "@/integrations/supabase/client";

// Check if an item is marked as favorite
export const checkFavoriteStatus = async (itemId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('id', itemId)
      .eq('section', 'products')
      .single();
    
    return !!data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Toggle an item's favorite status
export const toggleFavoriteStatus = async (itemId: string, shouldBeFavorite: boolean): Promise<boolean> => {
  try {
    if (shouldBeFavorite) {
      // First, get the item details from catalog_items
      const { data: item } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('id', itemId)
        .single();
      
      if (!item) return false;
      
      // Then create a new entry in content table
      const { error } = await supabase.from('content').insert({
        id: item.id,
        section: 'products',
        title: item.title || 'Featured Product',
        description: item.description || '',
        image_url: item.image_url
      });
      
      return !error;
    } else {
      // Remove the item from content table
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', itemId)
        .eq('section', 'products');
      
      return !error;
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return false;
  }
};

// Get all favorite items
export const getFavoriteItems = async () => {
  try {
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('section', 'products');
    
    return data || [];
  } catch (error) {
    console.error('Error getting favorite items:', error);
    return [];
  }
};
