
export interface UnifiedCatalogImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export interface UnifiedCatalog {
  id: string;
  title: string;
  description?: string;
  images: UnifiedCatalogImage[];
  type: 'external' | 'pdf' | 'internal';
}

export interface CatalogModalProps {
  catalog: UnifiedCatalog | null;
  isOpen: boolean;
  onClose: () => void;
}
