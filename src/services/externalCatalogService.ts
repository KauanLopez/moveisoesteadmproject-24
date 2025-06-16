
import { catalogService } from './supabaseService';
import { ExternalUrlCatalog } from '@/types/customTypes';

export interface ExternalUrlCatalogFormData {
  title: string;
  description?: string;
  external_cover_image_url: string;
  external_content_image_urls?: string[];
}

export const externalCatalogService = {
  async getAllCatalogs(): Promise<ExternalUrlCatalog[]> {
    try {
      return await catalogService.getAllCatalogs();
    } catch (error) {
      console.error('Error fetching external catalogs:', error);
      throw new Error('Erro ao buscar catálogos externos');
    }
  },

  async createCatalog(catalogData: ExternalUrlCatalogFormData): Promise<ExternalUrlCatalog> {
    try {
      return await catalogService.createCatalog({
        title: catalogData.title,
        description: catalogData.description,
        external_cover_image_url: catalogData.external_cover_image_url,
        external_content_image_urls: catalogData.external_content_image_urls || []
      });
    } catch (error) {
      console.error('Error creating external catalog:', error);
      throw new Error('Erro ao criar catálogo externo');
    }
  },

  async updateCatalog(id: string, catalogData: Partial<ExternalUrlCatalogFormData>): Promise<ExternalUrlCatalog> {
    try {
      return await catalogService.updateCatalog(id, catalogData);
    } catch (error) {
      console.error('Error updating external catalog:', error);
      throw new Error('Erro ao atualizar catálogo externo');
    }
  },

  async deleteCatalog(id: string): Promise<void> {
    try {
      // Remove from featured products first
      const featuredProducts = await import('./supabaseService').then(m => m.featuredProductsService);
      const allFeatured = await featuredProducts.getFeaturedProducts();
      const catalogFeatured = allFeatured.filter(p => p.catalog_id === id);
      
      for (const featured of catalogFeatured) {
        await featuredProducts.removeFeaturedProduct(featured.image_url);
      }
      
      // Then delete the catalog
      await catalogService.deleteCatalog(id);
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
