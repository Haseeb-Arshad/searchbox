import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";

export default function Index() {
  return (
    <main className="relative bg-gradient-to-r from-black-300 to-blue-100 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold kinetic-typography mb-8"
      >
        Welcome to QuickFind
      </motion.div>
      <SearchBar />
      <p className="mt-10 text-gray-500">
        Discover amazing products. Instantly.
      </p>
    </main>
  );
}