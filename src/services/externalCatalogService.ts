
import { ExternalUrlCatalog, ExternalUrlCatalogFormData } from '@/types/externalCatalogTypes';
import { localStorageService } from './localStorageService';

export const externalCatalogService = {
  async getAllCatalogs(): Promise<ExternalUrlCatalog[]> {
    try {
      const catalogs = localStorageService.getExternalCatalogs();
      return catalogs.map(catalog => ({
        id: catalog.id,
        title: catalog.title,
        description: catalog.description,
        external_cover_image_url: catalog.external_cover_image_url,
        external_content_image_urls: catalog.external_content_image_urls,
        created_at: catalog.created_at
      }));
    } catch (error) {
      console.error('Error fetching external catalogs:', error);
      throw new Error('Erro ao buscar catálogos externos');
    }
  },

  async createCatalog(catalogData: ExternalUrlCatalogFormData): Promise<ExternalUrlCatalog> {
    try {
      const newCatalog = {
        id: crypto.randomUUID(),
        title: catalogData.title,
        description: catalogData.description || '',
        external_cover_image_url: catalogData.external_cover_image_url,
        external_content_image_urls: catalogData.external_content_image_urls,
        created_at: new Date().toISOString()
      };
      
      localStorageService.addExternalCatalog(newCatalog);
      return newCatalog;
    } catch (error) {
      console.error('Error creating external catalog:', error);
      throw new Error('Erro ao criar catálogo externo');
    }
  },

  async updateCatalog(id: string, catalogData: Partial<ExternalUrlCatalogFormData>): Promise<ExternalUrlCatalog> {
    try {
      const catalogs = localStorageService.getExternalCatalogs();
      const existingCatalog = catalogs.find(c => c.id === id);
      
      if (!existingCatalog) {
        throw new Error('Catálogo não encontrado');
      }
      
      const updatedCatalog = {
        ...existingCatalog,
        ...catalogData,
        description: catalogData.description || existingCatalog.description
      };
      
      localStorageService.addExternalCatalog(updatedCatalog);
      return updatedCatalog;
    } catch (error) {
      console.error('Error updating external catalog:', error);
      throw new Error('Erro ao atualizar catálogo externo');
    }
  },

  async deleteCatalog(id: string): Promise<void> {
    try {
      localStorageService.deleteExternalCatalog(id);
    } catch (error) {
      console.error('Error deleting external catalog:', error);
      throw new Error('Erro ao deletar catálogo externo');
    }
  }
};

// Export individual functions for easier importing
export const fetchExternalCatalogs = externalCatalogService.getAllCatalogs;
export const deleteExternalCatalog = externalCatalogService.deleteCatalog;

export const saveExternalCatalog = async (catalogData: ExternalUrlCatalogFormData & { id?: string }) => {
  if (catalogData.id) {
    const { id, ...updateData } = catalogData;
    return await externalCatalogService.updateCatalog(id, updateData);
  } else {
    return await externalCatalogService.createCatalog(catalogData);
  }
};
