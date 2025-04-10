// app/routes/search.tsx
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ProductCard from "../components/ProductCard";
import EnhancedSearchBar from "../components/EnhancedSearchBar";
import Layout from "../components/Layout";
import { Search as SearchIcon, SlidersHorizontal, ChevronDown, X, Sparkles, Filter, ArrowUp, Zap, Badge, Tag, LayoutGrid, LayoutList } from "lucide-react";

interface Product {
  id: string;
  title: string;
  image: string;
  storeName: string;
  price?: string;
  rating?: string;
  reviewCount?: string;
  seller?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  try {
    const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }
    const data = await response.json();
    return json({
      products: data,
      query
    });
  } catch (error) {
    console.error("Search error:", error);
    return json({
      products: [],
      query,
      error: "Failed to load search results. Please try again."
    });
  }
}

export default function Search() {
  const { products, query, error } = useLoaderData<{ products: Product[], query: string, error?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Extract unique stores for filtering
  const storeCategories = [...new Set(products.map(product => product.storeName))];
  
  // Related search suggestions
  const relatedSearches = query ? [
    `${query} best price`, 
    `${query} reviews`, 
    `${query} vs competition`,
    `newest ${query}`, 
    `top rated ${query}`
  ] : [];
  
  // Scroll animations
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 300], [0, 1]);
  
  useEffect(() => {
    // Reset filters when query changes
    setCategoryFilters([]);
    setSelectedRating(null);
    
    // Apply initial filters
    applyFilters();
    
    // Show scroll button based on scroll position
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowScrollTop(window.scrollY > 500);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [products, query]);
  
  // Apply all active filters
  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply category filters
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(product => categoryFilters.includes(product.storeName));
    }
    
    // Apply price filter if we have prices
    filtered = filtered.filter(product => {
      if (!product.price) return true;
      const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });
    
    // Apply rating filter
    if (selectedRating !== null) {
      filtered = filtered.filter(product => {
        if (!product.rating) return false;
        return parseFloat(product.rating) >= selectedRating;
      });
    }
    
    setFilteredProducts(filtered);
  };
  
  useEffect(() => {
    applyFilters();
  }, [categoryFilters, priceRange, selectedRating]);
  
  const clearFilters = () => {
    setCategoryFilters([]);
    setPriceRange([0, 2000]);
    setSelectedRating(null);
    setFilteredProducts(products);
  };
  
  const handleStoreFilterToggle = (store: string) => {
    setCategoryFilters(prev => 
      prev.includes(store) 
        ? prev.filter(s => s !== store) 
        : [...prev, store]
    );
  };
  
  const handleSearchClick = (searchTerm: string) => {
    setSearchParams({ q: searchTerm });
  };
  
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="sticky top-20 z-30 pt-2 pb-6 bg-background-light dark:bg-background-dark">
            <EnhancedSearchBar />
          </div>
          
          {/* Error message if search failed */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
            >
              <p>{error}</p>
            </motion.div>
          )}
          
          {/* Search info and filters */}
          <div className="mb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {query ? (
                    <>Search results for "<span className="text-primary-600 dark:text-primary-400">{query}</span>"</>
                  ) : (
                    <>All Products</>
                  )}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
                  {categoryFilters.length > 0 && ' with filters applied'}
                </p>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden mr-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid" 
                        ? "bg-zinc-100 dark:bg-zinc-800 text-primary-600 dark:text-primary-400" 
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list" 
                        ? "bg-zinc-100 dark:bg-zinc-800 text-primary-600 dark:text-primary-400" 
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                    aria-label="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isFilterExpanded || categoryFilters.length > 0
                      ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {categoryFilters.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
                      {categoryFilters.length}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Filters panel */}
            <AnimatePresence>
              {isFilterExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Store filters */}
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary-500" />
                        Store
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {storeCategories.map(store => (
                          <div key={store} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`store-${store}`}
                              checked={categoryFilters.includes(store)}
                              onChange={() => handleStoreFilterToggle(store)}
                              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                            />
                            <label
                              htmlFor={`store-${store}`}
                              className="ml-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                            >
                              {store}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price range filter */}
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                        <Badge className="h-4 w-4 text-primary-500" />
                        Price Range
                      </h3>
                      <div className="px-2">
                        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}+</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full accent-primary-500 dark:accent-primary-400"
                          aria-label="Price range"
                          title="Price range slider"
                        />
                      </div>
                    </div>
                    
                    {/* Rating filter */}
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary-500" />
                        Rating
                      </h3>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center">
                            <input
                              type="radio"
                              id={`rating-${rating}`}
                              name="rating"
                              checked={selectedRating === rating}
                              onChange={() => setSelectedRating(rating === selectedRating ? null : rating)}
                              className="h-4 w-4 border-zinc-300 dark:border-zinc-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                            />
                            <label
                              htmlFor={`rating-${rating}`}
                              className="ml-2 text-sm text-zinc-700 dark:text-zinc-300 flex items-center cursor-pointer"
                            >
                              <span className="flex items-center mr-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-300 dark:text-zinc-600"
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </span>
                              & up
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Filter actions */}
                    <div className="md:col-span-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {categoryFilters.length > 0 || selectedRating !== null ? 
                          `${filteredProducts.length} items with filters applied` : 
                          'No filters applied'}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={clearFilters}
                          disabled={categoryFilters.length === 0 && selectedRating === null && priceRange[0] === 0 && priceRange[1] === 2000}
                          className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Clear All
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsFilterExpanded(false)}
                          className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                          Apply Filters
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Related searches */}
            {query && relatedSearches.length > 0 && (
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary-500" />
                  Related searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedSearches.map((term, index) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.05 + 0.1 }
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSearchClick(term)}
                      className="px-3 py-1.5 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Search results */}
          <div ref={resultsRef}>
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-2">
                  {query ? "No results found" : "Enter a search term"}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
                  {query 
                    ? "We couldn't find any products matching your search. Try different keywords or browse our categories."
                    : "Start by entering a search term above to find products."}
                </p>
                {query && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchParams({ q: "" })}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm inline-flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      custom={index}
                      layout
                      className={viewMode === "list" ? "flex bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all" : ""}
                    >
                      {viewMode === "list" ? (
                        <div className="flex flex-col sm:flex-row w-full">
                          <div className="sm:w-48 lg:w-60 h-48 relative flex-shrink-0">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <span className="text-zinc-400">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{product.storeName}</span>
                              </div>
                              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-lg mb-2">{product.title}</h3>
                              {product.seller && (
                                <span className="text-xs text-zinc-500 block mb-2">
                                  Seller: {product.seller}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              {product.rating && (
                                <div className="flex items-center">
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`h-4 w-4 ${
                                          i < Math.floor(parseFloat(product.rating || "0")) 
                                            ? "text-yellow-400 fill-yellow-400" 
                                            : "text-zinc-300 dark:text-zinc-600"
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm text-zinc-600 dark:text-zinc-400 ml-1 font-medium">
                                    {product.rating}
                                  </span>
                                  {product.reviewCount && (
                                    <span className="text-xs text-zinc-500 ml-1">
                                      ({product.reviewCount})
                                    </span>
                                  )}
                                </div>
                              )}
                              {product.price && (
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                  {product.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ProductCard product={product} />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Suggestions divider */}
                {filteredProducts.length > 12 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative my-16 text-center"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-background-light dark:bg-background-dark text-sm text-zinc-500 dark:text-zinc-400">
                        You might also like
                      </span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg z-20"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
