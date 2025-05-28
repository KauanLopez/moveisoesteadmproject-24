
import { supabase } from "@/integrations/supabase/client";
import { authService } from "./authService";

export interface PdfCatalog {
  id: string;
  original_pdf_url: string;
  original_pdf_filename?: string;
  cover_image_url?: string;
  content_image_urls: string[];
  title: string;
  description?: string;
  total_pages: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_error?: string;
  created_at: string;
  updated_at: string;
}

export interface PdfCatalogFormData {
  title: string;
  description?: string;
}

/**
 * Upload PDF file to raw-pdf-catalogs bucket and trigger processing
 */
export const uploadPdfCatalog = async (file: File): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Uploading PDF catalog:', file.name);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'pdf') {
        throw new Error('Apenas arquivos PDF são permitidos.');
      }
      
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload PDF to raw-pdf-catalogs bucket
      const { data, error } = await supabase
        .storage
        .from('raw-pdf-catalogs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading PDF:', error);
        throw new Error(`Erro no upload: ${error.message}`);
      }

      if (!data?.path) {
        throw new Error("Falha ao fazer upload do PDF.");
      }

      // Get the URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('raw-pdf-catalogs')
        .getPublicUrl(filePath);

      const pdfUrl = urlData.publicUrl;

      // Trigger PDF processing
      const { data: processData, error: processError } = await supabase.functions.invoke('process-pdf-catalog', {
        body: { 
          pdfUrl: pdfUrl,
          filename: file.name 
        }
      });

      if (processError) {
        console.error('Error triggering PDF processing:', processError);
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      console.log('PDF catalog uploaded and processing started:', processData);
      return processData.catalogId;
    } catch (error: any) {
      console.error('Exception while uploading PDF catalog:', error);
      throw error;
    }
  });
};

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
    
    // Convert the data with proper type casting
    return (data || []).map(item => ({
      ...item,
      content_image_urls: Array.isArray(item.content_image_urls) 
        ? item.content_image_urls as string[]
        : (item.content_image_urls as any)?.length 
          ? JSON.parse(item.content_image_urls as string) 
          : [],
      processing_status: item.processing_status as 'pending' | 'processing' | 'completed' | 'failed'
    }));
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
    
    // Convert the data with proper type casting
    return (data || []).map(item => ({
      ...item,
      content_image_urls: Array.isArray(item.content_image_urls) 
        ? item.content_image_urls as string[]
        : (item.content_image_urls as any)?.length 
          ? JSON.parse(item.content_image_urls as string) 
          : [],
      processing_status: item.processing_status as 'pending' | 'processing' | 'completed' | 'failed'
    }));
  } catch (error: any) {
    console.error('Exception fetching completed PDF catalogs:', error);
    throw error;
  }
};

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
