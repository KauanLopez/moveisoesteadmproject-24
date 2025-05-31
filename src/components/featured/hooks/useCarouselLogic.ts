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

  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef<number>(0);
  const containerWidthRef = useRef<number>(0);
  
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  
  const isProgrammaticScrollRef = useRef(false); // Para snaps de auto-scroll, teleporte, dots
  const scrollEndDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialSnapDoneRef = useRef(false);
  const dragEndSnapInProgressRef = useRef(false); // Especificamente para o snap após onDragEnd

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
            if (scrollEndDebounceTimeoutRef.current) {
                clearTimeout(scrollEndDebounceTimeoutRef.current);
            }
            if (userInteractionTimeoutRef.current) {
                clearTimeout(userInteractionTimeoutRef.current);
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
    }, 5000); // 5 segundos de delay após interação
  }, []);
  
  const calculateScrollLeftForCenter = useCallback((physicalIndex: number) => {
    if (itemWidthRef.current === 0 || containerWidthRef.current === 0) return 0;
    const itemCenterOffset = (physicalIndex * itemWidthRef.current) + (itemWidthRef.current / 2);
    const containerCenterOffset = containerWidthRef.current / 2;
    return itemCenterOffset - containerCenterOffset;
  }, []);

  const snapToItem = useCallback((logicalIndexToSnap: number, smooth = true, isFromDragEnd = false) => {
    if (!carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
        // Garante que as flags sejam resetadas se sairmos cedo
        if (isFromDragEnd) dragEndSnapInProgressRef.current = false;
        else isProgrammaticScrollRef.current = false;
        return;
    }
    
    const newLogicalIndex = (logicalIndexToSnap % totalItems + totalItems) % totalItems;

    if (isFromDragEnd) {
        dragEndSnapInProgressRef.current = true;
    } else {
        isProgrammaticScrollRef.current = true; 
    }
    
    const targetPhysicalIndex = newLogicalIndex + totalItems;
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);
    
    const currentScroll = carouselRef.current.scrollLeft;
    // Evita scroll desnecessário se já estiver muito próximo E o índice lógico já for o alvo
    if (smooth && Math.abs(currentScroll - targetScrollLeft) < 2 && currentIndex === newLogicalIndex) {
        if (currentIndex !== newLogicalIndex) setCurrentIndex(newLogicalIndex); // Atualiza se necessário
        const resetDelay = 50;
        setTimeout(() => { 
            if (isFromDragEnd) dragEndSnapInProgressRef.current = false;
            else isProgrammaticScrollRef.current = false;
        }, resetDelay);
        return;
    }
    
    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    if (currentIndex !== newLogicalIndex) {
        setCurrentIndex(newLogicalIndex);
    }
    
    const timeoutDuration = smooth ? 500 : 70; 
    // Limpa o debounce do handleScroll APENAS se este snap NÃO for do handleScroll debounce
    // (se for de dragEnd ou autoScroll).
    // if (!isFromHandleScrollDebounce && scrollEndDebounceTimeoutRef.current) { // Precisaria de outra flag
    //     clearTimeout(scrollEndDebounceTimeoutRef.current);
    // }
    // A lógica de flags deve prevenir a execução do debounce do handleScroll.

    setTimeout(() => { 
      if (isFromDragEnd) dragEndSnapInProgressRef.current = false;
      else isProgrammaticScrollRef.current = false;
    }, timeoutDuration);

  }, [totalItems, calculateScrollLeftForCenter, currentIndex]);

  const onDragStart = useCallback((clientX: number, event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (event?.type === 'mousedown') {
        (event as React.MouseEvent<HTMLDivElement>).preventDefault();
    }
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current || isDragging) return;
    
    if (scrollEndDebounceTimeoutRef.current) clearTimeout(scrollEndDebounceTimeoutRef.current);
    
    // Sinaliza que uma sequência de scroll controlada está começando (o arraste em si)
    // Não usamos dragEndSnapInProgressRef aqui, pois isso é para o snap APÓS o drag.
    // isProgrammaticScrollRef pode ser usado para o "scroll" do arraste em si.
    isProgrammaticScrollRef.current = true; 
    dragEndSnapInProgressRef.current = false; // Garante que não haja snap de drag anterior pendente

    handleUserInteraction();
    setIsDragging(true); 
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems, isDragging]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const x = clientX;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = initialScrollLeft - walk;
  }, [isDragging, startX, initialScrollLeft]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current || totalItems === 0 || !itemWidthRef.current) {
      if (isDragging) setIsDragging(false); 
      if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
      // Se o drag não era válido, e onDragStart setou isProgrammaticScrollRef, precisa resetar.
      if(isProgrammaticScrollRef.current && !dragEndSnapInProgressRef.current) isProgrammaticScrollRef.current = false;
      return;
    }

    const finalScrollLeft = carouselRef.current.scrollLeft;
            
    if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = 'smooth';
        carouselRef.current.style.cursor = 'grab';
    }

    const centerOfViewport = finalScrollLeft + containerWidthRef.current / 2;
    const physicalIndexWhoseSlotContainsCenter = Math.floor(centerOfViewport / itemWidthRef.current);
    let logicalIndexToSnap = (physicalIndexWhoseSlotContainsCenter % totalItems + totalItems) % totalItems;
    
    // Importante: o arraste terminou. O snap que se segue é específico do dragEnd.
    setIsDragging(false); 
    snapToItem(logicalIndexToSnap, true, true); // true para isFromDragEnd
    
    handleUserInteraction(); 

  }, [isDragging, totalItems, snapToItem, itemWidthRef, containerWidthRef, handleUserInteraction]);


  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => { if(isDragging) onDragMove(e.pageX); };
    const handleGlobalMouseUp = () => { 
        if(isDragging) { 
            onDragEnd(); 
        }
    }; 
    const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragging) onDragMove(e.touches[0].clientX); };
    const handleGlobalTouchEnd = () => { 
        if(isDragging) { 
            onDragEnd(); 
        }
    };

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
    // Ignora se:
    // 1. Um snap específico do fim do arraste está em progresso.
    // 2. Outro scroll programático (teleporte, snap de auto-scroll/dots) está em progresso.
    // 3. O usuário está atualmente arrastando.
    if (dragEndSnapInProgressRef.current || isProgrammaticScrollRef.current || isDragging || 
        !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;
    const oneSetWidth = totalItems * itemWidthRef.current;

    // Lógica de teletransporte (APENAS para scrolls genuinamente manuais/não programáticos)
    const physicalIndexAtScrollStart = currentScroll / itemWidthRef.current;
    const teleportBuffer = itemWidthRef.current * 0.1; 
    
    if (physicalIndexAtScrollStart < (totalItems - 1 + teleportBuffer) && currentScroll > teleportBuffer * 0.5 ) { 
        isProgrammaticScrollRef.current = true; // Teleporte é programático
        container.scrollLeft += oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
        return; 
    } else if (physicalIndexAtScrollStart > (totalItems * 2 - teleportBuffer) && physicalIndexAtScrollStart < extendedProducts.length - 0.1) { 
        isProgrammaticScrollRef.current = true; // Teleporte é programático
        container.scrollLeft -= oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
        return;
    }
    
    // Atualiza o currentIndex para os dots e auto-scroll durante scroll manual livre
    if (!dragEndSnapInProgressRef.current && !isProgrammaticScrollRef.current && !isDragging) {
        const centerOfViewport = currentScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.floor(centerOfViewport / itemWidthRef.current);
        let newLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        
        if (currentIndex !== newLogicalIndex) {
             setCurrentIndex(newLogicalIndex);
        }
    }

    // Debounce para o snap magnético após scroll manual (roda do mouse, scrollbar etc.)
    if (scrollEndDebounceTimeoutRef.current) clearTimeout(scrollEndDebounceTimeoutRef.current);
    scrollEndDebounceTimeoutRef.current = setTimeout(() => {
      // Re-checa todas as flags no momento da execução do timeout
      if (!isDragging && !isProgrammaticScrollRef.current && !dragEndSnapInProgressRef.current && 
          carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.floor(centerOfViewport / itemWidthRef.current);
        let finalLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        
        snapToItem(finalLogicalIndex, true, false); // isFromDragEnd = false
      }
    }, 250); 

  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProducts.length, snapToItem, currentIndex, calculateScrollLeftForCenter]);

  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  useEffect(() => {
    if (!initialSnapDoneRef.current && totalItems > 0 && carouselRef.current) {
        const initSetup = () => {
            updateDimensions(); 
            if (itemWidthRef.current > 0) { 
                snapToItem(0, false, false); // isFromDragEnd = false
                initialSnapDoneRef.current = true;
            } else {
                setTimeout(initSetup, 150); 
            }
        };
        const initTimeout = setTimeout(initSetup, 200); 
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