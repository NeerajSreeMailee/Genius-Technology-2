import React from 'react';
import EnhancedQuantitySelector from './enhanced-quantity-selector';

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    category?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    stock: number;
    inWishlist?: boolean;
  };
  onAddToCart: (productId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
}

const CenteredProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onAddToCart,
  onToggleWishlist
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    // Handle quantity change if needed
    console.log('Quantity changed to:', newQuantity);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return product.discount || 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        {/* Product Title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        
        {/* Brand */}
        {product.brand && (
          <p className="text-lg text-gray-700 font-semibold mt-2">
            Brand: <span className="text-orange-600">{product.brand}</span>
          </p>
        )}
        
        {/* Model / SKU */}
        {product.model && (
          <p className="text-sm text-gray-600 mt-1">
            Model: {product.model}
          </p>
        )}
        
        {/* Category */}
        {product.category && (
          <p className="text-sm text-gray-600 mt-1">
            Category: {product.category}
          </p>
        )}
        
        {/* Price */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <span className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full">
                {discount}% Off
              </span>
            </>
          )}
        </div>
        
        {/* Quantity Selector */}
        <div className="my-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity:</span>
            <EnhancedQuantitySelector
              initialQuantity={1}
              maxQuantity={product.stock}
              onQuantityChange={handleQuantityChange}
            />
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of stock
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button 
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onAddToCart(product.id, 1)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
          <button 
            onClick={() => onToggleWishlist(product.id)}
            className={`py-3 px-4 rounded-lg transition-all duration-300 border ${
              product.inWishlist 
                ? "bg-red-50 border-red-300 text-red-500" 
                : "border-orange-300 hover:bg-orange-50"
            }`}
          >
            {product.inWishlist ? "In Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CenteredProductDetails;