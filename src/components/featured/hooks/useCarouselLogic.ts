
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
    if (totalItems > 0) {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        const currentCarouselRef = carouselRef.current;
        let observer: ResizeObserver | null = null;
        if (currentCarouselRef) {
            observer = new ResizeObserver(updateDimensions);
            observer.observe(currentCarouselRef);
        }
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (currentCarouselRef && observer) {
                observer.unobserve(currentCarouselRef);
            }
            if (scrollEndTimeoutRef.current) {
                clearTimeout(scrollEndTimeoutRef.current);
            }
        };
    }
  }, [updateDimensions, totalItems]);

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 7000); 
  }, []);
  
  const calculateScrollLeftForCenter = useCallback((physicalIndex: number) => {
    if (itemWidthRef.current === 0 || containerWidthRef.current === 0) return 0;
    const itemCenterOffset = (physicalIndex * itemWidthRef.current) + (itemWidthRef.current / 2);
    const containerCenterOffset = containerWidthRef.current / 2;
    return itemCenterOffset - containerCenterOffset;
  }, []);

  const snapToItem = useCallback((logicalIndexToSnap: number, smooth = true) => {
    if (!carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) return;
    
    const newLogicalIndex = (logicalIndexToSnap % totalItems + totalItems) % totalItems;

    isProgrammaticScrollRef.current = true;
    const targetPhysicalIndex = newLogicalIndex + totalItems;
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);

    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    // Atualiza o currentIndex APENAS se realmente mudou para evitar re-renders desnecessários
    // que poderiam interferir com outras lógicas que dependem de um currentIndex estável.
    if (currentIndex !== newLogicalIndex) {
        setCurrentIndex(newLogicalIndex);
    }
    
    const timeoutDuration = smooth ? 400 : 50; 
    setTimeout(() => { isProgrammaticScrollRef.current = false; }, timeoutDuration);

  }, [totalItems, calculateScrollLeftForCenter, currentIndex /* Adicionado currentIndex aqui */ ]);

  const onDragStart = useCallback((clientX: number, event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (event?.type === 'mousedown') {
        (event as React.MouseEvent<HTMLDivElement>).preventDefault();
    }
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) return;
    
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    isProgrammaticScrollRef.current = true; 

    handleUserInteraction();
    setIsDragging(true);
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const x = clientX;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = initialScrollLeft - walk;
  }, [isDragging, startX, initialScrollLeft]);

  const onDragEnd = useCallback(() => {
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) {
      if (isDragging) setIsDragging(false);
      if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
      isProgrammaticScrollRef.current = false;
      return;
    }
    if (!isDragging) return;

    const finalScrollLeft = carouselRef.current.scrollLeft;
    const scrollDelta = finalScrollLeft - initialScrollLeft; 
    
    setIsDragging(false);
    if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = 'smooth';
        carouselRef.current.style.cursor = 'grab';
    }

    let logicalIndexToSnap = currentIndex; 
    const itemW = itemWidthRef.current;
    const dragThreshold = itemW * 0.45; // Threshold de 45% da largura do item

    // scrollDelta > 0 significa que o conteúdo moveu para a direita (arraste do mouse/dedo para a esquerda -> ver PRÓXIMO item)
    // scrollDelta < 0 significa que o conteúdo moveu para a esquerda (arraste do mouse/dedo para a direita -> ver item ANTERIOR)

    if (scrollDelta > dragThreshold) { // Arrastou o suficiente para a esquerda (para ver próximo)
      logicalIndexToSnap = currentIndex + 1;
    } else if (scrollDelta < -dragThreshold) { // Arrastou o suficiente para a direita (para ver anterior)
      logicalIndexToSnap = currentIndex - 1;
    }
    // Se não atingiu o threshold, logicalIndexToSnap permanece o currentIndex, e o snapToItem o recentralizará.

    snapToItem(logicalIndexToSnap, true);

  }, [isDragging, totalItems, snapToItem, itemWidthRef, initialScrollLeft, currentIndex, containerWidthRef]);


  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => { if(isDragging) onDragMove(e.pageX); };
    const handleGlobalMouseUp = () => { if(isDragging) onDragEnd(); };
    const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragging) onDragMove(e.touches[0].clientX); };
    const handleGlobalTouchEnd = () => { if(isDragging) onDragEnd(); };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, onDragMove, onDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => onDragStart(e.pageX, e), [onDragStart]);
  const handleTouchStartCallback = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    onDragStart(e.touches[0].clientX, e);
  }, [onDragStart]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current || isDragging || !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;
    const oneSetWidth = totalItems * itemWidthRef.current;

    // Lógica de teletransporte para scroll infinito
    // Esses thresholds precisam ser cuidadosamente ajustados.
    // A ideia é teleportar quando o scroll estiver bem dentro da zona de clone.
    if (!isDragging) { 
        const physicalIndexAtScrollStart = currentScroll / itemWidthRef.current;

        // Se o início do carrossel visível está no primeiro terço do primeiro conjunto de clones (buffer da esquerda)
        if (physicalIndexAtScrollStart < totalItems - (totalItems * 0.75) && currentScroll > itemWidthRef.current * 0.1) { 
            isProgrammaticScrollRef.current = true;
            container.scrollLeft += oneSetWidth;
            setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
            return; 
        // Se o início do carrossel visível está no último terço do último conjunto de clones (buffer da direita)
        } else if (physicalIndexAtScrollStart > (totalItems * 2) - (totalItems * 0.25) ) { 
            isProgrammaticScrollRef.current = true;
            container.scrollLeft -= oneSetWidth;
            setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
            return;
        }
    }
    
    // Atualização do currentIndex baseado no que está centralizado (apenas se não estiver arrastando)
    if (!isDragging) {
        const centerOfViewport = currentScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) -1;
        let newLogicalIndex = physicalIndexAtCenter % totalItems;
        if (newLogicalIndex < 0) newLogicalIndex += totalItems;
        
        if (currentIndex !== newLogicalIndex) {
             // Não atualize o estado aqui diretamente se o scrollEndTimeout for cuidar disso.
             // Se precisar para os dots, pode ser necessário, mas com cuidado para não causar loops.
        }
    }

    // Debounce para o snap magnético após scroll manual (roda do mouse, scrollbar etc.)
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!isDragging && !isProgrammaticScrollRef.current && carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) -1;
        
        let finalLogicalIndex = physicalIndexAtCenter % totalItems;
        if (finalLogicalIndex < 0) finalLogicalIndex += totalItems;
        
        snapToItem(finalLogicalIndex, true);
      }
    }, 200); // Tempo de debounce ajustado (200-250ms é comum)

  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProducts.length, snapToItem, currentIndex]);

  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  useEffect(() => {
    if (totalItems > 0 && carouselRef.current) {
        const initSetup = () => {
            updateDimensions(); 
            if (itemWidthRef.current > 0) { 
                snapToItem(0, false); 
            } else {
                setTimeout(initSetup, 150); // Tenta novamente se dimensões não estiverem prontas
            }
        };
        const initTimeout = setTimeout(initSetup, 150); 
        return () => clearTimeout(initTimeout);
    }
  }, [totalItems, snapToItem, updateDimensions]);

  return {
    carouselRef,
    currentIndex,
    isMobile,
    extendedProducts,
    totalItems,
    snapToItem,
    handleScroll,
    handleMouseDown,
    handleTouchStart: handleTouchStartCallback,
    isDragging,
  };
};
