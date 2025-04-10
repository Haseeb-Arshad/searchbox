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
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    function handleScroll() {
      if (isFocused) {
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
  }, [searchBoxRef, isFocused])

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

  // Make search dropdown appear above everything
  useEffect(() => {
    // Append dropdown to body when focused to ensure it's above all content
    if (isFocused && dropdownRef.current) {
      document.body.style.overflow = "auto"
      
      // Add scroll listener to adjust dropdown position on scroll
      const handleScroll = () => {
        if (searchBoxRef.current && dropdownRef.current) {
          const rect = searchBoxRef.current.getBoundingClientRect()
          if (dropdownRef.current) {
            dropdownRef.current.style.position = "fixed"
            dropdownRef.current.style.top = `${rect.bottom + 8}px`
            dropdownRef.current.style.left = `${rect.left}px`
            dropdownRef.current.style.width = `${rect.width}px`
          }
        }
      }
      
      // Initial positioning
      handleScroll()
      
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleScroll)
      
      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleScroll)
        document.body.style.overflow = ""
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
        staggerChildren: 0.035
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
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 8,
      transition: {
        duration: 0.15
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
    <div className="w-full max-w-3xl mx-auto relative" ref={searchBoxRef}>
      <form onSubmit={handleSearch} className="relative">
        <motion.div 
          initial={false}
          animate={{ 
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused 
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 4px 20px -5px rgba(0, 0, 0, 0.1)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.05)'
          }}
          transition={{ 
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative overflow-hidden rounded-full"
        >
          <div className={`flex items-center bg-white dark:bg-zinc-900 rounded-full ${
            isFocused 
              ? 'ring-2 ring-primary-400/50 dark:ring-primary-400/70' 
              : 'ring-1 ring-zinc-200 dark:ring-zinc-700'
          } transition-all duration-200`}>
            <div className="pl-5 pr-3 text-primary-500 dark:text-primary-400">
              <Search className="h-5 w-5" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search for products, brands, categories..."
              className="flex-1 py-3.5 h-14 text-base bg-transparent outline-none border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              aria-label="Search"
            />
            
            {isLoading ? (
              <div className="h-9 w-9 flex items-center justify-center mx-2.5">
                <div className="h-5 w-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-primary-500 dark:border-t-primary-400 rounded-full animate-spin"></div>
              </div>
            ) : query ? (
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 h-10 w-10 rounded-full flex items-center justify-center mx-2.5 shadow-md text-white transition-colors"
                aria-label="Search"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            ) : (
              <div className="px-4 py-1.5 mr-2.5 text-xs border border-zinc-200 dark:border-zinc-700 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400">
                Press /
              </div>
            )}
          </div>
        </motion.div>
      </form>
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-[9999] rounded-2xl"
            style={{ 
              pointerEvents: "auto",
              transformOrigin: "top center",
              willChange: "transform, opacity"
            }}
          >
            <div className="backdrop-blur-xl backdrop-saturate-150 bg-white/95 dark:bg-zinc-900/95 rounded-2xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3),0_10px_30px_-15px_rgba(0,0,0,0.2)] border border-zinc-200/80 dark:border-zinc-700/80 overflow-hidden max-h-[min(800px,80vh)] overflow-y-auto custom-scrollbar">
              {!query && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Popular Searches</h3>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">Try searching for</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {popularSearches.map((term, i) => (
                      <motion.button
                        key={term.name}
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.03, 
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2.5 text-sm bg-zinc-50 hover:bg-primary-50 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700/90 dark:text-zinc-200 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow border border-zinc-200/80 dark:border-zinc-700/80 overflow-hidden group"
                        onClick={() => {
                          setQuery(term.name)
                          handleSearch()
                        }}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                          {term.icon}
                        </div>
                        <span className="font-medium">{term.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {results && results.products && results.products.length > 0 && (
                <div className={`${!query ? 'border-t border-zinc-200/70 dark:border-zinc-800/70' : ''}`}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quick Results</h3>
                      <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full font-medium">
                        {results.products.length} found
                      </span>
                    </div>
                    
                    <div className="space-y-3.5">
                      {results.products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          variants={itemVariants}
                          custom={index}
                          whileHover={{ 
                            scale: 1.02, 
                            x: 4,
                            transition: { 
                              type: "spring",
                              stiffness: 400,
                              damping: 25
                            }
                          }}
                          className="flex items-center gap-4 p-3.5 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 rounded-xl cursor-pointer transition-all border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-700/80 group"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <motion.div 
                            className="h-16 w-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 shadow-sm group-hover:shadow"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-zinc-400" />
                              </div>
                            )}
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{product.title}</p>
                            <div className="flex items-center flex-wrap gap-3 mt-1.5">
                              <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                <Tag className="h-3 w-3" />
                                {product.storeName}
                              </span>
                              
                              {product.price && (
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                                  {product.price}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <motion.div
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400 flex-shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300"
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {results && results.categories && results.categories.length > 0 && (
                <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 p-5">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Shop by Store</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((category, index) => (
                      <motion.button
                        key={category}
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -2,
                          transition: { 
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 rounded-xl transition-all shadow-sm hover:shadow-md"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-800/30 text-purple-500">
                          <Tag className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{category}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <motion.div 
                variants={itemVariants}
                className="p-4 border-t border-zinc-200/70 dark:border-zinc-800/70 text-center bg-gradient-to-b from-zinc-50/50 to-zinc-100/70 dark:from-zinc-800/50 dark:to-zinc-800/80"
              >
                <motion.button 
                  onClick={handleSearch}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors flex items-center justify-center gap-2 mx-auto group"
                >
                  <span>View all results for "{query}"</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "loop", 
                      duration: 1.5,
                      repeatDelay: 0.5,
                      ease: "easeInOut" 
                    }}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 