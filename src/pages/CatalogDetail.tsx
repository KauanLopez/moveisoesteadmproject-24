
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { CatalogItem, CatalogWithCategory } from '@/types/catalogTypes';
import { fetchCatalogBySlug, fetchCatalogItems } from '@/services/catalogService';
import CatalogItemGrid from '@/components/catalog/CatalogItemGrid';
import { Skeleton } from '@/components/ui/skeleton';

const CatalogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [catalog, setCatalog] = useState<CatalogWithCategory | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogData = async () => {
      setLoading(true);
      if (!slug) return;

      try {
        const catalogData = await fetchCatalogBySlug(slug);
        if (catalogData) {
          setCatalog(catalogData);
          const itemsData = await fetchCatalogItems(catalogData.id);
          setItems(itemsData);
        }
      } catch (error) {
        console.error('Failed to load catalog details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow text-center">
          <h1 className="text-2xl font-bold mb-4">Catálogo não encontrado</h1>
          <p className="mb-8">O catálogo que você está procurando não existe ou foi removido.</p>
          <Link to="/catalogo" className="text-primary hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            <span>Voltar para catálogos</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-16 pb-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <Link to="/catalogo" className="text-primary hover:underline flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>Voltar para catálogos</span>
              </Link>
            </div>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{catalog?.title}</h1>
              <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-3"></div>
              {catalog?.category_name && (
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm mb-4">
                  {catalog.category_name}
                </span>
              )}
              {catalog?.description && (
                <p className="text-base md:text-lg text-gray-700 mb-8">{catalog.description}</p>
              )}
            </div>
          </div>
        </section>
        
        <CatalogItemGrid items={items} />
      </main>
      
      <Footer />
    </div>
  );
};

export default CatalogDetail;
