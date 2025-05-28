
export interface ExternalUrlCatalog {
  id: string;
  title: string;
  description?: string;
  external_cover_image_url: string;
  external_content_image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface ExternalUrlCatalogFormData {
  title: string;
  description?: string;
  external_cover_image_url: string;
  external_content_image_urls: string[];
}
