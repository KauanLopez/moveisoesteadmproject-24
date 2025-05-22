
import React from 'react';

interface ContentImagePreviewProps {
  imageUrl: string | null;
  imageFile: File | null;
}

const ContentImagePreview: React.FC<ContentImagePreviewProps> = ({
  imageUrl,
  imageFile
}) => {
  if (!imageUrl && !imageFile) return null;
  
  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;
  
  return (
    <div className="mt-4">
      <p className="block text-sm font-medium text-gray-700 mb-1">
        Visualização
      </p>
      <div className="w-full h-60 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={previewUrl || ''}
          alt="Visualização"
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x300?text=Imagem+Inválida";
          }}
        />
      </div>
    </div>
  );
};

export default ContentImagePreview;
