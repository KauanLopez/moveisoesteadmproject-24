import { useEffect, useState, useRef, useCallback } from 'react';
import { useMobileDetection } from './useMobileDetection';
import { useAutoScroll } from './useAutoScroll';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useCarouselLogic = (products: Product[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMobileDetection();
  
  const extendedProducts = products.length > 0 ? [...products, ...products, ...products] : [];
  const totalItems = products.length;

  // Lógica de interação do usuário (para pausar auto-scroll)
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000); // Resume auto-scroll após 5 segundos
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (!carouselRef.current || totalItems === 0) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / extendedProducts.length;
    const scrollPosition = index * itemWidth;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [extendedProducts.length, totalItems]);
  
  // Estados para o arraste
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const onDragStart = useCallback((clientX: number) => {
    if (!carouselRef.current || totalItems === 0) return;
    handleUserInteraction();
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeftStart(carouselRef.current.scrollLeft);
    carouselRef.current.style.scrollBehavior = 'auto';
    carouselRef.current.style.cursor = 'grabbing';
  }, [handleUserInteraction, totalItems]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current || totalItems === 0) return;
    const x = clientX;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  }, [isDragging, startX, scrollLeftStart, totalItems]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || totalItems === 0) return;
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      carouselRef.current.style.cursor = 'grab';
      // O onScroll handler cuidará do snap e da atualização do índice.
      // Para garantir que o snap ocorra, podemos forçar um pequeno scroll se necessário,
      // ou confiar no comportamento nativo + nosso handleScroll.
      // Disparar o handleScroll manualmente pode ser uma opção se o snap não ocorrer.
      if (carouselRef.current && typeof carouselRef.current.onscroll === 'function') {
        // Simular um evento de scroll para forçar a lógica de snap/índice.
        // Isso pode precisar de ajuste fino.
        carouselRef.current.dispatchEvent(new Event('scroll'));
      }
    }
  }, [isDragging, totalItems]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onDragStart(e.pageX);
  }, [onDragStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    onDragStart(e.touches[0].clientX);
  }, [onDragStart]);
  
  // Listeners globais para mousemove e mouseup
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => onDragMove(e.pageX);
    const handleGlobalMouseUp = () => onDragEnd();
    const handleGlobalTouchMove = (e: TouchEvent) => {
        if (isDragging) onDragMove(e.touches[0].clientX);
    };
    const handleGlobalTouchEnd = () => onDragEnd();


    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false }); // passive:false para e.preventDefault() se necessário
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, onDragMove, onDragEnd]);
  
  const handleScroll = useCallback(() => {
    if (!carouselRef.current || isDragging || totalItems === 0) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / extendedProducts.length;
    const scrollLeft = container.scrollLeft;
    
    let currentPhysicalIndex = Math.round(scrollLeft / itemWidth);
    let logicalIndex = currentPhysicalIndex % totalItems;

    setCurrentIndex(logicalIndex);

    // Lógica de reposicionamento para scroll infinito
    // Tolerância para evitar saltos desnecessários durante o snap
    const tolerance = itemWidth / 2; 

    if (scrollLeft < (totalItems * itemWidth) - tolerance && scrollLeft > 0) { // Perto do início lógico
        // Se estivermos muito perto do "início" do array estendido (primeiro conjunto de clones)
        if (currentPhysicalIndex < totalItems && (container.scrollLeft <= (totalItems -1) * itemWidth + tolerance) ) {
            const newPhysicalIndex = currentPhysicalIndex + totalItems;
             if (Math.abs(container.scrollLeft - (currentPhysicalIndex * itemWidth)) < tolerance) { // Só teleporta se estiver "estável" no clone
                scrollToIndex(newPhysicalIndex, false);
             }
        }
    } else if (scrollLeft > (totalItems * 2 * itemWidth) - tolerance) { // Perto do fim lógico
        // Se estivermos muito perto do "fim" do array estendido (último conjunto de clones)
         if (currentPhysicalIndex >= totalItems * 2 && (container.scrollLeft >= (totalItems * 2) * itemWidth - tolerance)) {
            const newPhysicalIndex = currentPhysicalIndex - totalItems;
             if (Math.abs(container.scrollLeft - (currentPhysicalIndex * itemWidth)) < tolerance) {
                scrollToIndex(newPhysicalIndex, false);
             }
        }
    }
  }, [isDragging, totalItems, extendedProducts.length, scrollToIndex]);

  useAutoScroll(isUserInteracting, totalItems, currentIndex, scrollToIndex, setCurrentIndex);

  useEffect(() => {
    if (carouselRef.current && totalItems > 0) {
      const initialLogicalIndex = 0;
      const initialPhysicalIndex = initialLogicalIndex + totalItems;
      setCurrentIndex(initialLogicalIndex);
      setTimeout(() => {
         if (carouselRef.current) {
            scrollToIndex(initialPhysicalIndex, false);
         }
      }, 0); // Reduzido o delay, pode ser 0 ou um valor pequeno como 10.
    }
  }, [totalItems, scrollToIndex]); // Removido setCurrentIndex se ele não deve resetar o currentIndex aqui

  return {
    carouselRef,
    currentIndex,
    setCurrentIndex,
    isMobile,
    extendedProducts,
    totalItems,
    scrollToIndex,
    handleScroll,
    handleMouseDown, 
    handleTouchStart,
    // Não precisa mais expor onTouchMove e onTouchEnd pois são globais
    isDragging // Expor para debug ou classes CSS se necessário
  };
};