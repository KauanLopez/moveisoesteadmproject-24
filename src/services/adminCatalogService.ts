
export interface AdminCatalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: AdminCatalogImage[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogImage {
  id: string;
  catalogId: string;
  url: string;
  title?: string;
  isFeatured: boolean;
  createdAt: string;
}

const CATALOGS_KEY = 'admin_catalogs';

// Initialize with some default catalogs if none exist
const initializeDefaultCatalogs = (): AdminCatalog[] => {
  return [
    {
      id: '1',
      name: 'Móveis de Sala',
      description: 'Sofás, mesas de centro e estantes modernas',
      coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
      images: [
        {
          id: '1-1',
          catalogId: '1',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
          title: 'Sofá Moderno',
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '1-2',
          catalogId: '1',
          url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop',
          title: 'Mesa de Centro',
          isFeatured: false,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Móveis de Quarto',
      description: 'Camas, guarda-roupas e cômodas elegantes',
      coverImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop',
      images: [
        {
          id: '2-1',
          catalogId: '2',
          url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop',
          title: 'Cama Box',
          isFeatured: true,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const getCatalogs = (): AdminCatalog[] => {
  const stored = localStorage.getItem(CATALOGS_KEY);
  if (!stored) {
    const defaultCatalogs = initializeDefaultCatalogs();
    localStorage.setItem(CATALOGS_KEY, JSON.stringify(defaultCatalogs));
    return defaultCatalogs;
  }
  return JSON.parse(stored);
};

export const saveCatalogs = (catalogs: AdminCatalog[]): void => {
  localStorage.setItem(CATALOGS_KEY, JSON.stringify(catalogs));
};

export const createCatalog = (catalog: Omit<AdminCatalog, 'id' | 'createdAt' | 'updatedAt' | 'images'>): AdminCatalog => {
  const catalogs = getCatalogs();
  const newCatalog: AdminCatalog = {
    ...catalog,
    id: crypto.randomUUID(),
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  catalogs.push(newCatalog);
  saveCatalogs(catalogs);
  return newCatalog;
};

export const updateCatalog = (id: string, updates: Partial<AdminCatalog>): AdminCatalog | null => {
  const catalogs = getCatalogs();
  const index = catalogs.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  catalogs[index] = {
    ...catalogs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveCatalogs(catalogs);
  return catalogs[index];
};

export const deleteCatalog = (id: string): boolean => {
  const catalogs = getCatalogs();
  const filtered = catalogs.filter(c => c.id !== id);
  
  if (filtered.length === catalogs.length) return false;
  
  saveCatalogs(filtered);
  return true;
};

export const addImageToCatalog = (catalogId: string, image: Omit<AdminCatalogImage, 'id' | 'catalogId' | 'createdAt'>): AdminCatalogImage | null => {
  const catalogs = getCatalogs();
  const catalog = catalogs.find(c => c.id === catalogId);
  
  if (!catalog) return null;
  
  const newImage: AdminCatalogImage = {
    ...image,
    id: crypto.randomUUID(),
    catalogId,
    createdAt: new Date().toISOString()
  };
  
  catalog.images.push(newImage);
  catalog.updatedAt = new Date().toISOString();
  
  saveCatalogs(catalogs);
  return newImage;
};

export const updateImageInCatalog = (catalogId: string, imageId: string, updates: Partial<AdminCatalogImage>): AdminCatalogImage | null => {
  const catalogs = getCatalogs();
  const catalog = catalogs.find(c => c.id === catalogId);
  
  if (!catalog) return null;
  
  const imageIndex = catalog.images.findIndex(img => img.id === imageId);
  if (imageIndex === -1) return null;
  
  catalog.images[imageIndex] = {
    ...catalog.images[imageIndex],
    ...updates
  };
  
  catalog.updatedAt = new Date().toISOString();
  saveCatalogs(catalogs);
  
  return catalog.images[imageIndex];
};

export const deleteImageFromCatalog = (catalogId: string, imageId: string): boolean => {
  const catalogs = getCatalogs();
  const catalog = catalogs.find(c => c.id === catalogId);
  
  if (!catalog) return false;
  
  const originalLength = catalog.images.length;
  catalog.images = catalog.images.filter(img => img.id !== imageId);
  
  if (catalog.images.length === originalLength) return false;
  
  catalog.updatedAt = new Date().toISOString();
  saveCatalogs(catalogs);
  return true;
};

export const getFeaturedImages = (): AdminCatalogImage[] => {
  const catalogs = getCatalogs();
  const featuredImages: AdminCatalogImage[] = [];
  
  catalogs.forEach(catalog => {
    catalog.images.forEach(image => {
      if (image.isFeatured) {
        featuredImages.push(image);
      }
    });
  });
  
  return featuredImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
