
import { Database } from "@/integrations/supabase/types";

// Export convenience types that reference the generated types
export type Tables = Database['public']['Tables'];
export type ContentItem = Tables['content']['Row'];
export type Profile = Tables['profiles']['Row'];
export type ExternalUrlCatalog = Tables['external_url_catalogs']['Row'];
export type FeaturedProduct = Tables['featured_products']['Row'];

// Custom types that extend database types
export type ImageContent = {
  id: string;
  section: string;
  title: string;
  description: string;
  image: string;
  objectPosition: string;
  scale?: number;
};

// Function to convert database content to our ImageContent type
export const mapDbContentToImageContent = (dbContent: ContentItem): ImageContent => {
  return {
    id: dbContent.id,
    section: dbContent.section,
    title: dbContent.title || '',
    description: dbContent.description || '',
    image: dbContent.image_url || '',
    objectPosition: dbContent.object_position || 'center',
    scale: dbContent.scale || 1
  };
};

// Function to convert our ImageContent type to database format
export const mapImageContentToDb = (content: ImageContent): Partial<ContentItem> => {
  return {
    id: content.id,
    section: content.section,
    title: content.title,
    description: content.description,
    image_url: content.image,
    object_position: content.objectPosition,
    scale: content.scale
  };
};
