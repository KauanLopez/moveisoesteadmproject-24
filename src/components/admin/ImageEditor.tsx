
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ImageContent } from '@/context/ContentContext';
import { ZoomIn, ZoomOut, Move, Image, Smartphone, Tablet, Monitor } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const [scale, setScale] = useState(content.scale || 1);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get aspect ratio based on section and device
  const getAspectRatio = () => {
    // Base aspect ratios for different sections
    const baseRatios: Record<string, number> = {
      'projects': 16/9, // Widescreen for projects
      'products': 3/4,  // Portrait for products
      'manager': 1,     // Square for manager
    };
    
    // Adjust aspect ratio based on device
    switch(devicePreview) {
      case 'mobile':
        // Mobile typically has taller aspect ratios
        return baseRatios[section] ? Math.min(baseRatios[section] * 0.6, 1) : 9/16;
      case 'tablet':
        // Tablet is somewhere between desktop and mobile
        return baseRatios[section] || 4/3;
      default:
        // Desktop uses the base ratio
        return baseRatios[section] || 16/9;
    }
  };

  // Get preview height based on section and device
  const getPreviewHeight = () => {
    const baseHeights: Record<string, string> = {
      'projects': 'h-64',  // Taller for projects
      'products': 'h-80',  // Medium for products
      'manager': 'h-96',   // Square-ish for manager
    };
    
    // Adjust height based on device
    switch(devicePreview) {
      case 'mobile':
        return 'h-96'; // Taller preview for mobile
      case 'tablet':
        return 'h-80'; // Medium height for tablet
      default:
        return baseHeights[section] || 'h-64';
    }
  };
  
  // Get preview width based on device
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
      
      {/* Device preview selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">
          Visualize como a imagem aparecerá em diferentes dispositivos:
        </p>
        <ToggleGroup type="single" value={devicePreview} onValueChange={(value) => value && setDevicePreview(value as 'desktop' | 'tablet' | 'mobile')}>
          <ToggleGroupItem value="desktop" aria-label="Visualização para Desktop" className="flex items-center gap-1">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Desktop</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Visualização para Tablet" className="flex items-center gap-1">
            <Tablet className="h-4 w-4" />
            <span className="hidden sm:inline">Tablet</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Visualização para Celular" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Celular</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Image Preview with drag positioning and zoom */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Visualização da imagem (prévia de como irá aparecer no site)
        </p>
        
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
          
          <AspectRatio ratio={getAspectRatio()} className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <div 
              ref={imageContainerRef}
              className={`relative w-full h-full cursor-move overflow-hidden bg-gray-100`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={(e) => {
                setIsDragging(true);
                setDragStart({
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY
                });
              }}
              onTouchMove={(e) => {
                if (isDragging) {
                  const deltaX = (e.touches[0].clientX - dragStart.x) * 0.5;
                  const deltaY = (e.touches[0].clientY - dragStart.y) * 0.5;
                  
                  // Parse current position
                  const [xPos, yPos] = objectPosition.includes('%') 
                    ? objectPosition.split(' ').map(val => parseInt(val) || 50) 
                    : ['50%', '50%'].map(val => parseInt(val) || 50);
                  
                  const newX = xPos - deltaX;
                  const newY = yPos - deltaY;
                  
                  const newPosition = `${newX}% ${newY}%`;
                  setObjectPosition(newPosition);
                  setDragStart({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                  });
                }
              }}
              onTouchEnd={() => {
                if (isDragging) {
                  setIsDragging(false);
                  onUpdate({ objectPosition });
                }
              }}
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
              
              {/* Device specific guides */}
              {devicePreview === 'mobile' && (
                <div className="absolute inset-x-0 top-1/3 border-t border-yellow-500 border-dashed opacity-50 z-10"></div>
              )}
              {devicePreview !== 'desktop' && (
                <div className="absolute inset-y-0 left-1/3 border-l border-yellow-500 border-dashed opacity-50 z-10"></div>
              )}
            </div>
          </AspectRatio>
          
          {/* Device label */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            {devicePreview === 'desktop' ? 'Visualizando em Desktop' : 
             devicePreview === 'tablet' ? 'Visualizando em Tablet' : 'Visualizando em Celular'}
          </div>
        </div>
        
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
          <strong>Dica:</strong> Use o zoom e o reposicionamento para enquadrar perfeitamente a imagem como deseja que apareça no site. Verifique como ficará em diferentes dispositivos.
        </p>
      </div>
    </div>
  );
};

export default ImageEditor;
