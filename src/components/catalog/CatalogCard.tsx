
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCatalogRoute, CatalogWithCategory } from '@/types/catalogTypes';

interface CatalogCardProps {
  catalog: CatalogWithCategory;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalog }) => {
  const defaultImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1858&auto=format&fit=crop";

  return (
    <Link to={getCatalogRoute(catalog.slug)}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-60">
          <img
            src={catalog.cover_image || defaultImage}
            alt={catalog.title}
            className="w-full h-full object-cover"
          />
          {catalog.category_name && (
            <span className="absolute top-3 right-3 bg-white/90 text-sm px-3 py-1 rounded-full">
              {catalog.category_name}
            </span>
          )}
        </div>
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-medium text-lg text-primary">{catalog.title}</h3>
          {catalog.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{catalog.description}</p>
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <span className="text-sm text-primary hover:underline">Ver catálogo</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CatalogCard;
