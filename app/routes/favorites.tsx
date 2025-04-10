import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import EnhancedSearchBar from "../components/EnhancedSearchBar";
import ProductCard from "../components/ProductCard";
import { Heart, ShoppingBag, TrashIcon, X, BookmarkIcon, Filter, SlidersHorizontal } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface Product {
  id: string;
  title: string;
  image: string;
  storeName: string;
  price?: string;
  rating?: string;
  reviewCount?: string;
  seller?: string;
  link?: string;
}

export default function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Load favorites from localStorage (simulate API call)
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      // In a real app, you would fetch this from an API
      // This is just a simulation with localStorage and timeout
      setTimeout(() => {
        try {
          const savedFavorites = localStorage.getItem("favoriteProducts");
          
          // If no favorites are saved yet, use mock data
          if (!savedFavorites) {
            // Mock data for demonstration
            const mockFavorites = generateMockFavorites();
            setFavoriteProducts(mockFavorites);
            localStorage.setItem("favoriteProducts", JSON.stringify(mockFavorites));
            setIsEmpty(mockFavorites.length === 0);
          } else {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavoriteProducts(parsedFavorites);
            setIsEmpty(parsedFavorites.length === 0);
          }
        } catch (error) {
          console.error("Error loading favorites:", error);
          setFavoriteProducts([]);
          setIsEmpty(true);
        }
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    loadFavorites();
  }, []);

  // Generate mock data for demonstration
  const generateMockFavorites = (): Product[] => {
    return [
      {
        id: "fav1",
        title: "Apple iPhone 13 Pro Max - 256GB - Graphite",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=1000&auto=format&fit=crop",
        storeName: "Apple Store",
        price: "$1,099.00",
        rating: "4.8",
        reviewCount: "1243",
        seller: "Apple",
        link: "https://example.com/product/1"
      },
      {
        id: "fav2",
        title: "Samsung Galaxy S22 Ultra - 512GB - Phantom Black",
        image: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMHBob25lfGVufDB8fDB8fHww",
        storeName: "Samsung",
        price: "$1,199.99",
        rating: "4.6",
        reviewCount: "856",
        seller: "Samsung",
        link: "https://example.com/product/2"
      },
      {
        id: "fav3",
        title: "Sony WH-1000XM4 Wireless Noise-Cancelling Headphones",
        image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
        storeName: "Sony",
        price: "$349.99",
        rating: "4.7",
        reviewCount: "2143",
        seller: "Sony",
        link: "https://example.com/product/3"
      },
      {
        id: "fav4",
        title: "Nike Air Jordan 1 Retro High OG - Chicago",
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1000&auto=format&fit=crop",
        storeName: "Nike",
        price: "$170.00",
        rating: "4.9",
        reviewCount: "3215",
        seller: "Nike",
        link: "https://example.com/product/4"
      },
      {
        id: "fav5",
        title: "Apple MacBook Pro 16-inch M1 Max - 32GB RAM - 1TB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
        storeName: "Apple Store",
        price: "$2,499.00",
        rating: "4.8",
        reviewCount: "567",
        seller: "Apple",
        link: "https://example.com/product/5"
      }
    ];
  };

  // Remove a product from favorites
  const removeFavorite = (productId: string) => {
    const updatedFavorites = favoriteProducts.filter(product => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
    setIsEmpty(updatedFavorites.length === 0);
  };

  // Filter products based on the selected filter
  const getFilteredProducts = () => {
    if (activeFilter === "all") return favoriteProducts;
    return favoriteProducts.filter(product => product.storeName === activeFilter);
  };

  // Get unique store names for filter options
  const storeFilters = ["all", ...new Set(favoriteProducts.map(product => product.storeName))];

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
        stiffness: 300,
        damping: 24
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <EnhancedSearchBar />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-accent-pink fill-accent-pink" />
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Favorites</h1>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </motion.button>
            </div>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Filter by Store</h3>
                    <div className="flex flex-wrap gap-2">
                      {storeFilters.map((store) => (
                        <motion.button
                          key={store}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveFilter(store)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeFilter === store
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {store === "all" ? "All Items" : store}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-[420px] relative"
                >
                  <div className="h-60 bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-1/2"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-1/4 mt-2"></div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                <BookmarkIcon className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No favorites yet</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
                When you find products you love, save them to your favorites for easy access later.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg shadow-md flex items-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              >
                {getFilteredProducts().map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <div className="absolute z-10 top-3 right-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFavorite(product.id)}
                        className="p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group-hover:opacity-100 sm:opacity-0"
                        aria-label="Remove from favorites"
                      >
                        <TrashIcon className="h-5 w-5 text-zinc-500 hover:text-accent-pink dark:text-zinc-400 dark:hover:text-accent-pink" />
                      </motion.button>
                    </div>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
              
              {getFilteredProducts().length === 0 && activeFilter !== "all" && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center justify-center py-16 px-4 text-center mt-8"
                >
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    No favorites found for filter: <span className="font-medium">{activeFilter}</span>
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter("all")}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg shadow-md flex items-center text-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filter
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
} 