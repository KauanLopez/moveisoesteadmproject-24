
import { supabase } from "@/integrations/supabase/client";
import { authService } from "./authService";

export interface UrlUploadResponse {
  success: boolean;
  url?: string;
  path?: string;
  size?: number;
  type?: string;
  error?: string;
}

/**
 * Upload an image from URL using Supabase Edge Function
 */
export const uploadImageFromUrl = async (
  imageUrl: string, 
  bucketName: 'catalog-images' | 'catalog-covers' = 'catalog-images',
  filename?: string
): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Iniciando upload de URL:', imageUrl);

      const { data, error } = await supabase.functions.invoke('upload-image-from-url', {
        body: {
          imageUrl,
          bucketName,
          filename
        }
      });

      if (error) {
        console.error('Erro na Edge Function:', error);
        throw new Error(error.message || 'Erro ao processar upload da URL');
      }

      if (!data.success) {
        throw new Error(data.error || 'Falha no upload da imagem');
      }

      console.log('Upload de URL concluído:', data.url);
      return data.url;
    } catch (error: any) {
      console.error('Erro no upload de URL:', error);
      throw error;
    }
  });
};

/**
 * Validate if a URL is a valid image URL
 */
export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
};

/**
 * Check if URL is accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
