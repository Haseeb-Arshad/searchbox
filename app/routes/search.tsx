// app/routes/search.tsx
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import EnhancedSearchBar from "../components/EnhancedSearchBar";
import Layout from "../components/Layout";
import { Search, SlidersHorizontal, ChevronDown, X, Sparkles } from "lucide-react";

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

interface LoaderData {
  results: Product[];
  query: string | null;
  error?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return json<LoaderData>({ results: [], query: null });
  }

  try {
    const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
    }

    const results = await response.json();
    
    // Ensure results is always an array
    return json<LoaderData>({ 
      results: Array.isArray(results) ? results : [], 
      query 
    });

  } catch (error: any) {
    console.error("Detailed error:", error.message);
    return json<LoaderData>({
      results: [],
      query,
      error: `Unable to load results. Error: ${error.message}`,
    }, { status: 500 });
  }
};

export default function SearchResults() {
  const { results = [], query, error } = useLoaderData<LoaderData>();
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [filteredResults, setFilteredResults] = useState<Product[]>(results);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const navigate = useNavigate();

  // Get unique stores for filtering
  const stores = [...new Set(results.map(product => product.storeName))];

  useEffect(() => {
    let sorted = [...results];
    
    // Apply sorting
    if (sortOption === "price-low") {
      sorted.sort((a, b) => {
        const priceA = a.price ? parseFloat(a.price.replace(/[^\d.-]/g, '')) : 0;
        const priceB = b.price ? parseFloat(b.price.replace(/[^\d.-]/g, '')) : 0;
        return priceA - priceB;
      });
    } else if (sortOption === "price-high") {
      sorted.sort((a, b) => {
        const priceA = a.price ? parseFloat(a.price.replace(/[^\d.-]/g, '')) : 0;
        const priceB = b.price ? parseFloat(b.price.replace(/[^\d.-]/g, '')) : 0;
        return priceB - priceA;
      });
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => {
        const ratingA = a.rating ? parseFloat(a.rating) : 0;
        const ratingB = b.rating ? parseFloat(b.rating) : 0;
        return ratingB - ratingA;
      });
    }
    
    // Apply filters
    if (activeFilters.length > 0) {
      sorted = sorted.filter(product => activeFilters.includes(product.storeName));
    }

    // Apply price filter
    sorted = sorted.filter(product => {
      if (!product.price) return true;
      const price = parseFloat(product.price.replace(/[^\d.-]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    setFilteredResults(sorted);
  }, [results, sortOption, activeFilters, priceRange]);
  
  const toggleFilter = (store: string) => {
    setActiveFilters(prev => 
      prev.includes(store) 
        ? prev.filter(f => f !== store) 
        : [...prev, store]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EnhancedSearchBar />
          <div className="mt-8 p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-300 rounded-lg">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="sticky top-24 z-10 bg-background-light dark:bg-background-dark pb-4 pt-2">
          <EnhancedSearchBar />
        </div>
        
        {!query ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Search className="h-16 w-16 text-zinc-300 mb-4" />
            </motion.div>
            <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">Enter a search term to begin</h2>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 mb-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Results for "<span className="text-primary-600 dark:text-primary-400">{query}</span>"
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    {filteredResults.length} item{filteredResults.length !== 1 ? 's' : ''}
                  </span>
                </h1>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                  
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5">
                    <label htmlFor="sort" className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Sort:</label>
                    <select
                      id="sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="text-sm bg-transparent border-none focus:ring-0 p-0 pr-6 rounded-none appearance-none"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Mobile filters */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden col-span-1 overflow-hidden"
                  >
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                          <X className="h-5 w-5 text-zinc-500" />
                        </button>
                      </div>
                      
                      {/* Mobile filters content */}
                      <FilterContent 
                        stores={stores} 
                        activeFilters={activeFilters} 
                        toggleFilter={toggleFilter} 
                        priceRange={priceRange}
                        handlePriceChange={handlePriceChange}
                        clearFilters={() => {
                          setActiveFilters([]);
                          setPriceRange([0, 2000]);
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop filters sidebar */}
              {stores.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="hidden lg:block lg:col-span-1"
                >
                  <div className="sticky top-28 bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-lg mb-4">Filters</h3>
                    
                    <FilterContent 
                      stores={stores} 
                      activeFilters={activeFilters} 
                      toggleFilter={toggleFilter} 
                      priceRange={priceRange}
                      handlePriceChange={handlePriceChange}
                      clearFilters={() => {
                        setActiveFilters([]);
                        setPriceRange([0, 2000]);
                      }}
                    />
                  </div>
                </motion.div>
              )}
              
              {/* Results grid */}
              <div className={`${stores.length > 0 ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
                {filteredResults.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 rounded-xl"
                  >
                    <Sparkles className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 text-center mb-4">No products found for "{query}".</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Back to home
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {filteredResults.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

interface FilterContentProps {
  stores: string[];
  activeFilters: string[];
  toggleFilter: (store: string) => void;
  priceRange: [number, number];
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  clearFilters: () => void;
}

function FilterContent({ 
  stores, 
  activeFilters, 
  toggleFilter, 
  priceRange, 
  handlePriceChange,
  clearFilters 
}: FilterContentProps) {
  return (
    <>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-4">
        <h4 className="font-medium text-sm mb-3">Price Range</h4>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500">$</span>
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-16 text-sm border-zinc-200 dark:border-zinc-700 rounded-md py-1"
              aria-label="Minimum price input"
              title="Minimum price"
            />
          </div>
          <span className="text-xs text-zinc-500">to</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500">$</span>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-16 text-sm border-zinc-200 dark:border-zinc-700 rounded-md py-1"
              aria-label="Maximum price input"
              title="Maximum price"
            />
          </div>
        </div>
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full accent-primary-500"
            aria-label="Minimum price range"
            title="Minimum price"
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full accent-primary-500 -mt-2"
            aria-label="Maximum price range"
            title="Maximum price"
          />
        </div>
      </div>
      
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <h4 className="font-medium text-sm mb-3">Stores</h4>
        <div className="space-y-2">
          {stores.map(store => (
            <div key={store} className="flex items-center">
              <input
                type="checkbox"
                id={`store-${store}`}
                checked={activeFilters.includes(store)}
                onChange={() => toggleFilter(store)}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`store-${store}`} className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                {store}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {(activeFilters.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
        <button
          onClick={clearFilters}
          className="mt-4 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Clear all filters
        </button>
      )}
    </>
  );
}
