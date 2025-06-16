
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { catalogService } from '@/services/supabaseService';
import { ExternalUrlCatalog } from '@/types/customTypes';
import { useAuth } from '@/context/AuthContext';
import CatalogCarousel from '@/components/projects/CatalogCarousel';
import CatalogImagesModal from '@/components/admin/CatalogImagesModal';

const Index = () => {
  const [catalogs, setCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<ExternalUrlCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      const catalogsData = await catalogService.getAllCatalogs();
      console.log('Index: Loaded catalogs:', catalogsData);
      setCatalogs(catalogsData);
    } catch (error) {
      console.error('Index: Error loading catalogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCatalog = (catalog: ExternalUrlCatalog) => {
    console.log('Index: Opening catalog modal for:', catalog.title);
    setSelectedCatalog(catalog);
  };

  const handleCloseCatalog = () => {
    setSelectedCatalog(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-furniture-green">Móveis Oeste</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-furniture-green text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Móveis de Qualidade para Sua Casa</h2>
          <p className="text-xl mb-8">Descubra nossa coleção exclusiva de móveis</p>
        </div>
      </section>

      {/* Catalogs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-furniture-green mb-4">Nossos Catálogos</h3>
            <div className="w-20 h-1 bg-furniture-yellow mx-auto"></div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando catálogos...</p>
            </div>
          ) : catalogs.length > 0 ? (
            <CatalogCarousel catalogs={catalogs} onOpenCatalog={handleOpenCatalog} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum catálogo disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Catalog Modal */}
      {selectedCatalog && (
        <CatalogImagesModal
          catalog={selectedCatalog}
          onClose={handleCloseCatalog}
        />
      )}
    </div>
  );
};

export default Index;
