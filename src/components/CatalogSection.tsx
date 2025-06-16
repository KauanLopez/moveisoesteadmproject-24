import React, { useState, useEffect } from 'react';
import CatalogModal from './catalog/CatalogModal';
import CatalogSectionHeader from './catalog/components/CatalogSectionHeader';
import CatalogCarouselContainer from './catalog/components/CatalogCarouselContainer';
import { localStorageService, StoredExternalCatalog } from '@/services/localStorageService';

// A interface precisa ser compatível com o que é salvo no localStorage
interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: Array<{ url: string; title: string }>;
}

const CatalogSection: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para carregar os catálogos do localStorage quando o componente montar
  useEffect(() => {
    const storedCatalogs: StoredExternalCatalog[] = localStorageService.getExternalCatalogs();
    
    // Transforma os dados do localStorage para o formato que o componente espera
    const formattedCatalogs: Catalog[] = storedCatalogs.map(sc => ({
      id: sc.id,
      name: sc.title,
      description: sc.description,
      coverImage: sc.external_cover_image_url,
      images: sc.external_content_image_urls.map((url, index) => ({
        url: url,
        title: `Página ${index + 1}`
      }))
    }));

    setCatalogs(formattedCatalogs);
  }, []);

  const handleCatalogClick = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCatalog(null);
  };

  return (
    <>
      <section id="catalogs" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <CatalogSectionHeader title="Catálogos" />
          {catalogs.length > 0 ? (
            <CatalogCarouselContainer
              catalogs={catalogs}
              onCatalogClick={handleCatalogClick}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p>Nenhum catálogo disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      <CatalogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        catalog={selectedCatalog}
      />
    </>
  );
};

export default CatalogSection;