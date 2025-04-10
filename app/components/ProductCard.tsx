import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, ExternalLink, Star, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

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

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-zinc-200 dark:border-zinc-800 h-full flex flex-col"
    >
      <div className="relative overflow-hidden group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.title}
              className="w-full h-60 object-cover"
              animate={{ 
                scale: isHovered ? 1.08 : 1,
                transition: { duration: 0.5 }
              }}
            />
          ) : (
            <div className="w-full h-60 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              <ShoppingCart className="h-8 w-8 text-zinc-400" />
            </div>
          )}
        </div>
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute top-3 right-3 z-10">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`bg-white/90 dark:bg-zinc-900/90 shadow-md p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
              isLiked ? 'bg-red-50 dark:bg-red-900/20' : ''
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
        
        <motion.div 
          className="absolute bottom-3 left-0 right-0 px-4 flex justify-between items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to={`/product/${product.id}`}
            className="px-4 py-2 bg-white/90 dark:bg-zinc-900/90 rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-2 transition-colors shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{product.storeName}</span>
          </div>
          
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 mb-2 text-lg">
            {product.title}
          </h3>
          
          {product.seller && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500 block mb-2">
              Seller: {product.seller}
            </span>
          )}
          
          {product.price && (
            <div className="mt-2 mb-3">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {product.price}
              </span>
            </div>
          )}
        </div>
        
        {product.rating && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
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
                <span className="text-xs text-zinc-500 dark:text-zinc-500">
                  {product.reviewCount} reviews
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}