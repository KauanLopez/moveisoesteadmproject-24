
import { useState, useCallback } from 'react';

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: Array<{ url: string; title: string }>;
}

interface UseCatalogCarouselProps {
  catalogs: Catalog[];
  onCatalogClick: (catalog: Catalog) => void;
}

export const useCatalogCarousel = ({ catalogs, onCatalogClick }: UseCatalogCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const nextCatalog = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % catalogs.length);
  }, [catalogs.length]);

  const prevCatalog = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + catalogs.length) % catalogs.length);
  }, [catalogs.length]);

  const handleCatalogClick = (catalog: Catalog) => {
    onCatalogClick(catalog);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (diff > threshold) {
      prevCatalog();
    } else if (diff < -threshold) {
      nextCatalog();
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (diff > threshold) {
      prevCatalog();
    } else if (diff < -threshold) {
      nextCatalog();
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  return {
    currentIndex,
    setCurrentIndex,
    isDragging,
    startX,
    currentX,
    nextCatalog,
    prevCatalog,
    handleCatalogClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
