import { useLoaderData, Link } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import type { LoaderFunction } from "@remix-run/node";
import { 
  ArrowLeft, Heart, Share, ExternalLink, Star, ShoppingBag, 
  ChevronDown, ZoomIn, X, ChevronRight, ChevronLeft, Tag
} from "lucide-react";
import EnhancedSearchBar from "../../components/EnhancedSearchBar";
import Layout from "../../components/Layout";
import { useTheme } from "../../context/ThemeContext";

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
  try {
    const response = await fetch(`http://localhost:8080/api/product/${params.productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    // Return mock data if API is not available
    return getMockProduct(params.productId);
  }
};

// Mock data for development purposes
function getMockProduct(id: string) {
  return {
    id,
    title: "Apple iPhone 13 Pro Max - 256GB - Graphite",
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=1000&auto=format&fit=crop",
    detailedDescription: "Experience the ultimate in smartphone technology with the iPhone 13 Pro Max. Featuring the A15 Bionic chip, Super Retina XDR display with ProMotion, and an advanced camera system with new 77mm Telephoto, Ultra Wide, and Wide cameras. Capture stunning photos and 4K Dolby Vision HDR video with Cinematic mode. Enjoy incredible battery life and the toughest glass in a smartphone with Ceramic Shield. With 5G capability, you'll get faster downloads and high-quality streaming. The 256GB storage gives you plenty of space for apps, photos, and videos. The Graphite finish provides a sleek, professional look that's both elegant and durable. This device is compatible with MagSafe accessories and wireless chargers.",
    link: "https://example.com/product/1",
    price: "$1,099.00",
    rating: "4.8",
    reviewCount: "1243",
    storeName: "Apple Store"
  };
}

export default function ProductDetail() {
  const product = useLoaderData<Product>();
  const [isLiked, setIsLiked] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // State for image zoom
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Check if product is already in favorites
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
  const toggleFavorite = () => {
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

  // Handle mouse move for image zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    // Calculate percentage position
    const xPct = mouseX / width;
    const yPct = mouseY / height;
    
    // Calculate transform values (reversed to move image in the opposite direction)
    x.set(-((xPct - 0.5) * 50));
    y.set(-((yPct - 0.5) * 50));
    
    setMousePosition({ x: xPct, y: yPct });
  };

  // Generate additional product images for gallery
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?q=80&w=500&auto=format&fit=crop"
  ];

  // Generate star rating elements if rating exists
  const renderStars = () => {
    if (!product.rating) return null;
    
    const rating = parseFloat(product.rating);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-zinc-300 dark:text-zinc-600'
          }`} 
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1 mt-2">
        <div className="flex">{stars}</div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {product.rating} 
          {product.reviewCount && <span className="ml-1">({product.reviewCount} reviews)</span>}
        </span>
      </div>
    );
  };

  // Determine if description should be truncated
  const isTruncatable = product.detailedDescription?.length > 300;
  const displayDescription = isDescriptionExpanded || !isTruncatable 
    ? product.detailedDescription 
    : `${product.detailedDescription?.substring(0, 300)}...`;

  // Generate random similar products
  const generateSimilarProducts = () => {
    return [
      {
        id: "sim1",
        title: "iPhone 13 - 128GB - Blue",
        image: "https://images.unsplash.com/photo-1619683172106-ff3a712e65e5?q=80&w=500&auto=format&fit=crop",
        price: product.price ? `$${Math.floor(parseInt(product.price.replace(/[^\d.-]/g, '')) * 0.9)}` : "$899.99",
        storeName: product.storeName || "Store Name",
        rating: "4.6"
      },
      {
        id: "sim2",
        title: "iPhone 13 Mini - 128GB - Pink",
        image: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?q=80&w=500&auto=format&fit=crop",
        price: product.price ? `$${Math.floor(parseInt(product.price.replace(/[^\d.-]/g, '')) * 0.8)}` : "$799.99",
        storeName: product.storeName || "Store Name",
        rating: "4.5"
      },
      {
        id: "sim3",
        title: "iPhone 13 Pro - 256GB - Sierra Blue",
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=500&auto=format&fit=crop",
        price: product.price ? `$${Math.floor(parseInt(product.price.replace(/[^\d.-]/g, '')) * 0.95)}` : "$999.99",
        storeName: product.storeName || "Store Name",
        rating: "4.7"
      }
    ];
  };

  const similarProducts = generateSimilarProducts();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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

  return (
    <Layout>
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <EnhancedSearchBar />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link 
              to="/search" 
              className="inline-flex items-center text-sm text-zinc-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to search results
            </Link>
          </motion.div>
          
          {/* Product details section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Product Image Gallery */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                ref={imageContainerRef}
                className={`relative overflow-hidden rounded-xl shadow-md ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onMouseMove={handleMouseMove}
                onClick={() => setIsZoomed(!isZoomed)}
                onMouseLeave={() => isZoomed && setIsZoomed(false)}
              >
                <motion.div 
                  className="relative pt-[100%]"
                  animate={{
                    scale: isZoomed ? 2 : 1
                  }}
                  style={{
                    x: isZoomed ? x : 0,
                    y: isZoomed ? y : 0
                  }}
                  transition={{
                    type: "spring", 
                    stiffness: 300, 
                    damping: isZoomed ? 50 : 30
                  }}
                >
                  <img
                    src={productImages[imageIndex]}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </motion.div>

                {/* Zoom indicator */}
                {!isZoomed && (
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-md">
                    <ZoomIn className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
                
                {/* Product brand/store badge */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 py-1 px-2.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{product.storeName}</span>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex gap-3 justify-center">
                {productImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-16 w-16 rounded-md overflow-hidden ${
                      imageIndex === idx 
                        ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-zinc-900' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setImageIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Product view ${idx + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center gap-3 mt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className={`py-2 px-4 rounded-lg flex items-center gap-2 ${
                    isLiked 
                      ? 'bg-red-50 dark:bg-red-900/20 text-accent-pink' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  } transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-accent-pink' : ''}`} />
                  <span className="text-sm font-medium">{isLiked ? 'Saved' : 'Save'}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  <span className="text-sm font-medium">Share</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Product Details */}
            <motion.div variants={itemVariants} className="flex flex-col">
              {/* Store name */}
              {product.storeName && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {product.storeName}
                  </span>
                </div>
              )}
              
              {/* Product title */}
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                {product.title}
              </h1>
              
              {/* Rating */}
              {renderStars()}
              
              {/* Price */}
              {product.price && (
                <motion.div 
                  className="mt-6 mb-6"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                    {product.price}
                  </span>
                </motion.div>
              )}
              
              {/* Description */}
              <div className="mt-4 mb-8">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">Description</h3>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800"
                >
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {displayDescription}
                  </p>
                  
                  {isTruncatable && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center font-medium"
                    >
                      {isDescriptionExpanded ? "Show less" : "Show more"}
                      <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`} />
                    </motion.button>
                  )}
                </motion.div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Visit Store</span>
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>View Original</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Similar Products Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-8"
            >
              Similar Products
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similarProducts.map((similarProduct, idx) => (
                <motion.div
                  key={similarProduct.id}
                  variants={itemVariants}
                  custom={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-zinc-800 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white/90 dark:bg-zinc-800/90 text-primary-600 dark:text-primary-400">
                        <Tag className="h-3 w-3" />
                        {similarProduct.storeName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2 text-sm">
                      {similarProduct.title}
                    </h3>
                    
                    <div className="mt-auto pt-3 flex items-end justify-between">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {similarProduct.price}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          {similarProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Full screen zoom modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.button
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            <motion.img
              src={productImages[imageIndex]}
              alt={product.title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}