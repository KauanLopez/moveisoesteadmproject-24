
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ExternalUrlCatalog } from '@/types/customTypes';
import { fetchExternalCatalogs, deleteExternalCatalog } from '@/services/externalCatalogService';
import ExternalCatalogForm from './ExternalCatalogForm';
import ExternalCatalogViewModal from './ExternalCatalogViewModal';

const ExternalCatalogManagement = () => {
  const [catalogs, setCatalogs] = useState<ExternalUrlCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<ExternalUrlCatalog | undefined>();
  const [viewingCatalog, setViewingCatalog] = useState<ExternalUrlCatalog | null>(null);
  const { toast } = useToast();

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const data = await fetchExternalCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error('Error loading external catalogs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleEdit = (catalog: ExternalUrlCatalog) => {
    setSelectedCatalog(catalog);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedCatalog(undefined);
    setShowForm(true);
  };

  const handleDelete = async (catalog: ExternalUrlCatalog) => {
    if (window.confirm(`Tem certeza que deseja excluir o catálogo "${catalog.title}"?`)) {
      try {
        await deleteExternalCatalog(catalog.id);
        toast({
          title: "Sucesso",
          description: "Catálogo excluído com sucesso.",
        });
        loadCatalogs();
      } catch (error) {
        console.error('Error deleting catalog:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir catálogo.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFormClose = (shouldRefresh: boolean) => {
    setShowForm(false);
    setSelectedCatalog(undefined);
    if (shouldRefresh) {
      loadCatalogs();
    }
  };

  if (showForm) {
    return (
      <ExternalCatalogForm
        catalog={selectedCatalog}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catálogos com URLs Externas</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Catálogo
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : catalogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum catálogo encontrado.</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Catálogo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {catalogs.map((catalog) => (
                <div key={catalog.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={catalog.external_cover_image_url}
                      alt={catalog.title}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="font-medium">{catalog.title}</h3>
                      <p className="text-sm text-gray-500">{catalog.description}</p>
                      <p className="text-xs text-gray-400">
                        {catalog.external_content_image_urls.length} imagens de conteúdo
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewingCatalog(catalog)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(catalog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(catalog)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {viewingCatalog && (
        <ExternalCatalogViewModal
          catalog={viewingCatalog}
          isOpen={!!viewingCatalog}
          onClose={() => setViewingCatalog(null)}
        />
      )}
    </div>
  );
};

export default ExternalCatalogManagement;
