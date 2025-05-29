
import React from 'react';

interface CarouselImageProps {
  imageUrl: string;
  imageTitle: string;
  isDragging: boolean;
  translateX: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const CarouselImage: React.FC<CarouselImageProps> = ({
  imageUrl,
  imageTitle,
  isDragging,
  translateX,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  return (
    <div 
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-8">
        <img
          src={imageUrl}
          alt={imageTitle}
          className="object-contain pointer-events-none rounded-lg shadow-sm"
          draggable={false}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto'
          }}
          onError={(e) => {
            console.error('CarouselImage: Failed to load image:', imageUrl);
            const target = e.target as HTMLImageElement;
            target.style.display = 'block';
            target.alt = 'Erro ao carregar imagem';
          }}
          onLoad={() => {
            console.log('CarouselImage: Image loaded successfully:', imageUrl);
          }}
        />
      </div>
    </div>
  );
};

export default CarouselImage;
