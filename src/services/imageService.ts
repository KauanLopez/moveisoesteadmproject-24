
import { supabase } from "@/integrations/supabase/client";
import { authService } from "./authService";

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
    
    if (checkError && !checkError.message.includes('not found')) {
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
  } catch (error: any) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      // Determinar qual bucket usar com base na pasta
      const bucketName = folder === 'catalog-images' ? 'catalog-images' : 'catalog-covers';
      
      console.log(`Uploading file to bucket: ${bucketName}`);
      
      // Garantir que o bucket exista
      await ensureBucketExists(bucketName);

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

      if (!data?.path) {
        throw new Error("Falha ao fazer upload da imagem: caminho do arquivo não retornado.");
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully, URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Exception while uploading image:', error);
      throw error;
    }
  });
};

// Upload para produtos em destaque e outras seções (NÃO catálogos)
export const uploadProductImage = async (file: File): Promise<string> => {
  return uploadCatalogImage(file, 'product-images');
};

// Upload para gerente e outras seções (NÃO catálogos)
export const uploadManagerImage = async (file: File): Promise<string> => {
  return uploadCatalogImage(file, 'manager-images');
};
