import { useEffect, useRef } from 'react';

export const useAutoScroll = (
  isUserInteracting: boolean,
  totalItems: number,
  currentLogicalIndex: number,
  snapToItem: (logicalIndex: number, smooth?: boolean) => void
) => {
  const autoScrollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isUserInteracting || totalItems === 0) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      return () => { 
          if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
          }
      };
    }

    autoScrollRef.current = setInterval(() => {
      const nextLogicalIndex = (currentLogicalIndex + 1) % totalItems;
      snapToItem(nextLogicalIndex, true); // Usa snapToItem para centralizar
    }, 3000); // Intervalo do auto-scroll

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isUserInteracting, totalItems, currentLogicalIndex, snapToItem]);

  // Não é estritamente necessário retornar o ref se ele não for usado externamente
  // return autoScrollRef; 
};