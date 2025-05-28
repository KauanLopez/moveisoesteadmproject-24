
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Edit2, Trash2, Eye } from 'lucide-react';
import { fetchPdfCatalogs, deletePdfCatalog, PdfCatalog } from '@/services/pdfCatalogService';
import PdfCatalogUploadForm from './PdfCatalogUploadForm';
import PdfCatalogEditForm from './PdfCatalogEditForm';
import PdfCatalogViewModal from './PdfCatalogViewModal';

const PdfCatalogManagement = () => {
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
    } catch (error) {
      console.error('Error loading PDF catalogs:', error);
      toast({
        title: "Erro ao carregar catálogos",
        description: "Não foi possível carregar os catálogos PDF.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    loadCatalogs();
  };

  const handleEditComplete = () => {
    setEditingCatalog(null);
    loadCatalogs();
  };

  const handleDelete = async (catalog: PdfCatalog) => {
    if (window.confirm(`Tem certeza que deseja excluir o catálogo "${catalog.title}"?`)) {
      try {
        await deletePdfCatalog(catalog.id);
        toast({
          title: "Catálogo excluído",
          description: "O catálogo foi excluído com sucesso."
        });
        loadCatalogs();
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o catálogo.",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído',
      failed: 'Falhou'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  if (showUploadForm) {
    return (
      <PdfCatalogUploadForm
        onComplete={handleUploadComplete}
        onCancel={() => setShowUploadForm(false)}
      />
    );
  }

  if (editingCatalog) {
    return (
      <PdfCatalogEditForm
        catalog={editingCatalog}
        onComplete={handleEditComplete}
        onCancel={() => setEditingCatalog(null)}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catálogos PDF</CardTitle>
          <Button 
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Novo Catálogo PDF
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-green mx-auto mb-4"></div>
              <p>Carregando catálogos...</p>
            </div>
          ) : catalogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum catálogo PDF encontrado</h3>
              <p className="text-gray-500 mb-4">Faça o upload do seu primeiro catálogo PDF para começar.</p>
              <Button onClick={() => setShowUploadForm(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Catálogo PDF
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {catalogs.map((catalog) => (
                <div key={catalog.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {catalog.cover_image_url ? (
                        <img 
                          src={catalog.cover_image_url} 
                          alt={catalog.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{catalog.title}</h3>
                        <p className="text-sm text-gray-500">{catalog.description}</p>
                        <p className="text-xs text-gray-400">
                          {catalog.total_pages} páginas • {new Date(catalog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(catalog.processing_status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {catalog.processing_status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingCatalog(catalog)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCatalog(catalog)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(catalog)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>

                  {catalog.processing_error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      Erro: {catalog.processing_error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {viewingCatalog && (
        <PdfCatalogViewModal
          catalog={viewingCatalog}
          isOpen={!!viewingCatalog}
          onClose={() => setViewingCatalog(null)}
        />
      )}
    </>
  );
};

export default PdfCatalogManagement;
