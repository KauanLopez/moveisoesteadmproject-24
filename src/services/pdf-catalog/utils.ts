
import { PdfCatalog } from './types';

/**
 * Transform raw database data to PdfCatalog interface
 */
export const transformPdfCatalogData = (data: any[]): PdfCatalog[] => {
  return (data || []).map(item => ({
    ...item,
    content_image_urls: Array.isArray(item.content_image_urls) 
      ? item.content_image_urls as string[]
      : (item.content_image_urls as any)?.length 
        ? JSON.parse(item.content_image_urls as string) 
        : [],
    processing_status: item.processing_status as 'pending' | 'processing' | 'completed' | 'failed'
  }));
};
