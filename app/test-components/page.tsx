"use client"

import React, { useState } from 'react';
import EnhancedQuantitySelector from '@/components/enhanced-quantity-selector';
import CenteredProductDetails from '@/components/centered-product-details';

export default function TestComponentsPage() {
  const [cart, setCart] = useState<{[key: string]: {quantity: number}}>({});
  const [wishlist, setWishlist] = useState<{[key: string]: boolean}>({});
  const [testQuantity, setTestQuantity] = useState(1);

  // Sample product data
  const product = {
    id: 'test-1',
    name: 'Test Product',
    brand: 'Test Brand',
    model: 'TP-2023',
    category: 'Electronics',
    price: 299,
    originalPrice: 399,
    stock: 10,
    inWishlist: wishlist['test-1'] || false
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

  const handleQuantityChange = (newQuantity: number) => {
    setTestQuantity(newQuantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Component Testing Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Quantity Selector Test */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Enhanced Quantity Selector</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Default Selector</h3>
                <EnhancedQuantitySelector />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Custom Selector</h3>
                <EnhancedQuantitySelector
                  initialQuantity={3}
                  minQuantity={1}
                  maxQuantity={5}
                  onQuantityChange={handleQuantityChange}
                />
                <p className="mt-2 text-sm text-gray-600">Current value: {testQuantity}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Low Stock Selector</h3>
                <EnhancedQuantitySelector
                  initialQuantity={1}
                  minQuantity={1}
                  maxQuantity={2}
                />
              </div>
            </div>
          </div>
          
          {/* Centered Product Details Test */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Centered Product Details</h2>
            <CenteredProductDetails
              product={{...product, inWishlist: wishlist[product.id] || false}}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>
        
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
}