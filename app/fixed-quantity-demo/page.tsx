"use client"

import React, { useState } from 'react';
import FixedQuantitySelector from '@/components/fixed-quantity-selector';

export default function FixedQuantityDemoPage() {
  const [quantities, setQuantities] = useState({
    product1: 1,
    product2: 2,
    product3: 1
  });

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const products = [
    { id: 'product1', name: 'Smartphone', stock: 5, price: 699 },
    { id: 'product2', name: 'Laptop', stock: 3, price: 1299 },
    { id: 'product3', name: 'Headphones', stock: 10, price: 199 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-12">Fixed Quantity Selector Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-blue-600 font-medium mb-4">${product.price}</p>
              
              <div className="mb-4">
                <FixedQuantitySelector
                  availableQuantity={product.stock}
                  initialQuantity={quantities[product.id as keyof typeof quantities]}
                  onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                />
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                Current quantity: {quantities[product.id as keyof typeof quantities]}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Test</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Click the "+" button to increase quantity (up to available stock)</li>
            <li>Click the "-" button to decrease quantity (down to 1)</li>
            <li>Type numbers directly in the input field</li>
            <li>Try exceeding the stock limit - the value should clamp automatically</li>
            <li>Try setting values below 1 - the value should clamp to 1</li>
            <li>Each product should work independently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}