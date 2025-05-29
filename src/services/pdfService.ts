
import { CatalogPdfPage } from "@/types/catalogTypes";
import { authService } from "./authService";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Mock upload function for frontend-only implementation
export const uploadPdfFile = async (file: File): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock uploading PDF file:', file.name);
      
      // Preparar o nome do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUUID()}.${fileExt}`;
      const mockUrl = `/mock-pdfs/${fileName}`;

      console.log('Mock PDF uploaded successfully, URL:', mockUrl);
      return mockUrl;
    } catch (error: any) {
      console.error('Exception while uploading PDF:', error);
      throw error;
    }
  });
};

// Mock process function for frontend-only implementation
export const processPdfToImages = async (pdfUrl: string, catalogId: string): Promise<{ success: boolean; pagesCount: number; coverImage?: string }> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock processing PDF:', pdfUrl, 'for catalog:', catalogId);
      
      return {
        success: true,
        pagesCount: 10,
        coverImage: '/mock-covers/sample-cover.jpg'
      };
    } catch (error: any) {
      console.error('Exception while processing PDF:', error);
      throw error;
    }
  });
};

// Mock fetch function for frontend-only implementation
export const fetchCatalogPdfPages = async (catalogId: string): Promise<CatalogPdfPage[]> => {
  try {
    // Since we don't have a database, return empty array
    return [];
  } catch (error: any) {
    console.error(`Exception fetching PDF pages for catalog ${catalogId}:`, error);
    throw error;
  }
};
