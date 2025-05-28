
import { supabase } from "@/integrations/supabase/client";
import { authService } from "../authService";
import { PdfCatalogFormData } from './types';

/**
 * Update PDF catalog metadata
 */
export const updatePdfCatalog = async (id: string, data: PdfCatalogFormData): Promise<boolean> => {
  return await authService.withValidSession(async () => {
    try {
      const { error } = await supabase
        .from('pdf_derived_catalogs')
        .update({
          title: data.title,
          description: data.description
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating PDF catalog:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Exception updating PDF catalog:', error);
      throw error;
    }
  });
};

/**
 * Delete PDF catalog and associated files
 */
export const deletePdfCatalog = async (id: string): Promise<boolean> => {
  return await authService.withValidSession(async () => {
    try {
      const { error } = await supabase
        .from('pdf_derived_catalogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting PDF catalog:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Exception deleting PDF catalog:', error);
      throw error;
    }
  });
};
