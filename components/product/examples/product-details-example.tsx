import React, { useState } from 'react';
import CenteredProductDetails from './centered-product-details';

const ProductDetailsExample: React.FC = () => {
  const [cart, setCart] = useState<{[key: string]: {quantity: number}}>({});
  const [wishlist, setWishlist] = useState<{[key: string]: boolean}>({});

  // Sample product data
  const product = {
    id: '1',
    name: 'iPhone 13 Pro',
    brand: 'Apple',
    model: 'A2634',
    category: 'Smartphones',
    price: 999,
    originalPrice: 1199,
    stock: 15,
    inWishlist: wishlist['1'] || false
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: { quantity: (prevCart[productId]?.quantity || 0) + quantity }
    }));
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prevWishlist => ({
      ...prevWishlist,
      [productId]: !prevWishlist[productId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <CenteredProductDetails
          product={{...product, inWishlist: wishlist[product.id] || false}}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
        
        {/* Cart summary */}
        <div className="mt-12 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
          {Object.keys(cart).length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              {Object.entries(cart).map(([productId, item]) => (
                <div key={productId} className="flex justify-between py-2 border-b">
                  <span>Product {productId}</span>
                  <span>Quantity: {item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsExample;