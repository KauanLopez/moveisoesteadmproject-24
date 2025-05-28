
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image } from 'lucide-react';
import { findCatalogByTitle, updateCatalogWithImages } from '@/services/pdfCatalogService';

const UpdateSamecCatalog: React.FC = () => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Define the uploaded images
  const images = [
    '/lovable-uploads/1e5ada3d-9fb8-4f1d-a7ce-9e11821e0a79.png', // Cover image
    '/lovable-uploads/cc20161d-74c9-4c0a-9be6-51f6fdac8ee9.png',
    '/lovable-uploads/ac1d3932-e771-4bc4-9c24-b661af02c17c.png',
    '/lovable-uploads/39819c48-1850-4472-9fa7-3c63c408457a.png',
    '/lovable-uploads/9694cfbe-22bd-4d2b-9dc9-e2d50a427d0c.png',
    '/lovable-uploads/57fa7576-3258-42aa-ba79-2d0d1944e7e7.png',
    '/lovable-uploads/79f37d72-b6ca-4b86-8a09-f0438f887865.png',
    '/lovable-uploads/6edcb4e4-2834-4290-96bc-bfed4ef40eed.png',
    '/lovable-uploads/0fac9883-6519-46cd-ae45-4201b28134aa.png',
    '/lovable-uploads/3a62e9bf-7b57-43e2-af14-2f3622dee76b.png'
  ];

  const handleUpdateCatalog = async () => {
    setUpdating(true);
    try {
      // Find the "Catalogo SAMEC" catalog
      const catalog = await findCatalogByTitle("Catalogo SAMEC");
      
      if (!catalog) {
        toast({
          title: "Catálogo não encontrado",
          description: "O catálogo 'Catalogo SAMEC' não foi encontrado.",
          variant: "destructive"
        });
        return;
      }

      // Set the first image as cover and the rest as content images
      const coverImage = images[0];
      const contentImages = images.slice(1);

      // Update the catalog
      await updateCatalogWithImages(catalog.id, coverImage, contentImages);

      toast({
        title: "Catálogo atualizado",
        description: "O catálogo SAMEC foi atualizado com as novas imagens.",
      });

    } catch (error: any) {
      console.error('Error updating SAMEC catalog:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o catálogo.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Atualizar Catálogo SAMEC
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Clique no botão abaixo para atualizar o catálogo "Catalogo SAMEC" com as novas imagens carregadas.
          A primeira imagem será definida como capa e as demais serão adicionadas ao carrossel.
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`Imagem ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                  Capa
                </div>
              )}
            </div>
          ))}
        </div>
        
        {images.length > 5 && (
          <p className="text-xs text-gray-500">
            E mais {images.length - 5} imagens para o carrossel...
          </p>
        )}

        <Button 
          onClick={handleUpdateCatalog}
          disabled={updating}
          className="w-full"
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Atualizar Catálogo SAMEC
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateSamecCatalog;
