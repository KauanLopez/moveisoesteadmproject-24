
import React from 'react';

interface CatalogImageDisplayProps {
  imageUrl: string;
  imageTitle: string;
}

const CatalogImageDisplay: React.FC<CatalogImageDisplayProps> = ({
  imageUrl,
  imageTitle
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <img
        src={imageUrl}
        alt={imageTitle}
        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
        style={{
          maxWidth: 'calc(100% - 2rem)',
          maxHeight: 'calc(100% - 2rem)'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    </div>
  );
};

export default CatalogImageDisplay;
