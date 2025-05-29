
import { authService } from "../authService";
import { PdfCatalog } from './types';

/**
 * Mock fetch function for frontend-only implementation
 */
export const fetchPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock fetching all PDF catalogs');
      
      // Return mock data with all required properties
      const mockCatalogs: PdfCatalog[] = [
        {
          id: 'mock-catalog-1',
          title: 'Catálogo IMCAL',
          description: 'Nosso catálogo principal de móveis',
          cover_image_url: '/lovable-uploads/cc20161d-74c9-4c0a-9be6-51f6fdac8ee9.png',
          content_image_urls: [
            '/lovable-uploads/cc20161d-74c9-4c0a-9be6-51f6fdac8ee9.png',
            '/lovable-uploads/39819c48-1850-4472-9fa7-3c63c408457a.png'
          ],
          created_at: new Date().toISOString(),
          original_pdf_url: '',
          original_pdf_filename: 'catalog-imcal.pdf',
          total_pages: 12,
          processing_status: 'completed',
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockCatalogs;
    } catch (error: any) {
      console.error('Exception while fetching PDF catalogs:', error);
      throw error;
    }
  });
};

/**
 * Mock fetch function for completed PDF catalogs
 */
export const fetchCompletedPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock fetching completed PDF catalogs');
      
      // Return mock data with all required properties
      const mockCatalogs: PdfCatalog[] = [
        {
          id: 'mock-catalog-1',
          title: 'Catálogo IMCAL',
          description: 'Nosso catálogo principal de móveis',
          cover_image_url: '/lovable-uploads/cc20161d-74c9-4c0a-9be6-51f6fdac8ee9.png',
          content_image_urls: [
            '/lovable-uploads/cc20161d-74c9-4c0a-9be6-51f6fdac8ee9.png',
            '/lovable-uploads/39819c48-1850-4472-9fa7-3c63c408457a.png'
          ],
          created_at: new Date().toISOString(),
          original_pdf_url: '',
          original_pdf_filename: 'catalog-imcal.pdf',
          total_pages: 12,
          processing_status: 'completed',
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockCatalogs;
    } catch (error: any) {
      console.error('Exception while fetching completed PDF catalogs:', error);
      throw error;
    }
  });
};
