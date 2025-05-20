
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ImageContent } from '@/context/ContentContext';
import { ZoomIn, ZoomOut, Move, Image } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageEditorProps {
  content: ImageContent;
  onUpdate: (updates: Partial<ImageContent>) => void;
  section: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ content, onUpdate, section }) => {
  const [imageUrl, setImageUrl] = useState(content.image);
  const [isDragging, setIsDragging] = useState(false);
  const [objectPosition, setObjectPosition] = useState(content.objectPosition || 'center');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get aspect ratio based on section
  const getAspectRatio = () => {
    switch(section) {
      case 'projects':
        return 16/9; // Widescreen for projects
      case 'products':
        return 3/4;  // Portrait for products
      case 'manager':
        return 1;    // Square for manager
      default:
        return 16/9;
    }
  };

  // Get preview height based on section
  const getPreviewHeight = () => {
    switch(section) {
      case 'projects':
        return 'h-64';  // Taller for projects
      case 'products':
        return 'h-80';  // Medium for products
      case 'manager':
        return 'h-96';  // Square-ish for manager
      default:
        return 'h-64';
    }
  };

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
      
      // Prevent default behavior to avoid text selection during drag
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageContainerRef.current) {
      const deltaX = (e.clientX - dragStart.x) * 0.5;
      const deltaY = (e.clientY - dragStart.y) * 0.5;
      
      // Parse current position
      const [xPos, yPos] = objectPosition.includes('%') 
        ? objectPosition.split(' ').map(val => parseInt(val) || 50) 
        : ['50%', '50%'].map(val => parseInt(val) || 50);
      
      // Allow movement beyond boundaries for maximum flexibility
      const newX = xPos - deltaX;
      const newY = yPos - deltaY;
      
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

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    setScale(newScale);
    onUpdate({ scale: newScale });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5);
    setScale(newScale);
    onUpdate({ scale: newScale });
  };

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0];
    setScale(newScale);
    onUpdate({ scale: newScale });
  };

  // Reset position and scale
  const handleReset = () => {
    setObjectPosition('center');
    setScale(1);
    onUpdate({ objectPosition: 'center', scale: 1 });
  };

  useEffect(() => {
    // Initialize scale from content if it exists
    if (content.scale) {
      setScale(content.scale);
    }
  }, [content.scale]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Editar Imagem</h3>
      
      {/* Image Preview with drag positioning and zoom */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Visualização da imagem (prévia de como irá aparecer no site)
        </p>
        
        <AspectRatio ratio={getAspectRatio()} className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <div 
            ref={imageContainerRef}
            className={`relative w-full h-full cursor-move overflow-hidden bg-gray-100`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageRef}
              src={content.image} 
              alt={content.title}
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
          </div>
        </AspectRatio>
        
        {/* Zoom controls */}
        <div className="mt-3 space-y-3">
          <div className="flex items-center space-x-2">
            <ZoomOut size={18} className="text-gray-500" />
            <Slider
              value={[scale]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={handleScaleChange}
              className="flex-grow"
            />
            <ZoomIn size={18} className="text-gray-500" />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomOut}
              className="flex-1"
            >
              <ZoomOut size={18} className="mr-1" />
              Diminuir
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="flex-1"
            >
              Resetar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomIn}
              className="flex-1"
            >
              <ZoomIn size={18} className="mr-1" />
              Aumentar
            </Button>
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
            <Image className="mr-2 h-4 w-4" />
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
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          <strong>Dica:</strong> Use o zoom e o reposicionamento para enquadrar perfeitamente a imagem como deseja que apareça no site.
        </p>
      </div>
    </div>
  );
};

export default ImageEditor;
