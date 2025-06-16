
import { featuredProductsService } from './supabaseService';
import { ExternalUrlCatalog, getExternalContentImageUrls } from '@/types/customTypes';

export interface SyncedCatalogImage {
  id: string;
  image: string;
  isFavorite: boolean;
  catalogId: string;
}

export const favoriteSyncService = {
  syncCatalogImagesWithFavorites: (catalog: ExternalUrlCatalog): SyncedCatalogImage[] => {
    const imageUrls = getExternalContentImageUrls(catalog);
    return imageUrls.map((imageUrl: string, index: number) => ({
      id: `${catalog.id}-${index}`,
      image: imageUrl,
      isFavorite: false, // Will be updated by the hook
      catalogId: catalog.id
    }));
  },

  updateImageFavoriteStatus: async (imageUrl: string, isFavorite: boolean): Promise<boolean> => {
    try {
      if (isFavorite) {
        await featuredProductsService.addFeaturedProduct({
          image_url: imageUrl,
          title: 'Produto em Destaque',
          description: 'Produto selecionado para destaque'
        });
      } else {
        await featuredProductsService.removeFeaturedProduct(imageUrl);
      }
      return true;
    } catch (error) {
      console.error('Error updating favorite status:', error);
      return false;
    }
  },

  checkIsFavorite: async (imageUrl: string): Promise<boolean> => {
    try {
      return await featuredProductsService.isFeatured(imageUrl);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
};
