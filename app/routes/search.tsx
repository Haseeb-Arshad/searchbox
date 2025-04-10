// app/routes/search.tsx
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import EnhancedSearchBar from "../components/EnhancedSearchBar";
import { Search } from "lucide-react";

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
    
    setFilteredResults(sorted);
  }, [results, sortOption, activeFilters]);
  
  const toggleFilter = (store: string) => {
    setActiveFilters(prev => 
      prev.includes(store) 
        ? prev.filter(f => f !== store) 
        : [...prev, store]
    );
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EnhancedSearchBar />
        <div className="mt-8 p-6 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="sticky top-0 z-10 bg-white dark:bg-black pb-4 pt-2">
        <EnhancedSearchBar />
      </div>
      
      {!query ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Search className="h-16 w-16 text-zinc-300 mb-4" />
          <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">Enter a search term to begin</h2>
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Results for "<span className="text-blue-600 dark:text-blue-400">{query}</span>"
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  {filteredResults.length} item{filteredResults.length !== 1 ? 's' : ''}
                </span>
              </h1>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-zinc-600 dark:text-zinc-400">Sort by:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-white dark:bg-zinc-900"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            {stores.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-28 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-medium text-lg mb-4">Filters</h3>
                  
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
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`store-${store}`} className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                            {store}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {activeFilters.length > 0 && (
                    <button
                      onClick={() => setActiveFilters([])}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Results grid */}
            <div className={`${stores.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 text-center mb-4">No products found for "{query}".</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to home
                  </button>
                </div>
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
  );
}
