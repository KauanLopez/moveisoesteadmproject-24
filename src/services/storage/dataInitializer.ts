
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

    // Clear any existing PDF catalogs to avoid duplication
    console.log('DataInitializer: Clearing PDF catalogs to avoid duplication...');
    localStorageService.setPdfCatalogs([]);

    console.log('DataInitializer: Initialization complete');
  }
}
