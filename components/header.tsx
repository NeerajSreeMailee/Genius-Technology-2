"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const { items: wishlistItems } = useWishlist()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when pathname changes
  useEffect(() => {
    setIsProductsOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  // Memoize product categories to prevent unnecessary re-renders
  const productCategories = useMemo(() => [
    {
      title: "Display",
    },
    {
      title: "Battery",
    },
  ], [])

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Design Patterns", href: "/design-patterns" },
  ], [])

  // Memoize cart item count to prevent unnecessary re-renders
  const cartItemCount = useMemo(() => getTotalItems(), [getTotalItems])

  // Memoize wishlist item count to prevent unnecessary re-renders
  const wishlistItemCount = useMemo(() => wishlistItems.length, [wishlistItems])

  // Toggle products dropdown
  const toggleProductsDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProductsOpen(prev => !prev)
  }, [])

  // Close products dropdown
  const closeProductsDropdown = useCallback(() => {
    setIsProductsOpen(false)
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev)
  }, [])

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setIsProductsOpen(false)
    setIsMenuOpen(false)
  }, [])

  // Handle logout
  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      closeAllMenus();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, closeAllMenus])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-[30px] bg-primary h-[70px] sm:h-[80px] lg:h-[100px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Genius Technology"
                width={100}
                height={60}
                className="cursor-pointer sm:w-[120px] sm:h-[72px] lg:w-[150px] lg:h-[90px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center text-white ml-[30px]">
            <Link href="/" className="nav-link px-[10px] py-[5px] flex flex-col items-center" onClick={closeAllMenus}>
              <span className="relative inline-block">
                HOME
                {pathname === "/" && (
                    <span className="absolute left-0 right-0 bg-white" style={{ marginTop: '5px', bottom: '-10px', height: '4px', borderRadius: '4px', width: '100%' }}></span>
                )}
              </span>
            </Link>

            <div className="relative">
              <button 
              onClick={toggleProductsDropdown}
              className="nav-link flex items-center px-[10px] py-[5px]"
              >
              <span className="relative inline-block">
                OUR PRODUCTS
                {pathname.startsWith("/products") && (
                <span className="absolute left-0 right-0 bg-white" style={{ marginTop: '5px', bottom: '-10px', height: '4px', borderRadius: '4px', width: '100%' }}></span>
                )}
              </span>
              <ChevronDown size={16} className="ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isProductsOpen && (
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg mt-2 py-2 animate-fade-in">
                <Link 
                href="/products/display" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                onClick={closeProductsDropdown}
                >
                Display
                </Link>
                <Link 
                href="/products/battery" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                onClick={closeProductsDropdown}
                >
                Battery
                </Link>
              </div>
              )}
            </div>

            <Link href="/corporate" className="nav-link px-[10px] py-[5px] flex flex-col items-center" onClick={closeAllMenus}>
              <span className="relative inline-block">
                CORPORATE ORDERS
                {pathname === "/corporate" && (
                  <span className="absolute left-0 right-0 bg-white" style={{ marginTop: '5px', bottom: '-5px', height: '4px', borderRadius: '4px', width: '100%' }}></span>
                )}
              </span>
            </Link>
            <Link href="/join" className="nav-link px-[10px] py-[5px] flex flex-col items-center" onClick={closeAllMenus}>
              <span className="relative inline-block">
                JOIN WITH US
                {pathname === "/join" && (
                      <span className="absolute left-0 right-0 bg-white" style={{ marginTop: '5px', bottom: '-10px', height: '4px', borderRadius: '4px', width: '100%' }}></span>
                )}
              </span>
            </Link>
            <Link href="/about" className="nav-link px-[10px] py-[5px] flex flex-col items-center" onClick={closeAllMenus}>
            <span className="relative inline-block">
              ABOUT US
              {pathname === "/about" && (
                    <span className="absolute left-0 right-0 bg-white" style={{ marginTop: '5px', bottom: '-10px', height: '4px', borderRadius: '4px', width: '100%' }}></span>
              )}
              </span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden bg-white rounded-full md:flex items-center flex-1 px-[24px] max-w-md mx-8">
            <div className="relative w-full flex items-center">
              <Sparkles size={20} color="#004AAD" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-white/0 border-none rounded-full "
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Header Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist - Hidden on very small screens */}
            <Link
              href="/wishlist"
              className="hidden sm:block relative p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              onClick={closeAllMenus}
            >
              <Heart size={20} className="text-white hover:text-orange-300 sm:w-6 sm:h-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors duration-200" onClick={closeAllMenus}>
              <ShoppingCart size={20} className="text-white hover:text-orange-300 sm:w-6 sm:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account - Hidden on mobile, shown in mobile menu */}
            <div className="hidden sm:block relative group">
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                title="User Account"
                onClick={closeAllMenus}
              >
                <User size={20} className="text-white hover:text-orange-300 sm:w-6 sm:h-6" />
              </button>

              {/* User Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {user ? (
                  <>
                    <Link href="/my-account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeAllMenus}>
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeAllMenus}>
                      Sign In
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeAllMenus}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X size={22} className="text-white" />
              ) : (
                <Menu size={22} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-out"
            onClick={closeAllMenus}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-[70px] sm:top-[80px] left-0 right-0 bg-white z-40 lg:hidden shadow-xl transform transition-transform duration-300 ease-out">
            <div className="max-h-[calc(100vh-70px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Mobile Search */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="relative">
                  <Sparkles size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="py-2">
                <Link 
                  href="/" 
                  className={`flex items-center px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 border-l-4 ${
                    pathname === "/" ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" : "border-transparent"
                  }`} 
                  onClick={closeAllMenus}
                >
                  <span className="text-base font-medium">HOME</span>
                </Link>

                {/* Products with submenu */}
                <div className="border-l-4 border-transparent">
                  <button 
                    onClick={toggleProductsDropdown}
                    className={`flex items-center justify-between w-full px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 ${
                      pathname.startsWith("/products") ? "bg-orange-50 text-orange-600 font-medium" : ""
                    }`}
                  >
                    <span className="text-base font-medium">OUR PRODUCTS</span>
                    <ChevronDown size={20} className={`transform transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isProductsOpen && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      <Link 
                        href="/products/display" 
                        className="block px-12 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        Display
                      </Link>
                      <Link 
                        href="/products/battery" 
                        className="block px-12 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        Battery
                      </Link>
                    </div>
                  )}
                </div>

                <Link 
                  href="/corporate" 
                  className={`flex items-center px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 border-l-4 ${
                    pathname === "/corporate" ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" : "border-transparent"
                  }`} 
                  onClick={closeAllMenus}
                >
                  <span className="text-base font-medium">CORPORATE ORDERS</span>
                </Link>

                <Link 
                  href="/join" 
                  className={`flex items-center px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 border-l-4 ${
                    pathname === "/join" ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" : "border-transparent"
                  }`} 
                  onClick={closeAllMenus}
                >
                  <span className="text-base font-medium">JOIN WITH US</span>
                </Link>

                <Link 
                  href="/about" 
                  className={`flex items-center px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 border-l-4 ${
                    pathname === "/about" ? "border-orange-500 bg-orange-50 text-orange-600 font-medium" : "border-transparent"
                  }`} 
                  onClick={closeAllMenus}
                >
                  <span className="text-base font-medium">ABOUT US</span>
                </Link>
              </nav>

              {/* Mobile User Account Section */}
              <div className="border-t border-gray-200 bg-gray-50">
                {user ? (
                  <div className="py-2">
                    <div className="px-6 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Welcome back!</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                    <Link 
                      href="/my-account" 
                      className="flex items-center px-6 py-4 text-gray-700 hover:bg-white hover:text-orange-600 transition-colors duration-200" 
                      onClick={closeAllMenus}
                    >
                      <User size={20} className="mr-3" />
                      <span className="font-medium">My Account</span>
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="flex items-center px-6 py-4 text-gray-700 hover:bg-white hover:text-orange-600 transition-colors duration-200 sm:hidden" 
                      onClick={closeAllMenus}
                    >
                      <Heart size={20} className="mr-3" />
                      <span className="font-medium">Wishlist</span>
                      {wishlistItemCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistItemCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-white hover:text-red-600 transition-colors duration-200"
                    >
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Link 
                      href="/login" 
                      className="flex items-center px-6 py-4 text-gray-700 hover:bg-white hover:text-orange-600 transition-colors duration-200" 
                      onClick={closeAllMenus}
                    >
                      <User size={20} className="mr-3" />
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link 
                      href="/register" 
                      className="flex items-center px-6 py-4 text-gray-700 hover:bg-white hover:text-orange-600 transition-colors duration-200" 
                      onClick={closeAllMenus}
                    >
                      <span className="font-medium">Create Account</span>
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="flex items-center px-6 py-4 text-gray-700 hover:bg-white hover:text-orange-600 transition-colors duration-200 sm:hidden" 
                      onClick={closeAllMenus}
                    >
                      <Heart size={20} className="mr-3" />
                      <span className="font-medium">Wishlist</span>
                      {wishlistItemCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistItemCount}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .nav-link {
          @apply text-gray-700 font-semibold hover:text-orange-500 transition-colors duration-200 relative;
        }
        .nav-link:hover::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, #ff6b35, #f7931e);
          border-radius: 2px;
        }
      `}</style>
    </>
  )
}