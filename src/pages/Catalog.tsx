
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContentProvider } from '@/context/ContentContext';
import { CatalogList } from '@/components/catalog/CatalogList';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { Catalog as CatalogType } from '@/types/catalogTypes';
import { fetchCatalogs } from '@/services/catalogService';
import { Skeleton } from '@/components/ui/skeleton';

const Catalog = () => {
  const [catalogs, setCatalogs] = useState<CatalogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogs = async () => {
      setLoading(true);
      try {
        const data = await fetchCatalogs();
        setCatalogs(data);
      } catch (error) {
        console.error('Failed to load catalogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <ContentProvider>
        <main className="flex-grow">
          <CatalogHeader />
          
          {loading ? (
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CatalogList catalogs={catalogs} />
          )}
        </main>
      </ContentProvider>
      
      <Footer />
    </div>
  );
};

export default Catalog;
