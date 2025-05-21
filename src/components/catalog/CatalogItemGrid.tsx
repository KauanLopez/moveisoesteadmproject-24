
import React, { useState } from 'react';
import { CatalogItem } from '@/types/catalogTypes';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2 } from 'lucide-react';

interface CatalogItemGridProps {
  items: CatalogItem[];
}

const CatalogItemGrid: React.FC<CatalogItemGridProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Nenhuma imagem encontrada neste catálogo.</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-64">
                <img
                  src={item.image_url}
                  alt={item.title || "Imagem do catálogo"}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedItem(item);
                  }}
                  className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Ver em tela cheia"
                >
                  <Maximize2 className="h-5 w-5 text-gray-800" />
                </button>
              </div>
              <CardContent className="p-4">
                {item.title && <h3 className="font-medium">{item.title}</h3>}
                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
          {selectedItem && (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-white p-6 rounded-lg">
              {selectedItem.title && <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>}
              {selectedItem.description && (
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              )}
              <div className="relative w-full h-full max-h-[70vh]">
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title || "Imagem do catálogo"} 
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CatalogItemGrid;
