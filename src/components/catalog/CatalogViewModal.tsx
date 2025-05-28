
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dbOperations } from '@/lib/supabase-helpers';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CatalogImageCarousel from './CatalogImageCarousel';
import { fetchCatalogPdfPages } from '@/services/pdfService';

interface CatalogViewModalProps {
  catalogId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface CatalogImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
}

const CatalogViewModal: React.FC<CatalogViewModalProps> = ({ catalogId, isOpen, onClose }) => {
  const [images, setImages] = useState<CatalogImage[]>([]);
  const [catalogTitle, setCatalogTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogImages = async () => {
      if (!catalogId) return;

      setLoading(true);
      try {
        // First get catalog details
        const { data: catalog } = await dbOperations.catalogs.selectById(catalogId);

        if (catalog) {
          setCatalogTitle(catalog.title || 'Catálogo');
        }

        // Check if this catalog has PDF pages
        if (catalog?.pdf_file_url) {
          console.log('Loading PDF pages for catalog:', catalogId);
          const pdfPages = await fetchCatalogPdfPages(catalogId);
          
          if (pdfPages && pdfPages.length > 0) {
            const pdfImages = pdfPages.map(page => ({
              id: page.id,
              image_url: page.image_url,
              title: `Página ${page.page_number}`,
              description: ''
            }));
            setImages(pdfImages);
          } else {
            // Fallback to catalog cover if no PDF pages found
            if (catalog.cover_image) {
              setImages([
                {
                  id: catalog.id,
                  image_url: catalog.cover_image,
                  title: catalog.title,
                  description: catalog.description || 'Capa do catálogo',
                },
              ]);
            } else {
              setImages([]);
            }
          }
        } else {
          // Legacy: Try to fetch individual catalog items
          const { data: catalogItems } = await dbOperations.catalogItems.selectByCatalogId(catalogId);

          if (catalogItems && catalogItems.length > 0) {
            setImages(catalogItems as CatalogImage[]);
          } else {
            // Final fallback to catalog cover
            if (catalog && catalog.cover_image) {
              setImages([
                {
                  id: catalog.id,
                  image_url: catalog.cover_image,
                  title: catalog.title,
                  description: catalog.description || '',
                },
              ]);
            } else {
              setImages([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading catalog images:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && catalogId) {
      loadCatalogImages();
    }
  }, [catalogId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-white rounded-lg p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">{catalogTitle}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Carregando catálogo...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <p>Nenhuma página encontrada para este catálogo.</p>
              </div>
            ) : (
              <CatalogImageCarousel images={images} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogViewModal;
