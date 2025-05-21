
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Catalog, CatalogCategory } from '@/types/catalogTypes';
import { fetchCatalogs, fetchCatalogCategories } from '@/services/catalogService';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CatalogForm from './CatalogForm';
import CatalogItemManagement from './CatalogItemManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CatalogDetailsPanel = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogsData, categoriesData] = await Promise.all([
        fetchCatalogs(),
        fetchCatalogCategories()
      ]);
      setCatalogs(catalogsData);
      setCategories(categoriesData);
      
      // Set initial catalog if available
      if (catalogsData.length > 0 && !selectedCatalogId) {
        setSelectedCatalogId(catalogsData[0].id);
      }
    } catch (error) {
      console.error('Error loading catalog data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os catálogos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedCatalog = catalogs.find(cat => cat.id === selectedCatalogId);

  const handleCatalogFormClose = (shouldRefresh: boolean) => {
    if (shouldRefresh) {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold">Detalhes do Catálogo</h2>
        
        <div className="w-full md:w-72">
          <Select
            value={selectedCatalogId}
            onValueChange={(value) => {
              setSelectedCatalogId(value);
              setActiveTab("details");
            }}
            disabled={loading || catalogs.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um catálogo" />
            </SelectTrigger>
            <SelectContent>
              {catalogs.map(catalog => (
                <SelectItem key={catalog.id} value={catalog.id}>
                  {catalog.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando catálogos...</div>
      ) : catalogs.length === 0 ? (
        <Card className="p-6 text-center">
          <p>Nenhum catálogo encontrado. Crie um catálogo primeiro.</p>
        </Card>
      ) : selectedCatalog ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Detalhes do Catálogo</TabsTrigger>
            <TabsTrigger value="items">Itens do Catálogo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <CatalogForm
              catalog={selectedCatalog}
              categories={categories}
              onClose={handleCatalogFormClose}
            />
          </TabsContent>
          
          <TabsContent value="items" className="space-y-4">
            <CatalogItemManagement catalog={selectedCatalog} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-6 text-center">
          <p>Selecione um catálogo para visualizar seus detalhes.</p>
        </Card>
      )}
    </div>
  );
};

export default CatalogDetailsPanel;
