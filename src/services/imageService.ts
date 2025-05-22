
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalogs'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Primeiro verificamos se o bucket 'catalog-images' existe
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'catalog-images');
    
    if (!bucketExists) {
      console.error('Bucket "catalog-images" not found. Using the "default" bucket instead.');
      
      // Tenta fazer upload para o bucket "default"
      const { data, error } = await supabase
        .storage
        .from('default')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: urlData } = supabase
        .storage
        .from('default')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    }

    // Se o bucket existir, usa "catalog-images"
    const { data, error } = await supabase
      .storage
      .from('catalog-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: urlData } = supabase
      .storage
      .from('catalog-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception while uploading image:', error);
    return null;
  }
};
