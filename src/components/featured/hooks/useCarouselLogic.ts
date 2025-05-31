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
  
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialSnapDoneRef = useRef(false);

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
    setIsUserInteracting(true); // Sinaliza interação, pausando auto-scroll
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false); // Permite que auto-scroll retome APÓS o timeout
    }, 7000); // Tempo para auto-scroll retomar
  }, []);
  
  const calculateScrollLeftForCenter = useCallback((physicalIndex: number) => {
    if (itemWidthRef.current === 0 || containerWidthRef.current === 0) return 0;
    const itemCenterOffset = (physicalIndex * itemWidthRef.current) + (itemWidthRef.current / 2);
    const containerCenterOffset = containerWidthRef.current / 2;
    return itemCenterOffset - containerCenterOffset;
  }, []);

  const snapToItem = useCallback((logicalIndexToSnap: number, smooth = true) => {
    if (!carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
        if (isProgrammaticScrollRef.current) isProgrammaticScrollRef.current = false;
        return;
    }
    
    const newLogicalIndex = (logicalIndexToSnap % totalItems + totalItems) % totalItems;

    isProgrammaticScrollRef.current = true; 
    const targetPhysicalIndex = newLogicalIndex + totalItems;
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);
    
    const currentScroll = carouselRef.current.scrollLeft;
    if (Math.abs(currentScroll - targetScrollLeft) < 2 && currentIndex === newLogicalIndex && smooth) {
        // Já está muito perto e o índice lógico é o mesmo, apenas reseta a flag.
        // Isso ajuda a evitar que o `handleScroll` seja acionado desnecessariamente por este "pequeno ajuste".
        // O `setCurrentIndex` abaixo ainda pode ser chamado se `currentIndex !== newLogicalIndex`
        // (o que não seria o caso aqui, mas a estrutura geral da função permite isso).
        // A principal intenção aqui é evitar o `scrollTo` se já estiver posicionado.
        // Se o índice mudou, mas o scroll não (caso raro), o setCurrentIndex abaixo resolve.
        // Se o índice não mudou e o scroll está ok, não faz nada.
        // Se o índice não mudou, mas o scroll está um pouco fora, o scrollTo abaixo corrige.
        // Se o índice mudou, o scrollTo abaixo corrige e o setCurrentIndex atualiza.
        if (currentIndex !== newLogicalIndex) {
            setCurrentIndex(newLogicalIndex);
        }
        // Mesmo que não role, o timeout para resetar isProgrammaticScrollRef é importante
        const noScrollTimeoutDuration = 50;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, noScrollTimeoutDuration);
        return;
    }
    
    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    // Atualiza o currentIndex para refletir o item que está sendo centralizado.
    // Esta é a principal fonte de verdade para o currentIndex.
    if (currentIndex !== newLogicalIndex) {
        setCurrentIndex(newLogicalIndex);
    }
    
    const timeoutDuration = smooth ? 500 : 70; 
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current); 
    setTimeout(() => { 
      isProgrammaticScrollRef.current = false; 
    }, timeoutDuration);

  }, [totalItems, calculateScrollLeftForCenter, currentIndex]);

  const onDragStart = useCallback((clientX: number, event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (event?.type === 'mousedown') {
        (event as React.MouseEvent<HTMLDivElement>).preventDefault();
    }
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current) return;
    
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    isProgrammaticScrollRef.current = true; 

    handleUserInteraction();
    setIsDragging(true); // Importante: Definir isDragging como true AQUI
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto';
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems]);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return; // Verifica se isDragging é true
    const x = clientX;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = initialScrollLeft - walk;
  }, [isDragging, startX, initialScrollLeft]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current || totalItems === 0 || !itemWidthRef.current) { // Verifica se isDragging era true
      if (isDragging) setIsDragging(false); // Garante que resetamos mesmo se sairmos cedo
      if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
      // Não resetar isProgrammaticScrollRef aqui diretamente, snapToItem cuidará disso.
      return;
    }

    const finalScrollLeft = carouselRef.current.scrollLeft;
    
    // setIsDragging(false) é crucial e deve ser feito antes de qualquer lógica de snap
    // para que o handleScroll não seja mais bloqueado por isDragging.
    // No entanto, queremos que o snap do onDragEnd tenha prioridade.
    // isProgrammaticScrollRef já está true desde onDragStart. snapToItem manterá ou resetará.
    
    if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = 'smooth';
        carouselRef.current.style.cursor = 'grab';
    }

    const centerOfViewport = finalScrollLeft + containerWidthRef.current / 2;
    const physicalIndexWhoseSlotContainsCenter = Math.floor(centerOfViewport / itemWidthRef.current);
    let logicalIndexToSnap = (physicalIndexWhoseSlotContainsCenter % totalItems + totalItems) % totalItems;
    
    snapToItem(logicalIndexToSnap, true);
    setIsDragging(false); // Resetar isDragging DEPOIS de chamar snapToItem, que define isProgrammaticScroll

  }, [isDragging, totalItems, snapToItem, itemWidthRef, containerWidthRef]); // Removido initialScrollLeft, currentIndex


  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => { if(isDragging) onDragMove(e.pageX); };
    // CRUCIAL: onDragEnd só deve ser chamado se isDragging era true.
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
    if (isProgrammaticScrollRef.current || !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;
    const oneSetWidth = totalItems * itemWidthRef.current;

    if (!isDragging) { // Não faz teletransporte ou snap de scroll manual se um arraste acabou de acontecer
        const physicalIndexAtScrollStart = currentScroll / itemWidthRef.current;
        const safeThresholdStart = totalItems * 0.20; // Ex: Se entrou 20% no buffer da esquerda
        const safeThresholdEnd = totalItems * 2 - (totalItems * 0.20); // Ex: Se faltam 20% para sair do buffer da direita
        
        if (physicalIndexAtScrollStart < safeThresholdStart && currentScroll > itemWidthRef.current * 0.05) { 
            isProgrammaticScrollRef.current = true;
            container.scrollLeft += oneSetWidth;
            setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
            return; 
        } else if (physicalIndexAtScrollStart > safeThresholdEnd && physicalIndexAtScrollStart < extendedProducts.length -1 ) { 
            isProgrammaticScrollRef.current = true;
            container.scrollLeft -= oneSetWidth;
            setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
            return;
        }
    }
    
    // Atualiza o currentIndex para os dots e auto-scroll, se não for um scroll programático e não estiver arrastando
    if (!isDragging && !isProgrammaticScrollRef.current) {
        const centerOfViewport = currentScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) -1;
        let newLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        
        if (currentIndex !== newLogicalIndex) {
             setCurrentIndex(newLogicalIndex);
        }
    }

    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!isDragging && !isProgrammaticScrollRef.current && carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.round(centerOfViewport / itemWidthRef.current) -1;
        let finalLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        snapToItem(finalLogicalIndex, true);
      }
    }, 300); // Aumentado o debounce para dar mais tempo para o scroll "assentar"

  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProducts.length, snapToItem, currentIndex]);

  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  useEffect(() => {
    if (!initialSnapDoneRef.current && totalItems > 0 && carouselRef.current) {
        const initSetup = () => {
            updateDimensions(); 
            if (itemWidthRef.current > 0) { 
                snapToItem(0, false); 
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