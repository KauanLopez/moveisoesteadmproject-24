
import { supabase } from "@/integrations/supabase/client";
import { PdfCatalogFormData } from './types';

// Update an existing catalog with new cover and content images
export const updateCatalogWithImages = async (
  catalogId: string, 
  coverImageUrl: string, 
  contentImageUrls: string[]
): Promise<boolean> => {
  try {
    // Update the catalog with the new cover image
    const { error: updateError } = await supabase
      .from('pdf_derived_catalogs')
      .update({
        cover_image_url: coverImageUrl,
        content_image_urls: contentImageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', catalogId);

    if (updateError) {
      console.error('Error updating catalog:', updateError);
      throw updateError;
    }

    return true;
  } catch (error: any) {
    console.error('Error in updateCatalogWithImages:', error);
    throw error;
  }
};

// Find catalog by title
export const findCatalogByTitle = async (title: string) => {
  try {
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .eq('title', title)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error finding catalog:', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error in findCatalogByTitle:', error);
    throw error;
  }
};
