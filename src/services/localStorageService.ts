
// Local storage service to replace backend functionality
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

class LocalStorageService {
  private getKey(type: string): string {
    return `moveis_oeste_${type}`;
  }

  // Generic methods
  private get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  // Content methods
  getContent(): StoredContent[] {
    return this.get<StoredContent>(this.getKey('content'));
  }

  setContent(content: StoredContent[]): void {
    this.set(this.getKey('content'), content);
  }

  addContent(item: StoredContent): void {
    const content = this.getContent();
    const existingIndex = content.findIndex(c => c.id === item.id);
    if (existingIndex >= 0) {
      content[existingIndex] = item;
    } else {
      content.push(item);
    }
    this.setContent(content);
  }

  deleteContent(id: string): void {
    const content = this.getContent().filter(c => c.id !== id);
    this.setContent(content);
  }

  // Catalog methods
  getCatalogs(): StoredCatalog[] {
    return this.get<StoredCatalog>(this.getKey('catalogs'));
  }

  setCatalogs(catalogs: StoredCatalog[]): void {
    this.set(this.getKey('catalogs'), catalogs);
  }

  addCatalog(catalog: StoredCatalog): void {
    const catalogs = this.getCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setCatalogs(catalogs);
  }

  deleteCatalog(id: string): void {
    const catalogs = this.getCatalogs().filter(c => c.id !== id);
    this.setCatalogs(catalogs);
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
    return this.get<StoredExternalCatalog>(this.getKey('external_catalogs'));
  }

  setExternalCatalogs(catalogs: StoredExternalCatalog[]): void {
    this.set(this.getKey('external_catalogs'), catalogs);
  }

  addExternalCatalog(catalog: StoredExternalCatalog): void {
    const catalogs = this.getExternalCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setExternalCatalogs(catalogs);
  }

  deleteExternalCatalog(id: string): void {
    const catalogs = this.getExternalCatalogs().filter(c => c.id !== id);
    this.setExternalCatalogs(catalogs);
  }

  // PDF catalogs methods
  getPdfCatalogs(): StoredPdfCatalog[] {
    return this.get<StoredPdfCatalog>(this.getKey('pdf_catalogs'));
  }

  setPdfCatalogs(catalogs: StoredPdfCatalog[]): void {
    this.set(this.getKey('pdf_catalogs'), catalogs);
  }

  addPdfCatalog(catalog: StoredPdfCatalog): void {
    const catalogs = this.getPdfCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setPdfCatalogs(catalogs);
  }

  deletePdfCatalog(id: string): void {
    const catalogs = this.getPdfCatalogs().filter(c => c.id !== id);
    this.setPdfCatalogs(catalogs);
  }

  // Initialize with default data
  initializeDefaultData(): void {
    // Initialize content if empty
    if (this.getContent().length === 0) {
      this.setContent([
        {
          id: "hero-1",
          section: "hero",
          title: "Transformando Espaços",
          description: "Móveis sob medida que refletem sua personalidade",
          image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        },
        {
          id: "about-1",
          section: "about",
          title: "Nossa História",
          description: "Com mais de 20 anos de experiência, criamos móveis que contam histórias",
          image_url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        },
        {
          id: "projects-1",
          section: "projects",
          title: "Sala de Estar Moderna",
          description: "Design contemporâneo com funcionalidade premium",
          image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        },
        {
          id: "projects-2",
          section: "projects",
          title: "Quarto de Luxo",
          description: "Conforto e elegância em cada detalhe",
          image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        },
        {
          id: "projects-3",
          section: "projects",
          title: "Escritório Minimalista",
          description: "Produtividade em um ambiente clean e organizado",
          image_url: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1974&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        },
        {
          id: "projects-4",
          section: "projects",
          title: "Experiência Gastronômica",
          description: "Mesa de jantar que reúne família e amigos",
          image_url: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1974&auto=format&fit=crop",
          object_position: "center",
          scale: 1
        }
      ]);
    }

    // Initialize external catalogs if empty (including IMCAL)
    if (this.getExternalCatalogs().length === 0) {
      this.setExternalCatalogs([
        {
          id: "imcal-catalog",
          title: "IMCAL",
          description: "Criando ambientes que tocam os sentidos e emocionam.",
          external_cover_image_url: "https://i.imgur.com/7l0H29Q.jpeg",
          external_content_image_urls: [
            "https://i.imgur.com/X09OW6n.jpeg",
            "https://i.imgur.com/dNpw2Y5.jpeg",
            "https://i.imgur.com/fqnuiCo.jpeg",
            "https://i.imgur.com/l8S2wqm.jpeg",
            "https://i.imgur.com/dznxeDV.jpeg",
            "https://i.imgur.com/5ORtQJ1.jpeg"
          ],
          created_at: new Date().toISOString()
        }
      ]);
    }
  }
}

export const localStorageService = new LocalStorageService();
