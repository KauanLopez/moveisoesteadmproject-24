
import { supabase } from "@/integrations/supabase/client";
import { CatalogPdfPage } from "@/types/catalogTypes";
import { authService } from "./authService";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Ensures the catalog-pdfs bucket exists
 */
const ensurePdfBucketExists = async (): Promise<boolean> => {
  try {
    const { data: bucketExists, error: checkError } = await supabase
      .storage
      .getBucket('catalog-pdfs');
    
    if (checkError && !checkError.message.includes('not found')) {
      console.error('Error checking PDF bucket:', checkError);
      throw checkError;
    }

    if (!bucketExists) {
      console.log('Creating catalog-pdfs bucket...');
      const { error: bucketError } = await supabase
        .storage
        .createBucket('catalog-pdfs', {
          public: true,
          fileSizeLimit: 52428800, // 50MB for PDFs
          allowedMimeTypes: ['application/pdf']
        });

      if (bucketError) {
        console.error('Error creating PDF bucket:', bucketError);
        throw bucketError;
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Error ensuring PDF bucket exists:', error);
    throw error;
  }
};

// Upload PDF to Supabase storage
export const uploadPdfFile = async (file: File): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Uploading PDF file:', file.name);
      
      // Ensure the PDF bucket exists
      await ensurePdfBucketExists();
      
      // Preparar o nome do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUUID()}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      // Upload the file to the correct bucket
      const { data, error } = await supabase
        .storage
        .from('catalog-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading PDF:', error);
        throw error;
      }

      if (!data?.path) {
        throw new Error("Falha ao fazer upload do PDF: caminho do arquivo não retornado.");
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('catalog-pdfs')
        .getPublicUrl(filePath);

      console.log('PDF uploaded successfully, URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Exception while uploading PDF:', error);
      throw error;
    }
  });
};

// Process PDF and convert to images
export const processPdfToImages = async (pdfUrl: string, catalogId: string): Promise<{ success: boolean; pagesCount: number; coverImage?: string }> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Processing PDF:', pdfUrl, 'for catalog:', catalogId);
      
      const { data, error } = await supabase.functions.invoke('process-catalog-pdf', {
        body: { pdfUrl, catalogId }
      });
      
      if (error) {
        console.error('Error processing PDF:', error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Exception while processing PDF:', error);
      throw error;
    }
  });
};

// Fetch PDF pages for a catalog
export const fetchCatalogPdfPages = async (catalogId: string): Promise<CatalogPdfPage[]> => {
  try {
    const { data, error } = await supabase
      .from('catalog_pdf_pages')
      .select('*')
      .eq('catalog_id', catalogId)
      .order('page_number', { ascending: true });
    
    if (error) {
      console.error(`Error fetching PDF pages for catalog ${catalogId}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error(`Exception fetching PDF pages for catalog ${catalogId}:`, error);
    throw error;
  }
};
