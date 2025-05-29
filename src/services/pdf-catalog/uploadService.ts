
import { authService } from "../authService";

/**
 * Mock upload function for frontend-only implementation
 */
export const uploadPdfCatalog = async (file: File): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock uploading PDF catalog:', file.name);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'pdf') {
        throw new Error('Apenas arquivos PDF são permitidos.');
      }
      
      const catalogId = crypto.randomUUID();
      console.log('Mock PDF catalog uploaded, returning catalog ID:', catalogId);
      return catalogId;
    } catch (error: any) {
      console.error('Exception while uploading PDF catalog:', error);
      throw error;
    }
  });
};
