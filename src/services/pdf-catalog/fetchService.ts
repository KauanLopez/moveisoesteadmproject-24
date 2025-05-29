
import { PdfCatalog } from './types';
import { localStorageService } from '../localStorageService';

/**
 * Fetch all PDF catalogs
 */
export const fetchPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    const catalogs = localStorageService.getPdfCatalogs();
    return catalogs.map(catalog => ({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description,
      cover_image_url: catalog.cover_image_url,
      content_image_urls: catalog.content_image_urls,
      created_at: catalog.created_at
    }));
  } catch (error) {
    console.error('Error fetching PDF catalogs:', error);
    throw error;
  }
};

/**
 * Fetch completed PDF catalogs for public display
 */
export const fetchCompletedPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    console.log('FetchService: Starting to fetch completed PDF catalogs...');
    
    const catalogs = localStorageService.getPdfCatalogs();
    console.log('FetchService: Total records found:', catalogs.length);
    
    // Filter catalogs that have a cover image
    const catalogsWithCover = catalogs.filter(catalog => catalog.cover_image_url);
    
    console.log('FetchService: Catalogs with cover images count:', catalogsWithCover.length);
    
    const result = catalogsWithCover.map(catalog => ({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description,
      cover_image_url: catalog.cover_image_url,
      content_image_urls: catalog.content_image_urls,
      created_at: catalog.created_at
    }));
    
    console.log('FetchService: Final return count:', result.length);
    return result;
  } catch (error) {
    console.error('FetchService: Exception fetching completed PDF catalogs:', error);
    throw error;
  }
};
