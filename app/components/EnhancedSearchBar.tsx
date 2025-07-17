"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "@remix-run/react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, Tag, ShoppingCart, Sparkles, Star, TrendingUp, Zap, FlameIcon } from "lucide-react"
import useDebounce from "../hooks/useDebounce"
import { useTheme } from "../context/ThemeContext"

interface Product {
  id: string
  title: string
  image: string
  storeName: string
  price?: string
}

interface SearchResult {
  products: Product[]
  categories?: string[]
}

export default function EnhancedSearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Popular searches when no query is entered
  const popularSearches = [
    { name: "Smartphones", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: "Laptops", icon: <Star className="h-3.5 w-3.5" /> },
    { name: "Headphones", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { name: "Shoes", icon: <Zap className="h-3.5 w-3.5" /> },
    { name: "Watches", icon: <FlameIcon className="h-3.5 w-3.5" /> }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    function handleScroll() {
      // Only close dropdown if not hovering over dropdown or searchbox
      if (isFocused && !isHoveringDropdown && !searchBoxRef.current?.contains(document.activeElement as Node)) {
        setIsFocused(false)
      }
    }

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleScroll)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [searchBoxRef, isFocused, isHoveringDropdown])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search box with / key
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      
      // Close dropdown with Escape key
      if (e.key === "Escape" && isFocused) {
        setIsFocused(false)
      }
    }
    
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isFocused])

  // Handle dropdown positioning and z-index
  useEffect(() => {
    if (isFocused && dropdownRef.current && searchBoxRef.current) {
      const updatePosition = () => {
        if (searchBoxRef.current && dropdownRef.current) {
          const rect = searchBoxRef.current.getBoundingClientRect()
          const dropdown = dropdownRef.current
          
          // Position dropdown below search box
          dropdown.style.position = "fixed"
          dropdown.style.top = `${rect.bottom + 8}px`
          dropdown.style.left = `${rect.left}px`
          dropdown.style.width = `${rect.width}px`
          dropdown.style.zIndex = "9999"
          
          // Check if dropdown would go below viewport
          const dropdownHeight = dropdown.offsetHeight
          const viewportHeight = window.innerHeight
          
          if (rect.bottom + dropdownHeight + 16 > viewportHeight) {
            // Position above search box if not enough space below
            dropdown.style.top = `${rect.top - dropdownHeight - 8}px`
          }
        }
      }
      
      // Initial positioning
      updatePosition()
      
      // Update position on scroll and resize
      const handlePositionUpdate = () => {
        requestAnimationFrame(updatePosition)
      }
      
      window.addEventListener("scroll", handlePositionUpdate, { passive: true })
      window.addEventListener("resize", handlePositionUpdate, { passive: true })
      
      return () => {
        window.removeEventListener("scroll", handlePositionUpdate)
        window.removeEventListener("resize", handlePositionUpdate)
      }
    }
  }, [isFocused])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null)
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json()
          setResults({
            products: data.slice(0, 6), // Limit preview results
            categories: extractCategories(data)
          })
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Extract unique categories from products for quick filtering
  const extractCategories = (products: Product[]): string[] => {
    const categories = new Set<string>()
    products.forEach(product => {
      if (product.storeName) {
        categories.add(product.storeName)
      }
    })
    return Array.from(categories).slice(0, 5) // Limit to 5 categories
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${encodeURIComponent(category)}`)
    setIsFocused(false)
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    setIsFocused(false)
  }

  // Variants for animations
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.025
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.97,
      transition: { 
        duration: 0.15,
        ease: [0.36, 0, 0.66, -0.56],
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 350
      }
    },
    exit: { 
      opacity: 0, 
      y: 6,
      transition: {
        duration: 0.12
      }
    }
  }

  // Add CSS for custom scrollbar using useEffect to ensure client-side only execution
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.5);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
        }
      `
      document.head.appendChild(style)
      
      // Clean up function to remove the style when component unmounts
      return () => {
        document.head.removeChild(style)
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchBoxRef}>
      {/* Search input form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
        <motion.div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className={`h-5 w-5 ${isFocused ? 'text-primary-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
          </motion.div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            placeholder="Search products, brands, stores..."
            className={`block w-full py-3 pl-10 pr-14 rounded-xl transition-all duration-300
              border-zinc-200 dark:border-zinc-800 
              bg-white dark:bg-zinc-900
              text-zinc-900 dark:text-zinc-100 
              shadow-sm hover:shadow
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              placeholder:text-zinc-400 dark:placeholder:text-zinc-600
              ${isFocused ? 'shadow-lg ring-2 ring-primary-500' : 'ring-0'}
            `}
              aria-label="Search"
            />
            
              <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
                type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
            <div className="p-1.5 bg-primary-500 hover:bg-primary-600 rounded-lg text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
              </motion.button>
              </div>
        
        {/* Keyboard shortcut badge */}
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center">
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs rounded-md px-1.5 py-0.5 font-mono">
            /
          </span>
          </div>
      </form>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute mt-1 w-full rounded-xl overflow-hidden shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 z-50"
            onMouseEnter={() => setIsHoveringDropdown(true)}
            onMouseLeave={() => setIsHoveringDropdown(false)}
          >
            {/* Loading indicator */}
            {isLoading && (
              <div className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-zinc-300 dark:border-zinc-700 border-t-primary-500 rounded-full animate-spin" />
                <span>Searching...</span>
                  </div>
            )}

            {/* Prompt message when no query */}
            {!query && !isLoading && (
              <motion.div 
                variants={itemVariants}
                className="px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800"
              >
                <p>Try searching for "smartphones", "headphones", or your favorite brands</p>
              </motion.div>
            )}

            {/* Popular searches */}
            {!debouncedQuery && (
              <div className="p-3">
                <motion.h3 
                  variants={itemVariants}
                  className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium px-2 mb-2"
                >
                  Popular Searches
                </motion.h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {popularSearches.map((search, idx) => (
                      <motion.button
                      key={search.name}
                        variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                        onClick={() => {
                        setQuery(search.name);
                        handleSearch();
                      }}
                      className="flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400">
                        {search.icon}
                      </span>
                      <span className="truncate">{search.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

            {/* Categories */}
            {results?.categories && results.categories.length > 0 && (
              <div className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-800">
                <motion.h3 
                  variants={itemVariants}
                  className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium px-2 mb-2"
                >
                  Categories
                </motion.h3>
                <div className="flex flex-wrap gap-2 px-2">
                  {results.categories.map((category, idx) => (
                    <motion.button
                      key={category}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(category)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Tag className="h-3 w-3" />
                      {category}
                    </motion.button>
                  ))}
                </div>
                    </div>
            )}

            {/* Product results */}
            {results?.products && results.products.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 max-h-[350px] overflow-y-auto custom-scrollbar">
                <motion.h3 
                  variants={itemVariants}
                  className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium px-5 pt-3 pb-1"
                >
                  Products
                </motion.h3>
                {results.products.map((product, idx) => (
                  <motion.button
                          key={product.id}
                          variants={itemVariants}
                          onClick={() => handleProductClick(product.id)}
                    className="w-full px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors flex items-center gap-3 text-left"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title} 
                          className="w-full h-full object-cover"
                              />
                            ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                          <ShoppingCart className="h-4 w-4 text-zinc-400" />
                              </div>
                            )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {product.storeName}
                              </span>
                              {product.price && (
                          <>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">•</span>
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                  {product.price}
                                </span>
                          </>
                              )}
                            </div>
                    </div>
                      </motion.button>
                    ))}
                
                {/* View all results button */}
                <motion.div 
                  variants={itemVariants}
                  className="p-3 border-t border-zinc-100 dark:border-zinc-800"
                >
                  <button
                    onClick={handleSearch}
                    className="w-full py-2 px-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View all results</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
                </div>
              )}

            {/* No results */}
            {query && !isLoading && results?.products && results.products.length === 0 && (
              <motion.div 
                variants={itemVariants}
                className="p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <Search className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                  No results found
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  Try searching with different keywords
                </p>
                <div className="flex justify-center gap-2">
                  {popularSearches.slice(0, 3).map((search) => (
                    <button
                      key={search.name}
                      onClick={() => {
                        setQuery(search.name);
                        handleSearch();
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {search.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 