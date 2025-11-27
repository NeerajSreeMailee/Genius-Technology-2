"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"
import { usePathname } from "next/navigation"

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();


  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeAllSections = () => {
    setOpenSection(null);
  };

  return (
    <footer className="bg-[#FFCC01] text-white pt-6 sm:pt-8 lg:pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 lg:gap-10">
          {/* Left: Logo and Info */}
          <div className="flex-1 min-w-[220px] flex flex-col items-center lg:items-start mb-6 lg:mb-0">
            <div className="flex items-center mb-4 sm:mb-6">
              <Link href="/" onClick={closeAllSections}>
                <Image src="/logo.png" alt="Genius Technology Logo" width={200} height={80} className="sm:w-[230px] sm:h-[92px] lg:w-[250px] lg:h-[100px] mr-3" />
              </Link>
            </div>
            <p className="text-white text-sm sm:text-base mb-6 sm:mb-8 max-w-xs text-center lg:text-left leading-relaxed">Discover the latest arrivals in cutting-edge electronics</p>
            <div className="flex space-x-4 sm:space-x-5 mt-auto">
              <Link href="#" className="hover:opacity-80 transition-opacity duration-200 p-1" aria-label="Facebook" onClick={closeAllSections}><Facebook size={20} className="sm:w-[22px] sm:h-[22px]" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity duration-200 p-1" aria-label="Instagram" onClick={closeAllSections}><Instagram size={20} className="sm:w-[22px] sm:h-[22px]" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity duration-200 p-1" aria-label="Twitter" onClick={closeAllSections}><Twitter size={20} className="sm:w-[22px] sm:h-[22px]" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity duration-200 p-1" aria-label="YouTube" onClick={closeAllSections}><Youtube size={20} className="sm:w-[22px] sm:h-[22px]" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity duration-200 p-1" aria-label="LinkedIn" onClick={closeAllSections}><Linkedin size={20} className="sm:w-[22px] sm:h-[22px]" /></Link>
            </div>
          </div>
          {/* Columns */}
          <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
            <div className="relative">
              <button 
                className="font-bold mb-3 sm:mb-4 text-white flex items-center justify-between w-full text-left text-sm sm:text-base lg:cursor-default"
                onClick={() => toggleSection('about')}
              >
                ABOUT Genius Technology
                <span className="lg:hidden text-white/80">
                  {openSection === 'about' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-1 sm:space-y-2 text-white/80 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === 'about' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
              }`}>
                <li><Link href="/about" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Our Story</Link></li>
                <li><Link href="/about" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Careers</Link></li>
                <li><Link href="/about" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Investors</Link></li>
                <li><Link href="/about" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Press</Link></li>
              </ul>
            </div>
            <div className="relative">
              <button 
                className="font-bold mb-3 sm:mb-4 text-white flex items-center justify-between w-full text-left text-sm sm:text-base lg:cursor-default"
                onClick={() => toggleSection('service')}
              >
                CUSTOMER SERVICE
                <span className="lg:hidden text-white/80">
                  {openSection === 'service' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-1 sm:space-y-2 text-white/80 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === 'service' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
              }`}>
                <li><Link href="/contact" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Contact Us</Link></li>
                <li><Link href="/faq" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>FAQ</Link></li>
                <li><Link href="/shipping" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Return/Exchange</Link></li>
              </ul>
            </div>
            <div className="relative">
              <button 
                className="font-bold mb-3 sm:mb-4 text-white flex items-center justify-between w-full text-left text-sm sm:text-base lg:cursor-default"
                onClick={() => toggleSection('quick')}
              >
                QUICK LINKS
                <span className="lg:hidden text-white/80">
                  {openSection === 'quick' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-1 sm:space-y-2 text-white/80 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === 'quick' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
              }`}>
                <li><Link href="/privacy" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Terms of Service</Link></li>
                <li><Link href="/returns" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Return Policy</Link></li>
                <li><Link href="/shipping" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Shipping Info</Link></li>
              </ul>
            </div>
            <div className="relative">
              <button 
                className="font-bold mb-3 sm:mb-4 text-white flex items-center justify-between w-full text-left text-sm sm:text-base lg:cursor-default"
                onClick={() => toggleSection('categories')}
              >
                CATEGORIES
                <span className="lg:hidden text-white/80">
                  {openSection === 'categories' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-1 sm:space-y-2 text-white/80 overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === 'categories' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
              }`}>
                <li><Link href="/products/display" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Display</Link></li>
                <li><Link href="/products/battery" className="hover:underline hover:text-white block py-1 text-sm sm:text-base transition-colors duration-200" onClick={closeAllSections}>Battery</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center text-white/90 text-sm sm:text-base font-medium mt-8 sm:mt-10 lg:mt-12 mb-2 pt-6 border-t border-white/20">
          © {currentYear} genius technology, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}