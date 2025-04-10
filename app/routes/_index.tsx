import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EnhancedSearchBar from "../components/EnhancedSearchBar";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { Search, ShoppingBag, Zap, Sparkles } from "lucide-react";

export default function Index() {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <Search className="h-6 w-6 text-primary-500" />,
      title: "Smart Search",
      description: "Instantly find products across multiple stores with intelligent search"
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-accent-purple" />,
      title: "Compare Prices",
      description: "Easily compare prices from different retailers to get the best deal"
    },
    {
      icon: <Zap className="h-6 w-6 text-accent-orange" />,
      title: "Lightning Fast",
      description: "Get results in milliseconds with our optimized search technology"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent-teal" />,
      title: "Smart Recommendations",
      description: "Discover new products based on your preferences and search history"
    }
  ];

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="relative">
        {/* Hero section with animated background */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-background-light to-background-light dark:from-primary-950/40 dark:via-background-dark dark:to-background-dark min-h-[85vh] flex flex-col items-center justify-center px-4 py-20">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/20 dark:bg-primary-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-purple/10 dark:bg-accent-purple/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-primary">
                QuickFind
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
              Discover amazing products from across the web. <span className="font-medium">Instantly.</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl relative z-10"
          >
            <EnhancedSearchBar />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center relative z-10"
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Try searching for "smartphones", "headphones", or your favorite brands
            </p>
          </motion.div>
        </div>

        {/* Features section */}
        <section className="py-20 bg-surface-light dark:bg-surface-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose QuickFind?</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Our powerful search engine helps you find the best products at the best prices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to find what you're looking for?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Start searching now to discover amazing products from across the web
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start Searching
            </motion.button>
          </div>
        </section>
      </div>
    </Layout>
  );
}