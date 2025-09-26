"use client"

import React, { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function TestUnlimitedCartPage() {
  const { addToCart, items, updateQuantity, removeItem } = useCart();
  const [productId, setProductId] = useState('test-product-1');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(299);

  const handleAddToCart = () => {
    addToCart(productId, quantity, price);
    alert(`Added ${quantity} items to cart!`);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Unlimited Cart Quantities</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Items to Cart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product ID</label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 1)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>
          <Button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-600">
            Add to Cart
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cart Items ({items.length})</h2>
          {items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">ID: {item.productId}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 p-2 border rounded"
                      min="1"
                    />
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                    <Button 
                      onClick={() => removeItem(item.productId)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}