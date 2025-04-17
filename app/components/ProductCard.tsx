import { Link } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ExternalLink, Star, ArrowRight, Tag, Eye } from "lucide-react";
import { useState, useEffect } from "react";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is in favorites on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const favoritesList = localStorage.getItem('favoriteProducts');
        if (favoritesList) {
          const favorites = JSON.parse(favoritesList);
          setIsLiked(favorites.some((fav: any) => fav.id === product.id));
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    }
  }, [product.id]);

  // Handle toggling favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      try {
        const favoritesList = localStorage.getItem('favoriteProducts');
        let favorites = favoritesList ? JSON.parse(favoritesList) : [];
        
        if (isLiked) {
          favorites = favorites.filter((fav: any) => fav.id !== product.id);
        } else {
          favorites.push(product);
        }
        
        localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
        setIsLiked(!isLiked);
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    }
  };

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 20 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-zinc-800 h-full flex flex-col group"
    >
      {/* Product Image Container with Badge and Favorite Button */}
      <div className="relative h-48 overflow-hidden">
        {/* Image */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
          className="w-full h-full bg-zinc-100 dark:bg-zinc-800"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
              <ShoppingCart className="h-8 w-8 text-zinc-400 opacity-50" />
            </div>
          )}
        </motion.div>
        
        {/* Overlay with gradient that appears on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Store badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="absolute top-2.5 left-2.5 z-10"
        >
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white/90 dark:bg-zinc-800/90 text-primary-600 dark:text-primary-400 shadow-sm backdrop-blur-sm">
            <Tag className="h-3 w-3" />
            {product.storeName}
          </span>
        </motion.div>
        
        {/* Favorite button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`p-2 rounded-full shadow-sm backdrop-blur-sm ${
              isLiked 
                ? 'bg-red-50 dark:bg-red-900/30' 
                : 'bg-white/90 dark:bg-zinc-800/90'
            } transition-all duration-200`}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-4 w-4 ${
                isLiked 
                  ? 'text-accent-pink fill-accent-pink' 
                  : 'text-zinc-500 dark:text-zinc-400'
              }`} 
            />
          </motion.button>
        </div>
        
        {/* View details button that appears on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bottom-3 left-0 right-0 flex justify-center px-3 z-10"
            >
              <Link
                to={`/product/${product.id}`}
                className="py-1.5 px-3 bg-white/90 dark:bg-zinc-800/90 rounded-md text-xs font-medium text-primary-600 dark:text-primary-400 shadow-sm backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Information */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <Link to={`/product/${product.id}`} className="group">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2 text-sm leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {product.title}
          </h3>
        </Link>
        
        {/* Seller (if available) */}
        {product.seller && (
          <div className="mt-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded inline-flex items-center">
              <span className="mr-1">Seller:</span>
              <span className="font-medium truncate max-w-[120px]">{product.seller}</span>
            </span>
          </div>
        )}
        
        <div className="mt-auto pt-2 flex items-end justify-between">
          {/* Price */}
          {product.price && (
            <motion.span 
              className="text-sm font-bold text-zinc-900 dark:text-zinc-100"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {product.price}
            </motion.span>
          )}
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${
                      i < Math.floor(parseFloat(product.rating || "0")) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-zinc-300 dark:text-zinc-700"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {product.rating}
              </span>
              {product.reviewCount && (
                <span className="text-xs text-zinc-400 dark:text-zinc-600">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}