
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalogs'): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${generateUUID()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('catalog_images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: urlData } = supabase
    .storage
    .from('catalog_images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
