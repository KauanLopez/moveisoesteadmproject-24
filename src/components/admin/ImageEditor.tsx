
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageContent } from '@/context/ContentContext';

interface ImageEditorProps {
  content: ImageContent;
  onUpdate: (updates: Partial<ImageContent>) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ content, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(content.image);
  const [isDragging, setIsDragging] = useState(false);
  const [objectPosition, setObjectPosition] = useState(content.objectPosition || 'center');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleApplyUrl = () => {
    onUpdate({ image: imageUrl });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImageUrl = event.target.result.toString();
          setImageUrl(newImageUrl);
          onUpdate({ image: newImageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageContainerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageContainerRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Parse current position
      const [xPos, yPos] = objectPosition.split(' ');
      const xValue = parseInt(xPos) || 50;
      const yValue = parseInt(yPos) || 50;
      
      // Update position (limit to reasonable range)
      const newX = Math.max(0, Math.min(100, xValue - deltaX / 5));
      const newY = Math.max(0, Math.min(100, yValue - deltaY / 5));
      
      const newPosition = `${newX}% ${newY}%`;
      setObjectPosition(newPosition);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onUpdate({ objectPosition });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Editar Imagem</h3>
      
      {/* Image Preview with drag positioning */}
      <div className="mb-6">
        <div 
          ref={imageContainerRef}
          className="relative w-full h-64 overflow-hidden border-2 border-dashed border-gray-300 rounded-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            src={content.image} 
            alt={content.title}
            className="absolute w-full h-full object-cover transition-all duration-200"
            style={{ objectPosition }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <p className="text-white font-medium bg-black/50 px-3 py-1 rounded">
              Clique e arraste para ajustar a posição
            </p>
          </div>
        </div>
      </div>
      
      {/* Image URL Input */}
      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="flex-grow"
          />
          <Button onClick={handleApplyUrl}>Aplicar</Button>
        </div>
      </div>
      
      {/* File Upload */}
      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Carregar do Dispositivo</label>
        <div className="flex space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Escolher Arquivo
          </Button>
        </div>
      </div>
      
      {/* Image position controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Posição da Imagem</label>
        <div className="grid grid-cols-3 gap-2">
          {['left top', 'center top', 'right top', 'left center', 'center', 'right center', 'left bottom', 'center bottom', 'right bottom'].map((position) => (
            <Button
              key={position}
              variant={objectPosition === position ? "default" : "outline"}
              size="sm"
              className={objectPosition === position ? "bg-furniture-green" : ""}
              onClick={() => {
                setObjectPosition(position);
                onUpdate({ objectPosition: position });
              }}
            >
              {position.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
