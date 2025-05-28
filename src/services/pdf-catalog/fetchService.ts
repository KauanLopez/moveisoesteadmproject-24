
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
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching completed PDF catalogs:', error);
      throw error;
    }
    
    return transformPdfCatalogData(data);
  } catch (error: any) {
    console.error('Exception fetching completed PDF catalogs:', error);
    throw error;
  }
};
