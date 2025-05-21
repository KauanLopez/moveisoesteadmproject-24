
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ImageControlsProps {
  scale: number;
  onScaleChange: (value: number) => void;
  onReset: () => void;
  objectPosition: string;
  onPositionSelect: (position: string) => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({
  scale,
  onScaleChange,
  onReset,
  objectPosition,
}) => {
  const handleZoomIn = () => {
    // Allow more zoom for better control
    const newScale = Math.min(scale + 0.1, 4.0);
    onScaleChange(newScale);
  };

  const handleZoomOut = () => {
    // Allow more zoom out for positioning flexibility
    const newScale = Math.max(scale - 0.1, 0.5);
    onScaleChange(newScale);
  };

  const handleSliderChange = (value: number[]) => {
    onScaleChange(value[0]);
  };

  return (
    <>
      {/* Zoom controls */}
      <div className="mt-3 space-y-3">
        <div className="flex items-center space-x-2">
          <ZoomOut size={18} className="text-gray-500" />
          <Slider
            value={[scale]}
            min={0.5}
            max={4.0}
            step={0.1}
            onValueChange={handleSliderChange}
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
            onClick={onReset}
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
    </>
  );
};

export default ImageControls;
