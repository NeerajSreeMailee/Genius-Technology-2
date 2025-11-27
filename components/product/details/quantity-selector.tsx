import React, { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 10,
  onQuantityChange,
  className = ''
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    const newQuantity = Math.min(quantity + 1, maxQuantity);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(quantity - 1, minQuantity);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
        className="px-3 py-1 text-lg font-bold border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="px-4 py-1 border-y border-gray-300 text-center min-w-[3rem]">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        className="px-3 py-1 text-lg font-bold border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;