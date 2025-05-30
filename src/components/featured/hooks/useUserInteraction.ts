
import { useRef, useState, useCallback } from 'react';

export const useUserInteraction = () => {
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000); // Resume auto-scroll after 5 seconds of no interaction
  }, []);

  const handleTouchStart = useCallback(() => {
    handleUserInteraction();
  }, [handleUserInteraction]);

  const handleMouseDown = useCallback(() => {
    handleUserInteraction();
  }, [handleUserInteraction]);

  return {
    isUserInteracting,
    handleUserInteraction,
    handleTouchStart,
    handleMouseDown
  };
};
