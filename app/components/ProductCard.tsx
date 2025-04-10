import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
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
        y: -8,
        scale: 1.03,
        transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 15 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-zinc-200 dark:border-zinc-800 h-full flex flex-col group"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.title}
              className="w-full h-56 object-cover"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
              }}
            />
          ) : (
            <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
              <ShoppingCart className="h-10 w-10 text-zinc-400 opacity-50" />
            </div>
          )}
        </div>
        
        {/* Overlay with gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Favorite button */}
        <div className="absolute top-3 right-3 z-10">
          <motion.button 
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleFavorite}
            className={`bg-white/95 dark:bg-zinc-900/95 shadow-lg p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm ${
              isLiked ? 'bg-red-50 dark:bg-red-900/30 scale-110' : ''
            }`}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${
                isLiked 
                  ? 'text-accent-pink fill-accent-pink' 
                  : 'text-zinc-500 hover:text-accent-pink dark:text-zinc-400 dark:hover:text-accent-pink'
              }`} 
            />
          </motion.button>
        </div>
        
        {/* Store badge */}
        <div className="absolute top-3 left-3 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 dark:bg-zinc-900/95 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5"
          >
            <Tag className="h-3 w-3 text-primary-500 dark:text-primary-400" />
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{product.storeName}</span>
          </motion.div>
        </div>
        
        {/* Bottom action buttons that appear on hover */}
        <motion.div 
          className="absolute bottom-3 w-full px-4 flex justify-center items-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to={`/product/${product.id}`}
            className="group w-full px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        </motion.div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <Link to={`/product/${product.id}`} className="group">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 mb-3 text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {product.title}
          </h3>
        </Link>
        
        {/* Seller */}
        {product.seller && (
          <div className="mb-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-md inline-flex items-center">
              <span className="mr-1">Seller:</span>
              <span className="font-medium truncate max-w-[120px]">{product.seller}</span>
            </span>
          </div>
        )}
        
        <div className="mt-auto pt-4">
          {/* Price */}
          {product.price && (
            <div className="mb-3">
              <motion.span 
                className="text-lg font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 py-1 px-3 rounded-lg inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {product.price}
              </motion.span>
            </div>
          )}
          
          {/* Rating */}
          {product.rating && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(parseFloat(product.rating || "0")) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-zinc-300 dark:text-zinc-600"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 ml-1 font-medium">
                    {product.rating}
                  </span>
                </div>
                {product.reviewCount && (
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400">
                    {product.reviewCount} reviews
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}