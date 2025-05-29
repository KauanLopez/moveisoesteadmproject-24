
import { BaseStorageService } from './baseStorageService';
import { StoredExternalCatalog } from '../localStorageService';

export class ExternalCatalogStorageService extends BaseStorageService {
  getExternalCatalogs(): StoredExternalCatalog[] {
    return this.get<StoredExternalCatalog>(this.getKey('external_catalogs'));
  }

  setExternalCatalogs(catalogs: StoredExternalCatalog[]): void {
    this.set(this.getKey('external_catalogs'), catalogs);
  }

  addExternalCatalog(catalog: StoredExternalCatalog): void {
    this.addItem(this.getKey('external_catalogs'), catalog);
  }

  deleteExternalCatalog(id: string): void {
    this.deleteItem(this.getKey('external_catalogs'), id);
  }
}
