
import { useState, useRef, useCallback } from 'react';

export const useUserInteraction = () => {
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout>();
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000);
  }, []);

  return {
    isUserInteracting,
    handleUserInteraction
  };
};
