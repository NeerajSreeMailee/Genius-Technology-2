import React, { useState } from 'react';
import StockAwareQuantitySelector from './stock-aware-quantity-selector';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  availableQuantity: number;
  imageUrl: string;
  brand: string;
  category: string;
}

const ProductPageExample: React.FC = () => {
  // Sample product data
  const product: Product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    price: 199.99,
    originalPrice: 249.99,
    availableQuantity: 15,
    imageUrl: '/placeholder-headphones.jpg',
    brand: 'AudioTech',
    category: 'Electronics'
  };

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = () => {
    if (selectedQuantity > product.availableQuantity) {
      alert(`Only ${product.availableQuantity} items available in stock`);
      return;
    }
    
    alert(`Added ${selectedQuantity} x ${product.name} to cart!`);
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    alert(`${product.name} ${!isInWishlist ? 'added to' : 'removed from'} wishlist!`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-96 object-contain"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-blue-600 font-medium">{product.category}</span>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-2">by {product.brand}</p>
          </div>
          
          {/* Pricing */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Quantity</h3>
            <StockAwareQuantitySelector
              availableQuantity={product.availableQuantity}
              onQuantityChange={setSelectedQuantity}
              className="text-lg"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.availableQuantity === 0}
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                product.availableQuantity === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className={`py-3 px-6 rounded-lg font-medium transition-colors border ${
                isInWishlist
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          
          {/* Stock Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${product.availableQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>
                {product.availableQuantity > 0 
                  ? `${product.availableQuantity} items in stock` 
                  : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageExample;