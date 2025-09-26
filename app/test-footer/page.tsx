"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function TestFooterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Footer Menu Test Page</h1>
          <p className="mb-4">This page is for testing the footer menu behavior.</p>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Scroll down to view the footer</li>
              <li>On mobile view, click on any footer section header (ABOUT, CUSTOMER SERVICE, etc.) to open it</li>
              <li>Click on another section header to close the current one and open the new one</li>
              <li>Click the same header again to close it</li>
              <li>Navigate to another page to see all sections automatically close</li>
              <li>On desktop, sections remain visible but still follow the single-open-menu behavior</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
            <p className="mb-4">The footer now implements the same menu behavior as the header:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Only one section can be open at a time</li>
              <li>Clicking a section header toggles its visibility</li>
              <li>All sections automatically close when navigating to a new page</li>
              <li>Smooth animations for opening/closing sections</li>
              <li>Mobile-friendly toggle behavior with desktop persistence</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}