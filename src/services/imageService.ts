
import { authService } from "./authService";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Mock upload function for frontend-only implementation
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string> => {
  return await authService.withValidSession(async () => {
    try {
      console.log(`Mock upload for file: ${file.name}, size: ${file.size} bytes`);
      
      // Validate file first
      validateImageFile(file);
      
      // Create a mock URL for the uploaded file
      const mockUrl = `/mock-uploads/${generateUUID()}.${file.name.split('.').pop()}`;
      
      console.log('Mock image uploaded successfully, URL:', mockUrl);
      return mockUrl;
    } catch (error: any) {
      console.error('Exception while uploading image:', error);
      throw error;
    }
  });
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

// Upload para produtos em destaque e outras seções (NÃO catálogos)
export const uploadProductImage = async (file: File): Promise<string> => {
  return uploadCatalogImage(file, 'product-images');
};

// Upload para gerente e outras seções (NÃO catálogos)
export const uploadManagerImage = async (file: File): Promise<string> => {
  return uploadCatalogImage(file, 'manager-images');
};
