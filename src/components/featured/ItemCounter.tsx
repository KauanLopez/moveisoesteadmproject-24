
import React from 'react';

interface ItemCounterProps {
  currentIndex: number;
  totalItems: number;
}

const ItemCounter: React.FC<ItemCounterProps> = ({ currentIndex, totalItems }) => {
  return (
    <div className="text-center mt-2 text-sm text-gray-500">
      {currentIndex + 1} de {totalItems}
    </div>
  );
};

export default ItemCounter;
