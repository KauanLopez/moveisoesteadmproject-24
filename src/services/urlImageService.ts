
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
      console.log('Starting URL upload:', imageUrl);

      // Validate URL format first
      if (!validateImageUrl(imageUrl)) {
        throw new Error('URL fornecida não é uma URL de imagem válida');
      }

      // Check URL accessibility before sending to edge function
      const isAccessible = await checkUrlAccessibility(imageUrl);
      if (!isAccessible) {
        throw new Error('Não foi possível acessar a imagem na URL fornecida');
      }

      const { data, error } = await supabase.functions.invoke('upload-image-from-url', {
        body: {
          imageUrl,
          bucketName,
          filename
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'Erro ao processar upload da URL');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Falha no upload da imagem');
      }

      console.log('URL upload completed:', data.url);
      return data.url;
    } catch (error: any) {
      console.error('URL upload error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('CORS')) {
        throw new Error('Erro de CORS: A imagem não pode ser acessada devido a restrições do servidor');
      }
      if (error.message?.includes('timeout')) {
        throw new Error('Timeout: A imagem demorou muito para ser baixada');
      }
      if (error.message?.includes('404')) {
        throw new Error('Imagem não encontrada na URL fornecida');
      }
      if (error.message?.includes('403')) {
        throw new Error('Acesso negado: Sem permissão para acessar a imagem');
      }
      
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
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check file extension
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
    // Also check for common image hosting patterns
    const isImageHost = [
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'imgur.com',
      'i.imgur.com'
    ].some(host => urlObj.hostname.includes(host));
    
    return hasValidExtension || isImageHost || pathname.includes('/image/') || urlObj.searchParams.has('format');
  } catch {
    return false;
  }
};

/**
 * Check if URL is accessible with better error handling
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // This will help with CORS issues for basic accessibility check
    });
    
    clearTimeout(timeoutId);
    
    // With no-cors mode, we can't check response.ok, but if no error is thrown, URL is accessible
    return true;
  } catch (error: any) {
    console.warn('URL accessibility check failed:', error.message);
    
    // If HEAD request fails, try a GET request with no-cors
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      await fetch(url, { 
        method: 'GET',
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }
};
