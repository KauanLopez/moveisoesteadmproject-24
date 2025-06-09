
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';

const FeaturedProductsView = () => {
  const { products: featuredProducts, loading } = useFeaturedProducts();

  const handleRefresh = () => {
    window.location.reload();
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Preview: Produtos em Destaque
          </h2>
          <p className="text-gray-600 mt-1">
            Esta é uma visualização espelho de como a seção "Produtos em Destaque" aparece na página principal do site
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar Preview
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>ℹ️ Sincronização:</strong> Esta galeria exibe exatamente as mesmas imagens que aparecem 
          na seção "Produtos em Destaque" da página principal do site. Os dados são carregados diretamente 
          do localStorage usado pela página principal.
        </p>
      </div>

      {featuredProducts.length > 0 ? (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600 fill-current" />
              <p className="text-green-800 font-medium">
                {featuredProducts.length} {featuredProducts.length === 1 ? 'produto está sendo exibido' : 'produtos estão sendo exibidos'} na seção de destaque da página principal.
              </p>
            </div>
          </div>

          {/* Mirror of the main page layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-furniture-green mb-4">Produtos em Destaque</h3>
              <div className="w-20 h-1 bg-furniture-yellow mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative group">
                    <img
                      src={product.image}
                      alt={product.title || 'Produto em destaque'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {product.title && (
                      <h4 className="font-medium text-lg mb-2">{product.title}</h4>
                    )}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Seção: {product.section}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Star className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            Nenhum produto em destaque encontrado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No momento, não há produtos marcados como favoritos. Para adicionar produtos à seção de destaque, 
            acesse "Gerenciar Catálogos" e clique na estrela das imagens que deseja destacar.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 max-w-lg mx-auto border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Como adicionar produtos em destaque:</h4>
            <div className="text-sm text-blue-800 text-left space-y-2">
              <p>• Acesse a seção "Gerenciar Catálogos"</p>
              <p>• Clique em "Ver Imagens do Catálogo" em qualquer catálogo</p>
              <p>• Clique no ícone da estrela (⭐) nas imagens que deseja destacar</p>
              <p>• Volte a esta seção para ver os produtos destacados</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsView;
