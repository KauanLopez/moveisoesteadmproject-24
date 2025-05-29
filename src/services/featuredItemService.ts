
import { authService } from "./authService";

export interface FeaturedItem {
  id: string;
  catalog_id: string;
  image_url: string;
  created_at: string;
}

// Mock functions for frontend-only implementation
export const fetchFeaturedItems = async (): Promise<FeaturedItem[]> => {
  try {
    // Since we don't have a database, return empty array
    return [];
  } catch (error: any) {
    console.error('Exception fetching featured items:', error);
    throw error;
  }
};

export const addFeaturedItem = async (catalogId: string, imageUrl: string): Promise<FeaturedItem | null> => {
  return await authService.withValidSession(async () => {
    try {
      // Since we don't have a database, return mock data
      const mockItem: FeaturedItem = {
        id: crypto.randomUUID(),
        catalog_id: catalogId,
        image_url: imageUrl,
        created_at: new Date().toISOString()
      };
      
      return mockItem;
    } catch (error: any) {
      console.error('Exception adding featured item:', error);
      throw error;
    }
  });
};

export const removeFeaturedItem = async (id: string): Promise<boolean> => {
  return await authService.withValidSession(async () => {
    try {
      // Since we don't have a database, return true
      return true;
    } catch (error: any) {
      console.error('Error removing featured item:', error);
      throw error;
    }
  });
};
