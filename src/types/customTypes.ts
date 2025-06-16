
import { Database } from "@/integrations/supabase/types";

// Since the database is empty, we'll create our own types for now
export type Tables = Database['public']['Tables'];

// Define our own content and profile types since they don't exist in the database yet
export type ContentItem = {
  id: string;
  section: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  object_position: string | null;
  scale: number | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

// Custom types that extend our defined types
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
