
import React, { useState, useEffect } from 'react';
import { fetchExternalCatalogs } from '@/services/externalCatalogService';
import { ExternalUrlCatalog } from '@/types/customTypes';
import ProjectsHeader from './projects/ProjectsHeader';
import CatalogCarousel from './projects/CatalogCarousel';

const Projects = () => {
  const [externalCatalogs, setExternalCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCatalogs = async () => {
      console.log('Projects: Loading external catalogs...');
      setLoading(true);
      try {
        const catalogData = await fetchExternalCatalogs();
        console.log('Projects: External catalogs loaded:', catalogData.length);
        console.log('Projects: Catalog data:', catalogData);
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
    console.log('Projects: Catalog click detected for:', catalog.title);
    // Modal functionality has been removed
  };

  console.log('Projects: Rendering - loading:', loading, 'catalogs count:', externalCatalogs.length);

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

  console.log('Projects: Rendering section with catalogs:', externalCatalogs);
  
  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ProjectsHeader />
        
        {externalCatalogs.length === 0 ? (
          <div className="text-center">
            <p className="max-w-2xl mx-auto text-gray-600 mb-4">
              Nenhum catálogo disponível no momento.
            </p>
            <p className="text-sm text-gray-500">
              Debug: Tentando carregar catálogos...
            </p>
          </div>
        ) : (
          <CatalogCarousel 
            catalogs={externalCatalogs}
            onOpenCatalog={handleOpenCatalog}
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
