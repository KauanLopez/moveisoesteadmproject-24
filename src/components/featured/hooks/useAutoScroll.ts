import { useEffect, useRef } from 'react';

export const useAutoScroll = (
  isUserInteracting: boolean,
  totalItems: number,
  currentLogicalIndex: number, // Recebe o índice lógico atual
  scrollToIndex: (physicalIndex: number, smooth?: boolean) => void,
  setCurrentLogicalIndex: (updater: (prevLogicalIndex: number) => number) => void
) => {
  const autoScrollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isUserInteracting || totalItems === 0) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      return;
    }

    autoScrollRef.current = setInterval(() => {
      // Calcula o próximo índice lógico
      const nextLogicalIndex = (currentLogicalIndex + 1) % totalItems;
      // Calcula o índice físico correspondente no conjunto do meio
      const targetPhysicalIndex = totalItems + nextLogicalIndex; 

      scrollToIndex(targetPhysicalIndex, true); // Scroll suave para o próximo item
      setCurrentLogicalIndex(() => nextLogicalIndex); // Atualiza o índice lógico

    }, 3000); // Intervalo de auto-scroll

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isUserInteracting, totalItems, currentLogicalIndex, scrollToIndex, setCurrentLogicalIndex]); // Adicionado currentLogicalIndex e setCurrentLogicalIndex

  return autoScrollRef;
};