
import React, { useRef, useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImagePreviewProps {
  image: string;
  title: string;
  objectPosition: string;
  scale: number;
  onPositionChange: (newPosition: string) => void;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  aspectRatio: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  title,
  objectPosition,
  scale,
  onPositionChange,
  devicePreview,
  aspectRatio
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const getPreviewWidth = () => {
    switch(devicePreview) {
      case 'mobile':
        return 'max-w-[320px]'; // Phone width
      case 'tablet':
        return 'max-w-[600px]'; // Tablet width
      default:
        return 'w-full'; // Full width for desktop
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageContainerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      
      // Prevent default behavior to avoid text selection during drag
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageContainerRef.current) {
      // Increase sensitivity for more responsive movement
      const deltaX = (e.clientX - dragStart.x) * 0.8;
      const deltaY = (e.clientY - dragStart.y) * 0.8;
      
      // Parse current position
      const [xPos, yPos] = objectPosition.includes('%') 
        ? objectPosition.split(' ').map(val => parseInt(val) || 50) 
        : ['50%', '50%'].map(val => parseInt(val) || 50);
      
      // Allow more extended movement beyond boundaries
      // Note: We're removing previous limits to allow free movement
      const newX = xPos - deltaX;
      const newY = yPos - deltaY;
      
      const newPosition = `${newX}% ${newY}%`;
      onPositionChange(newPosition);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      // Increase sensitivity for mobile
      const deltaX = (e.touches[0].clientX - dragStart.x) * 0.8;
      const deltaY = (e.touches[0].clientY - dragStart.y) * 0.8;
      
      // Parse current position
      const [xPos, yPos] = objectPosition.includes('%') 
        ? objectPosition.split(' ').map(val => parseInt(val) || 50) 
        : ['50%', '50%'].map(val => parseInt(val) || 50);
      
      // Remove limits for free positioning
      const newX = xPos - deltaX;
      const newY = yPos - deltaY;
      
      const newPosition = `${newX}% ${newY}%`;
      onPositionChange(newPosition);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <div className={`mx-auto ${getPreviewWidth()} transition-all duration-300 relative`}>
      {/* Device frame */}
      <div className="absolute inset-0 border-4 border-gray-300 rounded-lg pointer-events-none z-10">
        {devicePreview === 'mobile' && (
          <>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-300 rounded-full"></div>
          </>
        )}
      </div>
      
      <AspectRatio ratio={aspectRatio} className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <div 
          ref={imageContainerRef}
          className="relative w-full h-full cursor-move overflow-hidden bg-gray-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={image} 
            alt={title}
            className="absolute w-full h-full object-cover transition-transform duration-200"
            style={{ 
              objectPosition, 
              transform: `scale(${scale})` 
            }}
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
            <p className="text-white font-medium bg-black/50 px-3 py-1 rounded text-sm">
              {isDragging ? "Reposicionando..." : "Clique e arraste para ajustar a posição"}
            </p>
          </div>
          
          {/* Device specific guides - made more subtle */}
          {devicePreview === 'mobile' && (
            <div className="absolute inset-x-0 top-1/3 border-t border-yellow-500/30 border-dashed z-10"></div>
          )}
          {devicePreview !== 'desktop' && (
            <div className="absolute inset-y-0 left-1/3 border-l border-yellow-500/30 border-dashed z-10"></div>
          )}
        </div>
      </AspectRatio>
      
      {/* Device label */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
        {devicePreview === 'desktop' ? 'Visualizando em Desktop' : 
         devicePreview === 'tablet' ? 'Visualizando em Tablet' : 'Visualizando em Celular'}
      </div>
    </div>
  );
};

export default ImagePreview;
