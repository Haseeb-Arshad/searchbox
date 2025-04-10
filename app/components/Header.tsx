import { Link, useLocation } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, Moon, Sun, Search, ShoppingBag, Heart, Home, Grid, Phone, MessageCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// NavLink component with enhanced animations
const AnimatedNavLink = ({ name, path, isActive, onClick }: { name: string; path: string; isActive: boolean; onClick?: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  // Text opacity based on mouse position (subtle effect)
  const textOpacity = useTransform(mouseX, [0, 100], [0.9, 1]);

  return (
    <Link
      ref={linkRef}
      to={path}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm rounded-lg font-medium transition-all overflow-hidden ${
        isActive 
          ? "text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20" 
          : "text-zinc-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400"
      }`}
    >
      <motion.span 
        style={{ opacity: textOpacity }}
        className="relative z-10 flex items-center gap-1.5"
      >
        {/* Icon for the link based on its name */}
        {name === "Home" && <Home className="h-3.5 w-3.5" />}
        {name === "Search" && <Search className="h-3.5 w-3.5" />}
        {name === "Categories" && <Grid className="h-3.5 w-3.5" />}
        {name === "About" && <MessageCircle className="h-3.5 w-3.5" />}
        {name === "Contact" && <Phone className="h-3.5 w-3.5" />}
        {name}
      </motion.span>
      
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-900/20 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

// ActionButton component with enhanced animations
const ActionButton = ({ to, icon, label, onClick }: { to?: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="relative p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label={label}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {icon}
        </motion.div>
      </Link>
    );
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative p-2.5 text-zinc-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [favCount, setFavCount] = useState(0);

  // Detect scroll to add background to header
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 10);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Load favorites count from localStorage
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
  }, [location.pathname]); // Refresh count when route changes

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent mr-1">Quick</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">Find</span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <AnimatePresence>
              {navLinks.map((link) => (
                <AnimatedNavLink 
                  key={link.name}
                  name={link.name}
                  path={link.path}
                  isActive={link.path === location.pathname}
                />
              ))}
            </AnimatePresence>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Search Button */}
            <ActionButton 
              to="/search"
              icon={<Search className="h-5 w-5" />}
              label="Search"
            />
            
            {/* Favorites */}
            <div className="relative">
              <ActionButton 
                to="/favorites"
                icon={<Heart className="h-5 w-5" />}
                label="Favorites"
              />
              {favCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-accent-pink text-white text-[10px] font-bold rounded-full"
                >
                  {favCount}
                </motion.div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <ActionButton 
              icon={theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
            />
            
            {/* Mobile Menu Button */}
            <ActionButton 
              icon={<Menu className="h-6 w-6" />}
              label="Open mobile menu"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>
      
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
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-zinc-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent mr-1">Quick</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">Find</span>
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
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedNavLink 
                        name={link.name}
                        path={link.path}
                        isActive={link.path === location.pathname}
                        onClick={handleNavLinkClick}
                      />
                    </motion.div>
                  ))}
                </nav>
                
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/favorites"
                      className="py-3 px-4 flex items-center text-base font-medium text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
                      onClick={handleNavLinkClick}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      Favorites
                      {favCount > 0 && (
                        <span className="ml-2 text-xs font-bold bg-accent-pink text-white px-2 py-0.5 rounded-full">
                          {favCount}
                        </span>
                      )}
                    </Link>
                    
                    <motion.button
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        toggleTheme();
                        setIsOpen(false);
                      }}
                      className="py-3 px-4 flex items-center text-base font-medium text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 