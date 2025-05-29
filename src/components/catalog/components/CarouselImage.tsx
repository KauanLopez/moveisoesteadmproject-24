
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
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none bg-gray-50 p-4"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <img
        src={imageUrl}
        alt={imageTitle}
        className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none rounded-lg shadow-lg"
        style={{
          maxWidth: 'calc(100% - 2rem)',
          maxHeight: 'calc(100% - 2rem)'
        }}
        draggable={false}
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
  );
};

export default CarouselImage;
