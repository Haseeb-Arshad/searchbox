import { Link, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Search, Heart, Home, Grid, MessageCircle, Phone } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { header } from "framer-motion/client";
import { header } from "framer-motion/client";
import { header } from "framer-motion/client";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 20);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteProducts");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavCount(parsedFavorites.length);
      }
    } catch (error) {
      console.error("Error loading favorites count:", error);
    }
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Categories", path: "/categories", icon: Grid },
    { name: "About", path: "/about", icon: MessageCircle },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-6xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              relative rounded-2xl px-6 py-3 transition-all duration-300
              ${scrolled 
                ? 'bg-white/15 dark:bg-black/15 backdrop-blur-xl shadow-xl' 
                : 'bg-white/10 dark:bg-black/10 backdrop-blur-lg shadow-lg'
              }
            `}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-sm">Q</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">QuickFind</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-black dark:bg-white text-white dark:text-black' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Favorites */}
                <div className="relative">
                  <Link 
                    to="/favorites" 
                    className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                  >
                    <Heart size={16} />
                  </Link>
                  {favCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{favCount}</span>
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Mobile Menu */}
                <button 
                  onClick={() => setIsOpen(true)} 
                  className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                >
                  <Menu size={16} />
                </button>
              </div>
            </div>
          </motion.nav>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
              }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">QuickFind</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="px-4 py-2">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`py-3 px-4 flex items-center text-base font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'text-white bg-black dark:bg-white dark:text-black'
                            : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleTheme();
                      setIsOpen(false);
                    }}
                    className="py-3 px-4 flex items-center text-base font-medium text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mr-3" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-3" />
                        Dark Mode
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 