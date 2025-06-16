import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';

export interface SyncedCatalogImage {
  id: string;
  image: string;
  title?: string;
  description?: string;
  isFavorite: boolean;
  catalog_id: string;
}

export const favoriteSyncService = {
  /**
   * Gets the list of featured product URLs from localStorage
   */
  getFeaturedProductUrls(): string[] {
    try {
      // First, try to get from the content storage
      const storedContent = localStorage.getItem('moveis_oeste_content');
      const featuredUrls: string[] = [];
      
      if (storedContent) {
        const allContent = JSON.parse(storedContent);
        const featuredProducts = allContent.filter((item: any) => 
          item.section === 'products' && (item.eh_favorito === true || item.isFeatured === true)
        );
        
        featuredProducts.forEach((item: any) => {
          const url = item.image_url || item.image;
          if (url) featuredUrls.push(url);
        });
      }
      
      console.log('FavoriteSyncService: All featured URLs:', featuredUrls);
      return [...new Set(featuredUrls)];
    } catch (error) {
      console.error('Error getting featured product URLs:', error);
      return [];
    }
  },

  /**
   * Synchronizes catalog images with featured products state
   */
  syncCatalogImagesWithFavorites(catalog: ExternalUrlCatalog): SyncedCatalogImage[] {
    const featuredUrls = this.getFeaturedProductUrls();
    const featuredUrlsSet = new Set(featuredUrls);
    
    console.log('FavoriteSyncService: Featured URLs found:', featuredUrls);
    console.log('FavoriteSyncService: Syncing catalog:', catalog.title);
    
    if (!catalog.external_content_image_urls || catalog.external_content_image_urls.length === 0) {
      return [];
    }
    
    const syncedImages: SyncedCatalogImage[] = catalog.external_content_image_urls.map((url, index) => {
      const isFavorite = featuredUrlsSet.has(url);
      
      console.log(`FavoriteSyncService: Image ${url} - isFavorite: ${isFavorite}`);
      
      return {
        id: `${catalog.id}-${index}`,
        image: url,
        title: `Imagem ${index + 1} - ${catalog.title}`,
        description: `Imagem do catálogo ${catalog.title}`,
        isFavorite,
        catalog_id: catalog.id
      };
    });
    
    console.log('FavoriteSyncService: Synced images:', syncedImages);
    return syncedImages;
  },

  /**
   * Updates the favorite status of a specific image
   */
  updateImageFavoriteStatus(imageUrl: string, isFavorite: boolean): boolean {
    try {
      const storedContent = localStorage.getItem('moveis_oeste_content');
      let allContent = storedContent ? JSON.parse(storedContent) : [];
      
      if (isFavorite) {
        // Add to favorites if not already there
        const existingIndex = allContent.findIndex((item: any) => 
          (item.image_url === imageUrl || item.image === imageUrl) && item.section === 'products'
        );
        
        if (existingIndex === -1) {
          const contentItem = {
            id: `featured-${crypto.randomUUID()}`,
            image_url: imageUrl,
            image: imageUrl,
            title: 'Produto em Destaque',
            description: 'Adicionado via painel administrativo',
            section: 'products',
            eh_favorito: true,
            isFeatured: true,
            created_at: new Date().toISOString()
          };
          allContent.push(contentItem);
        } else {
          allContent[existingIndex].eh_favorito = true;
          allContent[existingIndex].isFeatured = true;
        }
      } else {
        // Remove from favorites
        allContent = allContent.filter((item: any) => 
          !((item.image_url === imageUrl || item.image === imageUrl) && item.section === 'products')
        );
      }
      
      localStorage.setItem('moveis_oeste_content', JSON.stringify(allContent));
      console.log('FavoriteSyncService: Updated favorite status for:', imageUrl, 'to:', isFavorite);
      
      // Dispara um evento para notificar outras partes da aplicação
      window.dispatchEvent(new CustomEvent('localStorageUpdated'));

      return true;
    } catch (error) {
      console.error('Error updating favorite status:', error);
      return false;
    }
  }
};