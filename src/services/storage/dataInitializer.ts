
import { localStorageService } from '../localStorageService';
import { defaultContent } from '@/data/defaultContent';
import { defaultExternalCatalogs } from '@/data/defaultExternalCatalogs';

export class DataInitializer {
  initializeDefaultData(): void {
    console.log('DataInitializer: Starting initialization...');
    
    // Initialize content if empty
    if (localStorageService.getContent().length === 0) {
      console.log('DataInitializer: Setting default content...');
      localStorageService.setContent(defaultContent);
    }

    // Initialize external catalogs if empty
    if (localStorageService.getExternalCatalogs().length === 0) {
      console.log('DataInitializer: Setting default external catalogs...');
      localStorageService.setExternalCatalogs(defaultExternalCatalogs);
    }

    // Clear PDF catalogs completely since we only use external URL catalogs
    console.log('DataInitializer: Clearing all PDF catalogs - using only external URL catalogs...');
    localStorageService.setPdfCatalogs([]);

    // Also clear regular catalogs to avoid confusion
    console.log('DataInitializer: Clearing regular catalogs - using only external URL catalogs...');
    const existingCatalogs = localStorageService.getCatalogs();
    if (existingCatalogs.length > 0) {
      // Clear all catalogs from localStorage
      localStorage.removeItem('catalogs');
    }

    console.log('DataInitializer: Initialization complete - only external URL catalogs will be displayed');
  }
}
