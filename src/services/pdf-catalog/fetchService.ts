
import { supabase } from "@/integrations/supabase/client";
import { PdfCatalog } from './types';
import { transformPdfCatalogData } from './utils';

/**
 * Fetch all PDF catalogs
 */
export const fetchPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching PDF catalogs:', error);
      throw error;
    }
    
    console.log('Raw PDF catalog data:', data);
    return transformPdfCatalogData(data);
  } catch (error: any) {
    console.error('Exception fetching PDF catalogs:', error);
    throw error;
  }
};

/**
 * Fetch completed PDF catalogs for public display
 */
export const fetchCompletedPdfCatalogs = async (): Promise<PdfCatalog[]> => {
  try {
    console.log('FetchService: Starting to fetch completed PDF catalogs...');
    
    const { data, error } = await supabase
      .from('pdf_derived_catalogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('FetchService: Error fetching completed PDF catalogs:', error);
      throw error;
    }
    
    console.log('FetchService: Raw data from database:', data);
    console.log('FetchService: Total records found:', data?.length || 0);
    
    // Log each catalog individually
    data?.forEach((catalog, index) => {
      console.log(`FetchService: Catalog ${index + 1}:`, {
        id: catalog.id,
        title: catalog.title,
        cover_image_url: catalog.cover_image_url,
        has_cover: !!catalog.cover_image_url
      });
    });
    
    // Check specifically for SAMEC catalog
    const samecCatalog = data?.find(cat => cat.title === 'Catalogo SAMEC');
    console.log('FetchService: SAMEC catalog found:', samecCatalog);
    if (samecCatalog) {
      console.log('FetchService: SAMEC details:', {
        id: samecCatalog.id,
        title: samecCatalog.title,
        cover_image_url: samecCatalog.cover_image_url,
        content_image_urls: samecCatalog.content_image_urls,
        has_cover: !!samecCatalog.cover_image_url
      });
    }
    
    // Filter catalogs that have a cover image - but let's be more lenient for debugging
    const allCatalogs = data || [];
    const catalogsWithCover = allCatalogs.filter(catalog => catalog.cover_image_url);
    
    console.log('FetchService: All catalogs count:', allCatalogs.length);
    console.log('FetchService: Catalogs with cover images count:', catalogsWithCover.length);
    console.log('FetchService: Catalogs with cover images:', catalogsWithCover.map(c => ({ title: c.title, cover: c.cover_image_url })));
    
    // For debugging, let's return all catalogs for now to see what happens
    const catalogsToReturn = catalogsWithCover.length > 0 ? catalogsWithCover : allCatalogs;
    
    const transformed = transformPdfCatalogData(catalogsToReturn);
    console.log('FetchService: Transformed catalogs:', transformed);
    console.log('FetchService: Final return count:', transformed.length);
    
    return transformed;
  } catch (error: any) {
    console.error('FetchService: Exception fetching completed PDF catalogs:', error);
    throw error;
  }
};
