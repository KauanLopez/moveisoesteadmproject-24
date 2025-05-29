
import { useState } from 'react';
import { UnifiedCatalog, UnifiedCatalogImage } from '@/types/unifiedCatalogTypes';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import { PdfCatalog } from '@/services/pdfCatalogService';

export const useCatalogModal = () => {
  const [selectedCatalog, setSelectedCatalog] = useState<UnifiedCatalog | null>(null);

  const openExternalCatalog = (catalog: ExternalUrlCatalog) => {
    const images: UnifiedCatalogImage[] = [];
    
    // Add cover image first
    if (catalog.external_cover_image_url) {
      images.push({
        id: `${catalog.id}-cover`,
        url: catalog.external_cover_image_url,
        title: `${catalog.title} - Capa`,
        description: 'Capa do catálogo'
      });
    }
    
    // Add content images
    if (catalog.external_content_image_urls && catalog.external_content_image_urls.length > 0) {
      catalog.external_content_image_urls.forEach((url, index) => {
        if (url && url.trim() !== '') {
          images.push({
            id: `${catalog.id}-content-${index}`,
            url: url,
            title: `Página ${index + 1}`,
            description: ''
          });
        }
      });
    }

    setSelectedCatalog({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description,
      images,
      type: 'external'
    });
  };

  const openPdfCatalog = (catalog: PdfCatalog) => {
    const images: UnifiedCatalogImage[] = [];
    
    // Add cover image first
    if (catalog.cover_image_url) {
      images.push({
        id: `${catalog.id}-cover`,
        url: catalog.cover_image_url,
        title: `${catalog.title} - Capa`,
        description: 'Capa do catálogo'
      });
    }
    
    // Add content images
    if (catalog.content_image_urls && catalog.content_image_urls.length > 0) {
      catalog.content_image_urls.forEach((url, index) => {
        images.push({
          id: `${catalog.id}-content-${index}`,
          url: url,
          title: `Página ${index + 2}`,
          description: ''
        });
      });
    }

    setSelectedCatalog({
      id: catalog.id,
      title: catalog.title,
      description: catalog.description,
      images,
      type: 'pdf'
    });
  };

  const openInternalCatalog = (catalogId: string, title: string, images: UnifiedCatalogImage[]) => {
    setSelectedCatalog({
      id: catalogId,
      title,
      description: '',
      images,
      type: 'internal'
    });
  };

  const closeCatalog = () => {
    setSelectedCatalog(null);
  };

  return {
    selectedCatalog,
    isOpen: !!selectedCatalog,
    openExternalCatalog,
    openPdfCatalog,
    openInternalCatalog,
    closeCatalog
  };
};
