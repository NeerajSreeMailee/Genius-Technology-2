"use client"

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TestProductLayoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Product Layout</h1>
        <p className="mb-6">
          This page tests the product page layout with the "Complete Product Information" section moved to the bottom.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Testing Steps:</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to any product page</li>
            <li>Verify that the main product details are displayed in the center/right area</li>
            <li>Scroll to the bottom of the page</li>
            <li>Verify that the "Complete Product Information" section is at the bottom</li>
          </ol>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/products" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}