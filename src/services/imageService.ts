
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Determine which bucket to use based on folder
    const bucketName = folder === 'catalog-images' ? 'catalog-images' : 'catalog-covers';
    
    console.log(`Uploading file to bucket: ${bucketName}, path: ${filePath}`);
    
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('User not authenticated. Cannot upload images without authentication.');
      throw new Error("Usuário não autenticado. Faça login para fazer upload de imagens.");
    }
    
    // Check if the bucket exists, if not create it
    const { data: bucketExists } = await supabase
      .storage
      .getBucket(bucketName);

    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      const { error: bucketError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });

      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
        throw bucketError;
      }
    }

    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully, URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception while uploading image:', error);
    return null;
  }
};
