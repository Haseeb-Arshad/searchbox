"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "@remix-run/react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Send, Tag, ShoppingCart, Sparkles, Star, TrendingUp, ArrowRight } from "lucide-react"
import { Input } from "./ui/input"
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
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Popular searches when no query is entered
  const popularSearches = [
    { name: "Smartphones", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: "Laptops", icon: <Star className="h-3.5 w-3.5" /> },
    { name: "Headphones", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { name: "Shoes", icon: <Star className="h-3.5 w-3.5" /> },
    { name: "Watches", icon: <Sparkles className="h-3.5 w-3.5" /> }
  ]

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
            products: data.slice(0, 4), // Limit preview results
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

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: { duration: 0.3 },
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 }
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <motion.div 
              initial={false}
              animate={{ 
                scale: isFocused ? 1.02 : 1,
                y: isFocused ? -4 : 0
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search for products, brands, categories..."
                className="pl-12 pr-12 py-6 h-14 text-base transition-all duration-200 bg-surface-light dark:bg-surface-dark border border-zinc-200 shadow-search dark:shadow-zinc-900/20 hover:shadow-lg focus:shadow-xl dark:border-zinc-800 rounded-2xl"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 dark:text-primary-400">
                <Search className="h-5 w-5" />
              </div>
              
              <AnimatePresence mode="popLayout">
                {query.length > 0 && (
                  <motion.button
                    key="send-button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center text-white transition-colors shadow-md hover:shadow-lg"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 border-2 border-zinc-300 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
          </div>
        </form>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute z-[100] w-full mt-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              {!query && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, i) => (
                      <motion.button
                        key={term.name}
                        variants={item}
                        className="px-3 py-1.5 text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 dark:text-primary-300 rounded-full transition-colors flex items-center gap-1.5 shadow-sm hover:shadow"
                        onClick={() => {
                          setQuery(term.name)
                          handleSearch()
                        }}
                      >
                        {term.icon}
                        <span>{term.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {results && results.products && results.products.length > 0 && (
                <div className="border-t border-zinc-200 dark:border-zinc-800">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Quick Results</h3>
                    <ul className="space-y-2">
                      {results.products.map((product) => (
                        <motion.li
                          key={product.id}
                          variants={item}
                          className="flex items-center gap-3 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg cursor-pointer transition-colors"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 shadow-sm">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-zinc-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{product.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">{product.storeName}</span>
                              {product.price && (
                                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{product.price}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {results && results.categories && results.categories.length > 0 && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Shop by Store</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((category) => (
                      <motion.button
                        key={category}
                        variants={item}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple rounded-full transition-colors shadow-sm hover:shadow"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <Tag className="h-3.5 w-3.5" />
                        <span>{category}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <motion.div 
                variants={item} 
                className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-center"
              >
                <button 
                  onClick={handleSearch}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  View all results for "{query}"
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 