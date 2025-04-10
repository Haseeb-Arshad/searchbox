import { useState } from "react";
import { motion } from "framer-motion";
import EnhancedSearchBar from "../components/EnhancedSearchBar";

export default function Index() {
  return (
    <main className="relative bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
          QuickFind
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Discover amazing products from across the web. Instantly.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-2xl"
      >
        <EnhancedSearchBar />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Try searching for "smartphones", "headphones", or your favorite brands
        </p>
      </motion.div>
    </main>
  );
}