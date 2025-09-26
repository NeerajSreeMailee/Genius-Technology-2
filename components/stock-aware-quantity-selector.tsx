import React, { useState } from 'react';

interface StockAwareQuantitySelectorProps {
  initialQuantity?: number;
  availableQuantity: number;
  minQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

const StockAwareQuantitySelector: React.FC<StockAwareQuantitySelectorProps> = ({
  initialQuantity = 1,
  availableQuantity,
  minQuantity = 1,
  onQuantityChange,
  className = ''
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  // Ensure initial quantity respects bounds
  React.useEffect(() => {
    const clampedQuantity = Math.min(Math.max(initialQuantity, minQuantity), availableQuantity);
    setQuantity(clampedQuantity);
    onQuantityChange?.(clampedQuantity);
  }, [initialQuantity, minQuantity, availableQuantity, onQuantityChange]);

  const handleIncrease = () => {
    if (quantity < availableQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      // Clamp value between min and available quantity
      const clampedValue = Math.min(Math.max(value, minQuantity), availableQuantity);
      setQuantity(clampedValue);
      onQuantityChange?.(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure we have a valid value when user leaves the input
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
      onQuantityChange?.(minQuantity);
    } else if (quantity > availableQuantity) {
      setQuantity(availableQuantity);
      onQuantityChange?.(availableQuantity);
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
        max={availableQuantity}
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="w-16 py-1 text-center border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= availableQuantity}
        className="px-3 py-1 text-lg font-bold border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
      <div className="ml-2 text-sm text-gray-600">
        ({availableQuantity} in stock)
      </div>
    </div>
  );
};

export default StockAwareQuantitySelector;