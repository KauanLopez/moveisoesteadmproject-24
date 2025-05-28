
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { fetchPdfCatalogs, deletePdfCatalog, PdfCatalog } from '@/services/pdfCatalogService';
import PdfCatalogUploadForm from './PdfCatalogUploadForm';
import PdfCatalogEditForm from './PdfCatalogEditForm';
import PdfCatalogViewModal from './PdfCatalogViewModal';
import UpdateSamecCatalog from './UpdateSamecCatalog';

const PdfCatalogManagement: React.FC = () => {
  const [catalogs, setCatalogs] = useState<PdfCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<PdfCatalog | null>(null);
  const [viewingCatalog, setViewingCatalog] = useState<PdfCatalog | null>(null);
  const { toast } = useToast();

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const data = await fetchPdfCatalogs();
      setCatalogs(data);
    } catch (error: any) {
      console.error('Error loading catalogs:', error);
      toast({
        title: "Erro ao carregar catálogos",
        description: error.message || "Não foi possível carregar os catálogos PDF.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este catálogo?')) {
      try {
        await deletePdfCatalog(id);
        toast({
          title: "Catálogo excluído",
          description: "O catálogo foi excluído com sucesso."
        });
        loadCatalogs();
      } catch (error: any) {
        toast({
          title: "Erro ao excluir",
          description: error.message || "Não foi possível excluir o catálogo.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    loadCatalogs();
  };

  const handleEditComplete = () => {
    setEditingCatalog(null);
    loadCatalogs();
  };

  if (editingCatalog) {
    return (
      <PdfCatalogEditForm 
        catalog={editingCatalog}
        onComplete={handleEditComplete}
        onCancel={() => setEditingCatalog(null)}
      />
    );
  }

  if (showUploadForm) {
    return (
      <PdfCatalogUploadForm 
        onComplete={handleUploadComplete}
        onCancel={() => setShowUploadForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Catálogos PDF</h2>
          <p className="text-gray-600">Gerencie catálogos PDF processados</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Catálogo PDF
        </Button>
      </div>

      {/* Update SAMEC Catalog Section */}
      <UpdateSamecCatalog />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green mx-auto mb-4"></div>
          <p>Carregando catálogos...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {catalogs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum catálogo encontrado</h3>
                <p className="text-gray-600 mb-4">Comece fazendo upload do seu primeiro catálogo PDF.</p>
                <Button onClick={() => setShowUploadForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Catálogo PDF
                </Button>
              </CardContent>
            </Card>
          ) : (
            catalogs.map((catalog) => (
              <Card key={catalog.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{catalog.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setViewingCatalog(catalog)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingCatalog(catalog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(catalog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {catalog.cover_image_url && (
                      <img 
                        src={catalog.cover_image_url} 
                        alt={catalog.title}
                        className="w-20 h-24 object-cover rounded border"
                      />
                    )}
                    <div className="flex-1">
                      {catalog.description && (
                        <p className="text-gray-600 mb-2">{catalog.description}</p>
                      )}
                      <div className="text-sm text-gray-500 space-y-1">
                        <p><strong>Status:</strong> {catalog.processing_status}</p>
                        <p><strong>Páginas:</strong> {catalog.total_pages}</p>
                        <p><strong>Imagens de conteúdo:</strong> {catalog.content_image_urls.length}</p>
                        <p><strong>Criado em:</strong> {new Date(catalog.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {viewingCatalog && (
        <PdfCatalogViewModal 
          catalog={viewingCatalog}
          isOpen={!!viewingCatalog}
          onClose={() => setViewingCatalog(null)}
        />
      )}
    </div>
  );
};

export default PdfCatalogManagement;
