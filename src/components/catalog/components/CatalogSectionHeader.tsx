import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CatalogSectionHeaderProps {
  title: string;
  showViewAllButton?: boolean;
  viewAllLink?: string;
  buttonText?: string;
}

const CatalogSectionHeader: React.FC<CatalogSectionHeaderProps> = ({
  title,
  showViewAllButton = false,
  viewAllLink = "/catalogo",
  buttonText = "Ver Todos"
}) => {
  return (
    <div className="text-center mb-10 md:mb-12"> {/* Centraliza o título e ajusta margem */}
      <h2 className="text-3xl md:text-4xl font-display font-bold text-furniture-green">
        {title}
      </h2>
      {showViewAllButton && (
        <div className="mt-6">
          <Button asChild variant="outline" size="lg" className="border-furniture-green text-furniture-green hover:bg-furniture-green hover:text-white">
            <Link to={viewAllLink || "/catalogo"}>{buttonText}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogSectionHeader;