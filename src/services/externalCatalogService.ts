import { ExternalUrlCatalog, ExternalUrlCatalogFormData } from '@/types/externalCatalogTypes';
import { localStorageService } from './localStorageService';

export const externalCatalogService = {
  async getAllCatalogs(): Promise<ExternalUrlCatalog[]> {
    try {
      const catalogs = localStorageService.getExternalCatalogs();
      
      if (catalogs.length === 0) {
        localStorageService.initializeDefaultData();
        return localStorageService.getExternalCatalogs();
      }
      
      return catalogs.map(catalog => ({
        id: catalog.id,
        title: catalog.title,
        description: catalog.description,
        external_cover_image_url: catalog.external_cover_image_url,
        external_content_image_urls: catalog.external_content_image_urls || [],
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
        external_content_image_urls: catalogData.external_content_image_urls || [],
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
        description: catalogData.description || existingCatalog.description,
        external_content_image_urls: catalogData.external_content_image_urls || existingCatalog.external_content_image_urls,
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
      // Pega todos os catálogos e o conteúdo antes de deletar
      const allCatalogs = localStorageService.getExternalCatalogs();
      const allContent = localStorageService.getContent();
      
      const catalogToDelete = allCatalogs.find(c => c.id === id);
      
      if (!catalogToDelete) {
        console.warn("Catálogo a ser deletado não encontrado.");
        return;
      }
      
      // Cria um Set com todas as URLs do catálogo a ser deletado (capa + conteúdo) para busca rápida
      const urlsToDelete = new Set(catalogToDelete.external_content_image_urls);
      if (catalogToDelete.external_cover_image_url) {
        urlsToDelete.add(catalogToDelete.external_cover_image_url);
      }
      
      // Filtra o conteúdo, mantendo apenas os itens que NÃO estão na lista de URLs a serem deletadas
      const updatedContent = allContent.filter(contentItem => {
        // Mantém o item se ele não for um produto ou se a URL dele não estiver na lista de exclusão
        return contentItem.section !== 'products' || !urlsToDelete.has(contentItem.image_url);
      });
      
      // Salva o conteúdo atualizado (sem os favoritos do catálogo deletado)
      localStorageService.setContent(updatedContent);
      
      // Deleta o catálogo em si
      localStorageService.deleteExternalCatalog(id);

      // Dispara um evento para notificar outras partes da aplicação (como a lista de favoritos)
      window.dispatchEvent(new CustomEvent('localStorageUpdated'));

    } catch (error) {
      console.error('Error deleting external catalog and its content:', error);
      throw new Error('Erro ao deletar catálogo e limpar favoritos.');
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