
import { supabase } from "@/integrations/supabase/client";
import { ExternalUrlCatalog, ExternalUrlCatalogFormData } from "@/types/externalCatalogTypes";

export const fetchExternalCatalogs = async (): Promise<ExternalUrlCatalog[]> => {
  try {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching external catalogs:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Exception fetching external catalogs:', error);
    throw error;
  }
};

export const saveExternalCatalog = async (catalogData: ExternalUrlCatalogFormData & { id?: string }): Promise<ExternalUrlCatalog | null> => {
  try {
    if (catalogData.id) {
      // Update existing catalog
      const { data, error } = await supabase
        .from('external_url_catalogs')
        .update({
          title: catalogData.title,
          description: catalogData.description,
          external_cover_image_url: catalogData.external_cover_image_url,
          external_content_image_urls: catalogData.external_content_image_urls
        })
        .eq('id', catalogData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new catalog
      const { data, error } = await supabase
        .from('external_url_catalogs')
        .insert({
          title: catalogData.title,
          description: catalogData.description,
          external_cover_image_url: catalogData.external_cover_image_url,
          external_content_image_urls: catalogData.external_content_image_urls
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving external catalog:', error);
    throw error;
  }
};

export const deleteExternalCatalog = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('external_url_catalogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting external catalog:', error);
    throw error;
  }
};
