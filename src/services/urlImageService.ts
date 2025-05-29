
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
 * Mock upload function for frontend-only implementation
 */
export const uploadImageFromUrl = async (
  imageUrl: string, 
  bucketName: 'catalog-images' | 'catalog-covers' = 'catalog-images',
  filename?: string
): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log('Mock starting URL upload:', imageUrl);

      // Validate URL format first
      if (!validateImageUrl(imageUrl)) {
        throw new Error('URL fornecida não é uma URL de imagem válida');
      }

      // For frontend-only, just return the original URL
      console.log('Mock URL upload completed:', imageUrl);
      return imageUrl;
    } catch (error: any) {
      console.error('URL upload error:', error);
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
 * Mock accessibility check for frontend-only implementation
 */
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    // For frontend-only, always return true if URL is valid
    return validateImageUrl(url);
  } catch {
    return false;
  }
};
