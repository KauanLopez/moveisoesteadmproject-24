
import React from 'react';

interface Product {
  id: string;
  title: string;
  image: string;
}

interface NavigationDotsProps {
  products: Product[];
  currentIndex: number;
  totalItems: number;
  onDotClick: (index: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({
  products,
  currentIndex,
  totalItems,
  onDotClick
}) => {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {products.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentIndex === index 
              ? 'bg-primary scale-125' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Ir para produto ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default NavigationDots;
