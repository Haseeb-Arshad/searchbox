import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, ExternalLink } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  return (
    <motion.div 
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-zinc-200 dark:border-zinc-800 h-full flex flex-col"
    >
      <div className="relative overflow-hidden group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-60 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              <ShoppingCart className="h-8 w-8 text-zinc-400" />
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="bg-white dark:bg-zinc-900 shadow-md p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Heart className="h-4 w-4 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400" />
          </motion.button>
        </div>
        
        <div className="absolute bottom-2 left-0 right-0 px-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between">
          <Link
            to={`/product/${product.id}`}
            className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2 mb-1">
            {product.title}
          </h3>
          <div className="flex items-start justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{product.storeName}</span>
              {product.seller && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Seller: {product.seller}
                </span>
              )}
            </div>
            {product.price && (
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {product.price}
              </span>
            )}
          </div>
        </div>
        
        {product.rating && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(parseFloat(product.rating || "0")) 
                          ? "text-yellow-400" 
                          : "text-zinc-300 dark:text-zinc-600"
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  {product.rating}
                </span>
              </div>
              {product.reviewCount && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
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