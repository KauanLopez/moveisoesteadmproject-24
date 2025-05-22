
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Verifica se um bucket existe e cria se não existir
 */
const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Verificar se o bucket existe
    const { data: bucketExists, error: checkError } = await supabase
      .storage
      .getBucket(bucketName);
    
    if (checkError) {
      console.error('Error checking bucket:', checkError);
      throw checkError;
    }

    // Se o bucket não existir, criá-lo
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
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string | null> => {
  try {
    // Verificar autenticação
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('User not authenticated. Cannot upload images without authentication.');
      throw new Error("Usuário não autenticado. Faça login para fazer upload de imagens.");
    }
    
    // Determinar qual bucket usar com base na pasta
    const bucketName = folder === 'catalog-images' ? 'catalog-images' : 'catalog-covers';
    
    console.log(`Uploading file to bucket: ${bucketName}`);
    
    // Garantir que o bucket exista
    const bucketCreated = await ensureBucketExists(bucketName);
    if (!bucketCreated) {
      throw new Error("Falha ao criar ou verificar bucket de armazenamento.");
    }

    // Preparar o nome do arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

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
    throw error; // Propagar erro para tratamento adequado pelo componente
  }
};
