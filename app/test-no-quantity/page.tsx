"use client"

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TestNoQuantityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test: No Quantity Selector</h1>
        <p className="mb-6">
          This page tests the removal of the quantity selector from product pages.
          The "Add to Cart" button should now add items directly without quantity selection.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Testing Steps:</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to any product page</li>
            <li>Verify that the quantity selector is no longer visible</li>
            <li>Click "Add to Cart" button</li>
            <li>Verify that the item is added to the cart</li>
            <li>Go to the cart page and verify you can adjust quantities there</li>
          </ol>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/products" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Browse Products
          </Link>
          <Link 
            href="/cart" 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}