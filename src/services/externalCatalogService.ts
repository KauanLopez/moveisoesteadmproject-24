
import { supabase } from '@/integrations/supabase/client';
import { ExternalUrlCatalog, ExternalUrlCatalogFormData } from '@/types/externalCatalogTypes';
import { authService } from './authService';

export const externalCatalogService = {
  async getAllCatalogs(): Promise<ExternalUrlCatalog[]> {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching external catalogs:', error);
      throw new Error('Erro ao buscar catálogos externos');
    }

    // Convert the Json type to string[] for external_content_image_urls
    return (data || []).map(item => ({
      ...item,
      external_content_image_urls: Array.isArray(item.external_content_image_urls) 
        ? item.external_content_image_urls as string[]
        : []
    }));
  },

  async createCatalog(catalogData: ExternalUrlCatalogFormData): Promise<ExternalUrlCatalog> {
    return await authService.withValidSession(async () => {
      const { data, error } = await supabase
        .from('external_url_catalogs')
        .insert([catalogData])
        .select()
        .single();

      if (error) {
        console.error('Error creating external catalog:', error);
        throw new Error('Erro ao criar catálogo externo');
      }

      return {
        ...data,
        external_content_image_urls: Array.isArray(data.external_content_image_urls) 
          ? data.external_content_image_urls as string[]
          : []
      };
    });
  },

  async updateCatalog(id: string, catalogData: Partial<ExternalUrlCatalogFormData>): Promise<ExternalUrlCatalog> {
    return await authService.withValidSession(async () => {
      const { data, error } = await supabase
        .from('external_url_catalogs')
        .update(catalogData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating external catalog:', error);
        throw new Error('Erro ao atualizar catálogo externo');
      }

      return {
        ...data,
        external_content_image_urls: Array.isArray(data.external_content_image_urls) 
          ? data.external_content_image_urls as string[]
          : []
      };
    });
  },

  async deleteCatalog(id: string): Promise<void> {
    return await authService.withValidSession(async () => {
      const { error } = await supabase
        .from('external_url_catalogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting external catalog:', error);
        throw new Error('Erro ao deletar catálogo externo');
      }
    });
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
