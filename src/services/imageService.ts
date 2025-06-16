import { authService } from "./authService";

// Helper function to generate a UUID using the crypto API
const generateUUID = () => {
  return crypto.randomUUID();
};

// Mock upload function for frontend-only implementation
export const uploadCatalogImage = async (file: File, folder: string = 'catalog-covers'): Promise<string> => {
  return await authService.withValidSession(async () => {
    // <-- MUDANÇA: A função agora retorna uma Promise que resolve com a Data URL.
    return new Promise((resolve, reject) => {
      try {
        console.log(`Processing file for Data URL: ${file.name}`);
        
        // Valida o arquivo antes de processar
        validateImageFile(file);

        const reader = new FileReader();
        
        // Quando a leitura do arquivo for concluída
        reader.onload = () => {
          console.log('Data URL created successfully.');
          resolve(reader.result as string); // Retorna a string base64 (Data URL)
        };

        // Em caso de erro na leitura
        reader.onerror = (error) => {
          console.error('Error reading file as Data URL:', error);
          reject(new Error('Não foi possível ler o arquivo para gerar a URL.'));
        };

        // Inicia a leitura do arquivo para convertê-lo em Data URL
        reader.readAsDataURL(file);

      } catch (error: any) {
        console.error('Exception while preparing image upload:', error);
        reject(error);
      }
    });
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