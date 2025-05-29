
export interface PdfCatalog {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  content_image_urls: string[];
  created_at: string;
}

export interface PdfCatalogFormData {
  title: string;
  description?: string;
}
