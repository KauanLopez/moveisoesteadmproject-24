
import { useEffect, useState, useRef, useCallback } from 'react';
import { useMobileDetection } from './useMobileDetection';
import { useAutoScroll } from './useAutoScroll';

interface Product {
  id: string;
  title: string;
  image: string;
}

export const useCarouselLogic = (products: Product[]) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice lógico (0 a totalItems-1)
  const isMobile = useMobileDetection();
  
  const extendedProducts = products.length > 0 ? [...products, ...products, ...products] : [];
  const totalItems = products.length;

  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef<number>(0);
  const containerWidthRef = useRef<number>(0);
  
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  
  // Ref para controlar se um teletransporte/snap programático está em andamento
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateDimensions = useCallback(() => {
    if (carouselRef.current) {
      containerWidthRef.current = carouselRef.current.offsetWidth;
      if (carouselRef.current.firstElementChild && totalItems > 0) {
        itemWidthRef.current = (carouselRef.current.firstElementChild as HTMLElement).offsetWidth;
      } else {
        itemWidthRef.current = 0;
      }
    }
  }, [totalItems]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (carouselRef.current) {
        observer.observe(carouselRef.current);
    }
    return () => {
        window.removeEventListener('resize', updateDimensions);
        if (carouselRef.current) {
            observer.unobserve(carouselRef.current);
        }
    };
  }, [updateDimensions]);

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000); // Resume auto-scroll após 5 segundos
  }, []);
  
  const calculateScrollLeftForCenter = useCallback((physicalIndex: number) => {
    if (itemWidthRef.current === 0 || containerWidthRef.current === 0) return 0;
    // Calcula o scrollLeft para que o *centro* do item no physicalIndex fique no *centro* do container
    const itemCenter = (physicalIndex * itemWidthRef.current) + (itemWidthRef.current / 2);
    const containerCenter = containerWidthRef.current / 2;
    return itemCenter - containerCenter;
  }, []);

  const snapToItem = useCallback((logicalIndexToSnap: number, smooth = true) => {
    if (!carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) return;
    
    isProgrammaticScrollRef.current = true;
    const targetPhysicalIndex = logicalIndexToSnap + totalItems;
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);

    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    if (currentIndex !== logicalIndexToSnap) {
      setCurrentIndex(logicalIndexToSnap);
    }
    
    // Reset a flag após a animação de scroll ou um timeout curto para 'auto'
    if (smooth) {
        // Para scroll suave, podemos usar um timeout um pouco maior que a duração esperada do scroll
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 300); // Ajuste conforme a duração do 'smooth'
    } else {
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    }

  }, [totalItems, calculateScrollLeftForCenter, currentIndex ]);

  const onDragStart = useCallback((clientX: number) => {
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) return;
    handleUserInteraction();
    setIsDragging(true);
    isProgrammaticScrollRef.current = true; // Prevenir handleScroll durante o drag
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto'; // Drag precisa de update instantâneo
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    // Não usar requestAnimationFrame aqui para resposta mais direta ao arrastar
    // requestAnimationFrame(() => {
      if (!carouselRef.current || !isDragging) return;
      const x = clientX;
      const walk = (x - startX); 
      carouselRef.current.scrollLeft = initialScrollLeft - walk;
    // });
  }, [isDragging, startX, initialScrollLeft]);

  const onDragEnd = useCallback(() => {
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) {
        setIsDragging(false); // Garante que isDragging seja resetado
        return;
    }
    
    // Só continua se estava realmente arrastando
    if (!isDragging) return;

    setIsDragging(false);
    isProgrammaticScrollRef.current = false; // Permite que handleScroll faça o snap

    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      carouselRef.current.style.cursor = 'grab';

      const currentScroll = carouselRef.current.scrollLeft;
      const itemsPerContainer = containerWidthRef.current / itemWidthRef.current;
      
      // Calcula o índice do item que deveria estar centralizado
      // O índice é baseado na posição de início do item
      const scrollAmountPerItem = itemWidthRef.current;
      let closestPhysicalIndex = Math.round(currentScroll / scrollAmountPerItem);
      
      // Ajuste para centralizar: qual item está mais próximo do centro da viewport
      const centerViewportScroll = currentScroll + (containerWidthRef.current / 2);
      closestPhysicalIndex = Math.round(centerViewportScroll / itemWidthRef.current) -1;

      let logicalIndexToSnap = closestPhysicalIndex % totalItems;
      if (logicalIndexToSnap < 0) logicalIndexToSnap += totalItems;

      snapToItem(logicalIndexToSnap, true);
    }
  }, [isDragging, totalItems, snapToItem, itemWidthRef, containerWidthRef, initialScrollLeft]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => onDragMove(e.pageX);
    const handleGlobalMouseUp = () => onDragEnd();
    const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragging) onDragMove(e.touches[0].clientX); };
    const handleGlobalTouchEnd = () => onDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true }); // passive: true se não for chamar preventDefault
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, onDragMove, onDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => onDragStart(e.pageX), [onDragStart]);
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // e.preventDefault(); // Pode ser necessário para prevenir scroll nativo enquanto arrasta
    onDragStart(e.touches[0].clientX);
  }, [onDragStart]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current || isDragging || !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;

    // Lógica de teletransporte para scroll infinito (simplificada)
    const oneSetWidth = totalItems * itemWidthRef.current;
    // Verifica se estamos perto das bordas do buffer de clones
    if (currentScroll < itemWidthRef.current * 0.5 && totalItems > 0) { // Perto do "início" dos clones à esquerda
        isProgrammaticScrollRef.current = true;
        container.scrollLeft += oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    } else if (currentScroll > (extendedProducts.length - totalItems - 0.5) * itemWidthRef.current && totalItems > 0) { // Perto do "fim" dos clones à direita
        isProgrammaticScrollRef.current = true;
        container.scrollLeft -= oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
    }

    // Debounce para o snap magnético após scroll manual (roda do mouse, etc.)
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!isDragging && !isProgrammaticScrollRef.current && carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) - 1;
        
        let finalLogicalIndex = physicalIndexAtCenter % totalItems;
        if (finalLogicalIndex < 0) finalLogicalIndex += totalItems;
        
        snapToItem(finalLogicalIndex, true);
      }
    }, 150); // Tempo de debounce

  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProducts.length, snapToItem, calculateScrollLeftForCenter, currentIndex]);

  // Hook de auto-scroll
  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  // Efeito para inicialização e quando os produtos mudam
  useEffect(() => {
    if (totalItems > 0 && itemWidthRef.current > 0 && carouselRef.current) {
      // Atraso pequeno para garantir que as dimensões estão corretas após a renderização
      const initTimeout = setTimeout(() => {
        snapToItem(0, false); // Snap inicial para o primeiro item (lógico) sem animação
      }, 50);
      return () => clearTimeout(initTimeout);
    }
  }, [totalItems, snapToItem]); // Removido itemWidthRef.current da dependência para evitar loops se ele mudar frequentemente

  return {
    carouselRef,
    currentIndex,
    isMobile,
    extendedProducts,
    totalItems,
    snapToItem,
    handleScroll,
    handleMouseDown,
    handleTouchStart,
    isDragging
  };
};
