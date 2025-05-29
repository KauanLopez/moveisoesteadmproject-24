
import { defaultContent } from '@/data/defaultContent';
import { defaultExternalCatalogs } from '@/data/defaultExternalCatalogs';
import { ContentStorageService } from './contentStorageService';
import { ExternalCatalogStorageService } from './externalCatalogStorageService';
import { BaseStorageService } from './baseStorageService';

export class DataInitializer extends BaseStorageService {
  private contentService = new ContentStorageService();
  private externalCatalogService = new ExternalCatalogStorageService();

  initializeDefaultData(): void {
    // Force clear and reinitialize all data to ensure clean state
    this.clearAllData();
    
    // Initialize content (hero and about sections only)
    this.contentService.setContent(defaultContent);

    // Initialize with the three external catalogs
    this.externalCatalogService.setExternalCatalogs(defaultExternalCatalogs);

    // Clear PDF catalogs to avoid duplication
    this.set(this.getKey('pdf_catalogs'), []);
  }
}
