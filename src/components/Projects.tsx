
import React, { useState, useEffect } from 'react';
import ExternalCatalogModal from './catalog/ExternalCatalogModal';
import { fetchExternalCatalogs } from '@/services/externalCatalogService';
import { ExternalUrlCatalog } from '@/types/externalCatalogTypes';
import ProjectsHeader from './projects/ProjectsHeader';
import CatalogCarousel from './projects/CatalogCarousel';

const Projects = () => {
  const [selectedExternalCatalog, setSelectedExternalCatalog] = useState<ExternalUrlCatalog | null>(null);
  const [externalCatalogs, setExternalCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCatalogs = async () => {
      console.log('Projects: Loading external catalogs...');
      setLoading(true);
      try {
        const catalogData = await fetchExternalCatalogs();
        console.log('Projects: External catalogs loaded:', catalogData.length);
        setExternalCatalogs(catalogData);
      } catch (error) {
        console.error('Projects: Error loading external catalogs:', error);
        setExternalCatalogs([]);
      } finally {
        setLoading(false);
        console.log('Projects: Loading finished');
      }
    };

    loadCatalogs();
  }, []);

  const handleOpenCatalog = (catalog: ExternalUrlCatalog) => {
    console.log('Projects: Opening catalog:', catalog.title);
    setSelectedExternalCatalog(catalog);
  };

  const handleCloseCatalog = () => {
    setSelectedExternalCatalog(null);
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProjectsHeader />
          <div className="text-center">
            <p className="max-w-2xl mx-auto text-gray-600">
              Carregando catálogos...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (externalCatalogs.length === 0) {
    console.log('Projects: No catalogs to display - showing empty state');
    return (
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProjectsHeader />
          <div className="text-center">
            <p className="max-w-2xl mx-auto text-gray-600">
              Nenhum catálogo disponível.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ProjectsHeader />
        <CatalogCarousel 
          catalogs={externalCatalogs}
          onOpenCatalog={handleOpenCatalog}
        />
      </div>

      {selectedExternalCatalog && (
        <ExternalCatalogModal 
          catalog={selectedExternalCatalog}
          isOpen={!!selectedExternalCatalog} 
          onClose={handleCloseCatalog} 
        />
      )}
    </section>
  );
};

export default Projects;
