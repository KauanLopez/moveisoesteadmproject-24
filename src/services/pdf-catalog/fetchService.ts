
import { supabase } from "@/integrations/supabase/client";
import { PdfCatalog } from './types';
import { transformPdfCatalogData } from './utils';

/**
 * Fetch all PDF catalogs
 */
export const fetchPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching PDF catalogs:', error);
      throw error;
    }
    
    console.log('Raw PDF catalog data:', data);
    return transformPdfCatalogData(data);
  } catch (error: any) {
    console.error('Exception fetching PDF catalogs:', error);
    throw error;
  }
};

/**
 * Fetch completed PDF catalogs for public display
 */
export const fetchCompletedPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    console.log('Fetching completed PDF catalogs...');
    
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching completed PDF catalogs:', error);
      throw error;
    }
    
    console.log('All PDF catalogs from database:', data);
    
    // Check specifically for SAMEC catalog
    const samecCatalog = data?.find(cat => cat.title === 'Catalogo SAMEC');
    console.log('SAMEC catalog found:', samecCatalog);
    
    // Filter catalogs that have a cover image
    const completedCatalogs = data?.filter(catalog => catalog.cover_image_url) || [];
    console.log('Catalogs with cover images:', completedCatalogs);
    
    const transformed = transformPdfCatalogData(completedCatalogs);
    console.log('Transformed completed PDF catalogs:', transformed);
    return transformed;
  } catch (error: any) {
    console.error('Exception fetching completed PDF catalogs:', error);
    throw error;
  }
};
