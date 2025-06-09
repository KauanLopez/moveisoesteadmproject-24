
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedImages, AdminCatalogImage, getCatalogs } from '@/services/adminCatalogService';

const FeaturedProductsView = () => {
  const [featuredImages, setFeaturedImages] = useState<AdminCatalogImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedImages();
  }, []);

  const loadFeaturedImages = () => {
    setLoading(true);
    try {
      const images = getFeaturedImages();
      setFeaturedImages(images);
    } catch (error) {
      console.error('Error loading featured images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCatalogName = (catalogId: string): string => {
    const catalogs = getCatalogs();
    const catalog = catalogs.find(c => c.id === catalogId);
    return catalog?.name || 'Catálogo não encontrado';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando produtos em destaque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
          <p className="text-gray-600">
            Preview de como a seção "Produtos em Destaque" aparece na página principal
          </p>
        </div>
        <Button onClick={loadFeaturedImages} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {featuredImages.length > 0 ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <Star className="h-4 w-4 inline mr-1" />
              {featuredImages.length} {featuredImages.length === 1 ? 'produto está sendo exibido' : 'produtos estão sendo exibidos'} na seção de destaque da página principal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.title || 'Produto em destaque'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  {image.title && (
                    <CardTitle className="text-lg">{image.title}</CardTitle>
                  )}
                  <p className="text-sm text-gray-600">
                    Do catálogo: {getCatalogName(image.catalogId)}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-500">
                    Adicionado em {new Date(image.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto em destaque
          </h3>
          <p className="text-gray-600 mb-4">
            Para adicionar produtos em destaque, vá para "Gerenciar Catálogos" e marque imagens com a estrela ⭐️
          </p>
          <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              <strong>Como adicionar produtos em destaque:</strong><br/>
              1. Acesse "Gerenciar Catálogos"<br/>
              2. Clique em "Adicionar/Ver Imagens" em um catálogo<br/>
              3. Clique na estrela ⭐️ das imagens que deseja destacar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsView;
