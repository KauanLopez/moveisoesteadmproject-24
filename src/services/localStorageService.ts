import { ContentStorageService } from './storage/contentStorageService';
import { ExternalCatalogStorageService } from './storage/externalCatalogStorageService';
import { BaseStorageService } from './storage/baseStorageService';
import { DataInitializer } from './storage/dataInitializer';

// Keep existing interfaces
export interface StoredCatalog {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  created_at: string;
  category_id?: string;
  category_name?: string;
  slug: string;
}

export interface StoredCatalogItem {
  id: string;
  catalog_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface StoredExternalCatalog {
  id: string;
  title: string;
  description: string;
  external_cover_image_url: string;
  external_content_image_urls: string[];
  created_at: string;
}

export interface StoredPdfCatalog {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  content_image_urls: string[];
  created_at: string;
}

export interface StoredContent {
  id: string;
  section: string;
  title: string;
  description: string;
  image_url: string;
  object_position?: string;
  scale?: number;
}

class LocalStorageService extends BaseStorageService {
  private contentService = new ContentStorageService();
  private externalCatalogService = new ExternalCatalogStorageService();
  private dataInitializer = new DataInitializer();

  // Content methods
  getContent(): StoredContent[] {
    return this.contentService.getContent();
  }

  setContent(content: StoredContent[]): void {
    this.contentService.setContent(content);
  }

  addContent(item: StoredContent): void {
    this.contentService.addContent(item);
  }

  deleteContent(id: string): void {
    this.contentService.deleteContent(id);
  }

  // Catalog methods
  getCatalogs(): StoredCatalog[] {
    return this.get<StoredCatalog>(this.getKey('catalogs'));
  }

  setCatalogs(catalogs: StoredCatalog[]): void {
    this.set(this.getKey('catalogs'), catalogs);
  }

  addCatalog(catalog: StoredCatalog): void {
    this.addItem(this.getKey('catalogs'), catalog);
  }

  deleteCatalog(id: string): void {
    this.deleteItem(this.getKey('catalogs'), id);
  }

  // Catalog items methods
  getCatalogItems(): StoredCatalogItem[] {
    return this.get<StoredCatalogItem>(this.getKey('catalog_items'));
  }

  setCatalogItems(items: StoredCatalogItem[]): void {
    this.set(this.getKey('catalog_items'), items);
  }

  // External catalogs methods
  getExternalCatalogs(): StoredExternalCatalog[] {
    return this.externalCatalogService.getExternalCatalogs();
  }

  setExternalCatalogs(catalogs: StoredExternalCatalog[]): void {
    this.externalCatalogService.setExternalCatalogs(catalogs);
  }

  addExternalCatalog(catalog: StoredExternalCatalog): void {
    this.externalCatalogService.addExternalCatalog(catalog);
  }

  deleteExternalCatalog(id: string): void {
    this.externalCatalogService.deleteExternalCatalog(id);
  }

  // PDF catalogs methods
  getPdfCatalogs(): StoredPdfCatalog[] {
    return this.get<StoredPdfCatalog>(this.getKey('pdf_catalogs'));
  }

  setPdfCatalogs(catalogs: StoredPdfCatalog[]): void {
    this.set(this.getKey('pdf_catalogs'), catalogs);
  }

  addPdfCatalog(catalog: StoredPdfCatalog): void {
    this.addItem(this.getKey('pdf_catalogs'), catalog);
  }

  deletePdfCatalog(id: string): void {
    this.deleteItem(this.getKey('pdf_catalogs'), id);
  }

  // Initialize with default data
  initializeDefaultData(): void {
    this.dataInitializer.initializeDefaultData();
  }
}

export const localStorageService = new LocalStorageService();
