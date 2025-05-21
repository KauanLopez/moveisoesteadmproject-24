
import React, { useState, useEffect } from 'react';
import { ImageContent } from '@/context/ContentContext';
import DevicePreviewToggle from './DevicePreviewToggle';
import ImagePreview from './ImagePreview';
import ImageControls from './ImageControls';
import ImageSourceInput from './ImageSourceInput';
import { getAspectRatio } from './AspectRatioUtils';

interface ImageEditorProps {
  content: ImageContent;
  onUpdate: (updates: Partial<ImageContent>) => void;
  section: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ content, onUpdate, section }) => {
  const [imageUrl, setImageUrl] = useState(content.image);
  const [objectPosition, setObjectPosition] = useState(content.objectPosition || 'center');
  const [scale, setScale] = useState(content.scale || 1);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Handle position change from drag
  const handlePositionChange = (newPosition: string) => {
    setObjectPosition(newPosition);
    onUpdate({ objectPosition: newPosition });
  };

  // Handle scale change from zoom controls
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    onUpdate({ scale: newScale });
  };

  // Reset position and scale
  const handleReset = () => {
    setObjectPosition('center');
    setScale(1);
    onUpdate({ objectPosition: 'center', scale: 1 });
  };

  // Handle URL change
  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onUpdate({ image: url });
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newImageUrl = event.target.result.toString();
        setImageUrl(newImageUrl);
        onUpdate({ image: newImageUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Initialize from content if it exists
  useEffect(() => {
    if (content.image) {
      setImageUrl(content.image);
    }
    if (content.objectPosition) {
      setObjectPosition(content.objectPosition);
    }
    if (content.scale) {
      setScale(content.scale);
    }
  }, [content.image, content.objectPosition, content.scale]);

  // Calculate aspect ratio based on section and device
  const aspectRatio = getAspectRatio(section, devicePreview);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Editar Imagem</h3>
      
      {/* Device preview selector */}
      <DevicePreviewToggle 
        devicePreview={devicePreview} 
        onChange={(value) => setDevicePreview(value)} 
      />
      
      {/* Image Preview */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Visualização da imagem (prévia de como irá aparecer no site)
        </p>
        
        <div className="max-w-full overflow-hidden">
          <ImagePreview
            image={content.image}
            title={content.title}
            objectPosition={objectPosition}
            scale={scale}
            onPositionChange={handlePositionChange}
            devicePreview={devicePreview}
            aspectRatio={aspectRatio}
          />
        </div>
        
        {/* Zoom controls */}
        <ImageControls
          scale={scale}
          onScaleChange={handleScaleChange}
          onReset={handleReset}
          objectPosition={objectPosition}
          onPositionSelect={() => {}} // Position selection buttons removed as requested
        />
      </div>
      
      {/* Image source input */}
      <ImageSourceInput
        initialUrl={imageUrl}
        onUrlChange={handleUrlChange}
        onFileUpload={handleFileUpload}
      />
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          <strong>Dica:</strong> Use o zoom para enquadrar perfeitamente a imagem como deseja que apareça no site. Verifique como ficará em diferentes dispositivos.
        </p>
      </div>
    </div>
  );
};

export default ImageEditor;
