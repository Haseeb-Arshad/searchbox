import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LoaderFunction } from "@remix-run/node";
import { ArrowLeft, Heart, Share, ExternalLink, Star, ShoppingBag } from "lucide-react";
import EnhancedSearchBar from "../../components/EnhancedSearchBar";

interface Product {
  id: string;
  title: string;
  image: string;
  detailedDescription: string;
  link: string;
  price?: string;
  rating?: string;
  reviewCount?: string;
  storeName?: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:8080/api/product/${params.productId}`);
  const product = await response.json();
  return product;
};

export default function ProductDetail() {
  const product = useLoaderData<Product>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Generate star rating elements if rating exists
  const renderStars = () => {
    if (!product.rating) return null;
    
    const rating = parseFloat(product.rating);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`} 
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1 mt-4">
        <div className="flex">{stars}</div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {product.rating} 
          {product.reviewCount && <span className="ml-1">({product.reviewCount} reviews)</span>}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <EnhancedSearchBar />
        </div>
        
        <div className="mb-6">
          <Link 
            to="/search" 
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to search results
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                <span className="text-white text-sm font-medium">Click to enlarge</span>
              </div>
            </motion.div>
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 rounded-full shadow-md ${
                  isLiked 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : 'bg-white dark:bg-zinc-800'
                }`}
              >
                <Heart className={`h-5 w-5 ${
                  isLiked 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-zinc-600 dark:text-zinc-400'
                }`} />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full shadow-md bg-white dark:bg-zinc-800"
              >
                <Share className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              {product.title}
            </h1>
            
            {product.storeName && (
              <div className="mb-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Store: {product.storeName}
                </span>
              </div>
            )}
            
            {product.price && (
              <div className="mt-4 mb-6">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {product.price}
                </span>
              </div>
            )}
            
            {renderStars()}
            
            <div className="mt-8 mb-6">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">Description</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {product.detailedDescription}
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Visit Store</span>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Original</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-xl flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.image}
                alt={product.title}
                className="max-h-[85vh] max-w-full object-contain"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70 transition-colors"
                aria-label="Close image view"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}