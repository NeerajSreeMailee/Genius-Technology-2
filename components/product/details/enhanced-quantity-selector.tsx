import React, { useState } from 'react';

interface EnhancedQuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

const EnhancedQuantitySelector: React.FC<EnhancedQuantitySelectorProps> = ({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, minQuantity), maxQuantity);
      setQuantity(clampedValue);
      onQuantityChange?.(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure we have a valid value when user leaves the input
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
      onQuantityChange?.(minQuantity);
    } else if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
      onQuantityChange?.(maxQuantity);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
        className="px-3 py-1 text-lg font-bold border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        min={minQuantity}
        max={maxQuantity}
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="w-16 py-1 text-center border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        className="px-3 py-1 text-lg font-bold border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default EnhancedQuantitySelector;