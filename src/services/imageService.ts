
import { supabase } from "@/integrations/supabase/client";
import { authService } from "./authService";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Validate file before upload
 */
const validateImageFile = (file: File): void => {
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato não suportado. Use PNG, JPG, JPEG ou WebP.');
  }
  
  // Additional validation for file name
  if (!file.name || file.name.trim() === '') {
    throw new Error('Nome do arquivo inválido.');
  }
};

/**
 * Verifica se um bucket existe e cria se não existir
 */
const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    
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
      
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (error: any) {
    console.error('Error ensuring bucket exists:', error);
    throw new Error(`Erro ao configurar storage: ${error.message}`);
  }
};

// Upload an image to Supabase storage and return the URL
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log(`Starting upload for file: ${file.name}, size: ${file.size} bytes`);
      
      // Validate file first
      validateImageFile(file);
      
      // Determinar qual bucket usar com base na pasta
      const bucketName = folder === 'catalog-images' ? 'catalog-images' : 'catalog-covers';
      
      console.log(`Uploading file to bucket: ${bucketName}`);
      
      // Garantir que o bucket exista
      await ensureBucketExists(bucketName);

      // Preparar o nome do arquivo
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt) {
        throw new Error('Não foi possível determinar a extensão do arquivo.');
      }
      
      const fileName = `${generateUUID()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      console.log(`Uploading to path: ${filePath}`);

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
        
        // Provide more specific error messages
        if (error.message?.includes('exceeded')) {
          throw new Error('Arquivo muito grande para upload.');
        }
        if (error.message?.includes('mime')) {
          throw new Error('Tipo de arquivo não permitido.');
        }
        if (error.message?.includes('duplicate')) {
          throw new Error('Arquivo com este nome já existe.');
        }
        
        throw new Error(`Erro no upload: ${error.message}`);
      }

      if (!data?.path) {
        throw new Error("Falha ao fazer upload da imagem: caminho do arquivo não retornado.");
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Falha ao obter URL pública da imagem.");
      }

      console.log('Image uploaded successfully, URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Exception while uploading image:', error);
      
      // Re-throw with context if it's our custom error, otherwise wrap it
      if (error.message?.includes('Arquivo muito grande') || 
          error.message?.includes('Formato não suportado') ||
          error.message?.includes('Nome do arquivo inválido')) {
        throw error;
      }
      
      throw new Error(`Erro no upload da imagem: ${error.message || 'Erro desconhecido'}`);
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
