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
  
  // Flag para indicar que um scroll programático (snap, teleporte) está em andamento.
  // Isso ajuda a handleScroll a não interferir.
  const isProgrammaticScrollRef = useRef(false);
  // Timeout para o debounce do snap no handleScroll
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Flag para controlar o snap inicial
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
            if (userInteractionTimeoutRef.current) { // Limpa o timeout de interação também
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
    }, 2000); // Delay de 2 segundos para reiniciar auto-scroll após interação
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
    const targetPhysicalIndex = newLogicalIndex + totalItems; // Sempre mira o conjunto do meio
    const targetScrollLeft = calculateScrollLeftForCenter(targetPhysicalIndex);
    
    const currentScroll = carouselRef.current.scrollLeft;
    // Evita scrollTo se já estiver muito próximo E o índice lógico já for o alvo (para scrolls suaves)
    if (smooth && Math.abs(currentScroll - targetScrollLeft) < 2 && currentIndex === newLogicalIndex) {
        // Se o índice mudou, mas o scroll não precisa, atualiza o índice
        if (currentIndex !== newLogicalIndex) setCurrentIndex(newLogicalIndex);
        // Mesmo assim, é um scroll "programático" no sentido de que foi uma decisão lógica,
        // então resetamos a flag após um curto delay.
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
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
    // Limpa qualquer snap pendente do handleScroll ANTES de iniciar um novo timer para resetar a flag
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current); 
    setTimeout(() => { 
      isProgrammaticScrollRef.current = false; 
    }, timeoutDuration);

  }, [totalItems, calculateScrollLeftForCenter, currentIndex]);

  const onDragStart = useCallback((clientX: number, event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (event?.type === 'mousedown') {
        (event as React.MouseEvent<HTMLDivElement>).preventDefault();
    }
    if (!carouselRef.current || totalItems === 0 || !itemWidthRef.current || isDragging) return; // Impede novo drag se já estiver arrastando
    
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current); // Cancela snap pendente do handleScroll
    isProgrammaticScrollRef.current = true; // Indica que o scroll inicial do drag é "controlado"

    handleUserInteraction(); // Pausa/reseta timer do auto-scroll
    setIsDragging(true); 
    setStartX(clientX);
    setInitialScrollLeft(carouselRef.current.scrollLeft);
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto'; // Drag precisa de update instantâneo
      carouselRef.current.style.cursor = 'grabbing';
    }
  }, [handleUserInteraction, totalItems, isDragging]); // Adicionado isDragging à dependência

  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const x = clientX;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = initialScrollLeft - walk;
  }, [isDragging, startX, initialScrollLeft]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current || totalItems === 0 || !itemWidthRef.current) {
      // Se não estava realmente arrastando, mas por algum motivo onDragEnd foi chamado,
      // garante que isDragging seja false e o cursor restaurado.
      if (carouselRef.current) carouselRef.current.style.cursor = 'grab';
      setIsDragging(false); // Garante o reset
      isProgrammaticScrollRef.current = false; // Reseta se saiu cedo e onDragStart setou para true
      return;
    }

    const finalScrollLeft = carouselRef.current.scrollLeft;
    
    // Importante: setIsDragging(false) é chamado DEPOIS do snapToItem ser chamado.
    // O snapToItem em si gerencia isProgrammaticScrollRef.
    
    if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = 'smooth';
        carouselRef.current.style.cursor = 'grab';
    }

    const centerOfViewport = finalScrollLeft + containerWidthRef.current / 2;
    const physicalIndexWhoseSlotContainsCenter = Math.floor(centerOfViewport / itemWidthRef.current);
    let logicalIndexToSnap = (physicalIndexWhoseSlotContainsCenter % totalItems + totalItems) % totalItems;
    
    snapToItem(logicalIndexToSnap, true);
    setIsDragging(false); // Resetar isDragging DEPOIS de iniciar o snap

  }, [isDragging, totalItems, snapToItem, itemWidthRef, containerWidthRef]); // initialScrollLeft e currentIndex não são mais necessários aqui para a decisão


  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => { if(isDragging) onDragMove(e.pageX); };
    const handleGlobalMouseUp = () => { 
        if(isDragging) { // Só chama onDragEnd se um arraste estava em progresso
            onDragEnd(); 
        }
    }; 
    const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragging) onDragMove(e.touches[0].clientX); };
    const handleGlobalTouchEnd = () => { 
        if(isDragging) { // Só chama onDragEnd se um arraste estava em progresso
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
    if (isProgrammaticScrollRef.current || isDragging || !carouselRef.current || totalItems === 0 || itemWidthRef.current === 0) {
      return;
    }

    const container = carouselRef.current;
    const currentScroll = container.scrollLeft;
    const oneSetWidth = totalItems * itemWidthRef.current;

    // Lógica de teletransporte para scroll infinito
    const physicalIndexAtScrollStart = currentScroll / itemWidthRef.current;
    // Define um buffer para o teletransporte, ex: 10% da largura de um item
    const teleportBuffer = itemWidthRef.current * 0.1; 
    
    // Condição para teletransportar da esquerda para o meio
    // Se o scroll está no primeiro conjunto de clones e se moveu para além de um pequeno buffer inicial
    if (physicalIndexAtScrollStart < (totalItems - 0.85) && currentScroll > teleportBuffer) { 
        isProgrammaticScrollRef.current = true;
        container.scrollLeft += oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70); // Curto delay para o scroll "assentar"
        return; 
    // Condição para teletransportar da direita para o meio
    // Se o scroll está no terceiro conjunto de clones e se moveu para além de um pequeno buffer final
    } else if (physicalIndexAtScrollStart > (totalItems * 2 - 0.15) && physicalIndexAtScrollStart < extendedProducts.length - 0.05) { 
        isProgrammaticScrollRef.current = true;
        container.scrollLeft -= oneSetWidth;
        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 70);
        return;
    }
    
    // Atualiza o currentIndex apenas se não for um scroll programático e não estiver arrastando.
    // Isso mantém os dots e o auto-scroll sincronizados com a visualização durante scrolls manuais.
    if (!isProgrammaticScrollRef.current && !isDragging) {
        const centerOfViewport = currentScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.floor(centerOfViewport / itemWidthRef.current);
        let newLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        
        if (currentIndex !== newLogicalIndex) {
             setCurrentIndex(newLogicalIndex); // Atualiza o estado
        }
    }

    // Debounce para o snap magnético após scroll manual (roda do mouse, scrollbar etc.)
    // Só ativa se não estiver arrastando e não for um scroll programático.
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = setTimeout(() => {
      if (!isDragging && !isProgrammaticScrollRef.current && carouselRef.current && itemWidthRef.current > 0) {
        const finalScroll = carouselRef.current.scrollLeft;
        const centerOfViewport = finalScroll + containerWidthRef.current / 2;
        const physicalIndexAtCenter = Math.floor(centerOfViewport / itemWidthRef.current);
        let finalLogicalIndex = (physicalIndexAtCenter % totalItems + totalItems) % totalItems;
        
        snapToItem(finalLogicalIndex, true);
      }
    }, 250); // Reduzido debounce para resposta mais rápida

  }, [isDragging, totalItems, itemWidthRef, containerWidthRef, extendedProducts.length, snapToItem, currentIndex, calculateScrollLeftForCenter]);

  useAutoScroll(isUserInteracting, totalItems, currentIndex, snapToItem);

  useEffect(() => {
    if (!initialSnapDoneRef.current && totalItems > 0 && carouselRef.current) {
        const initSetup = () => {
            updateDimensions(); 
            if (itemWidthRef.current > 0) { 
                snapToItem(0, false); 
                initialSnapDoneRef.current = true;
            } else {
                setTimeout(initSetup, 200); // Aumentado o retry
            }
        };
        const initTimeout = setTimeout(initSetup, 250); // Aumentado o delay inicial
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