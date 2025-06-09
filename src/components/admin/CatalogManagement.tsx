
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Image, Star, Trash2 } from 'lucide-react';
import { getCatalogs, createCatalog, deleteCatalog, AdminCatalog } from '@/services/adminCatalogService';
import CreateCatalogModal from './CreateCatalogModal';
import CatalogImagesModal from './CatalogImagesModal';

const CatalogManagement = () => {
  const [catalogs, setCatalogs] = useState<AdminCatalog[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<AdminCatalog | null>(null);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = () => {
    const catalogsData = getCatalogs();
    setCatalogs(catalogsData);
  };

  const handleCreateCatalog = (catalogData: { name: string; description: string; coverImage: string }) => {
    try {
      createCatalog(catalogData);
      loadCatalogs();
      setShowCreateModal(false);
      toast({
        title: "Catálogo criado",
        description: "O catálogo foi criado com sucesso."
      });
    } catch (error) {
      console.error('Error creating catalog:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o catálogo.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCatalog = (catalogId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este catálogo?')) {
      try {
        deleteCatalog(catalogId);
        loadCatalogs();
        toast({
          title: "Catálogo excluído",
          description: "O catálogo foi excluído com sucesso."
        });
      } catch (error) {
        console.error('Error deleting catalog:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o catálogo.",
          variant: "destructive"
        });
      }
    }
  };

  const handleOpenImagesModal = (catalog: AdminCatalog) => {
    setSelectedCatalog(catalog);
    setShowImagesModal(true);
  };

  const handleCloseImagesModal = () => {
    setShowImagesModal(false);
    setSelectedCatalog(null);
    loadCatalogs(); // Reload to get updated data
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Catálogos</h2>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Novo Catálogo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => (
          <Card key={catalog.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={catalog.coverImage}
                alt={catalog.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=Imagem+não+encontrada';
                }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{catalog.name}</CardTitle>
              <p className="text-sm text-gray-600">{catalog.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenImagesModal(catalog)}
                  className="flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Adicionar/Ver Imagens ({catalog.images.length})
                </Button>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {catalog.images.filter(img => img.isFeatured).length} em destaque
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCatalog(catalog.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {catalogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum catálogo encontrado.</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Catálogo
          </Button>
        </div>
      )}

      {showCreateModal && (
        <CreateCatalogModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCatalog}
        />
      )}

      {showImagesModal && selectedCatalog && (
        <CatalogImagesModal
          catalog={selectedCatalog}
          onClose={handleCloseImagesModal}
        />
      )}
    </div>
  );
};

export default CatalogManagement;
