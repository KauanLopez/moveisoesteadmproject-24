
import { supabase } from "@/integrations/supabase/client";
import { authService } from "../authService";

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
