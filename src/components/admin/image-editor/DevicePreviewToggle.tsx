
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface DevicePreviewToggleProps {
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  onChange: (value: 'desktop' | 'tablet' | 'mobile') => void;
}

const DevicePreviewToggle: React.FC<DevicePreviewToggleProps> = ({
  devicePreview,
  onChange
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-2">
        Visualize como a imagem aparecerá em diferentes dispositivos:
      </p>
      <ToggleGroup 
        type="single" 
        value={devicePreview} 
        onValueChange={(value) => value && onChange(value as 'desktop' | 'tablet' | 'mobile')}
      >
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
  );
};

export default DevicePreviewToggle;
