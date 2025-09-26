"use client"

import React, { useState } from 'react';
import FixedQuantitySelector from '@/components/fixed-quantity-selector';

export default function SimpleQuantityDemoPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Simple Quantity Selector Test</h1>
        
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-6">Test Quantity Selector</h2>
          
          <div className="flex justify-center mb-6">
            <FixedQuantitySelector
              availableQuantity={5}
              initialQuantity={1}
              onQuantityChange={setQuantity}
            />
          </div>
          
          <div className="text-lg">
            Current quantity: <span className="font-bold text-blue-600">{quantity}</span>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-left list-disc pl-6 space-y-1 text-gray-700">
              <li>Click "+" to increase quantity (try clicking multiple times)</li>
              <li>Click "-" to decrease quantity</li>
              <li>Try typing numbers directly in the input</li>
              <li>Notice how it prevents going above 5 (stock limit) or below 1</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}