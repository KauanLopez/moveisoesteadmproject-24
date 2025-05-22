
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CatalogImageCarousel from './CatalogImageCarousel';

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
        const { data: catalog } = await supabase
          .from('catalogs')
          .select('title')
          .eq('id', catalogId)
          .single();

        if (catalog) {
          setCatalogTitle(catalog.title || 'Catálogo');
        }

        // Then fetch all images for this catalog
        const { data: catalogImages } = await supabase
          .from('catalog_items')
          .select('id, image_url, title, description')
          .eq('catalog_id', catalogId)
          .order('display_order', { ascending: true });

        if (catalogImages && catalogImages.length > 0) {
          setImages(catalogImages as CatalogImage[]);
        } else {
          // If no catalog images found, use the catalog cover as a single image
          const { data: catalog } = await supabase
            .from('catalogs')
            .select('id, cover_image, title, description')
            .eq('id', catalogId)
            .single();

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
                <p>Carregando imagens do catálogo...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <p>Nenhuma imagem encontrada para este catálogo.</p>
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
