
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
