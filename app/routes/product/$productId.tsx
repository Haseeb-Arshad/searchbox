import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LoaderFunction } from "@remix-run/node";

interface Product {
  title: string;
  image: string;
  detailedDescription: string;
  link: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:8080/api/product/${params.productId}`);
  const product = await response.json();
  return product;
};

export default function ProductDetail() {
  const product = useLoaderData<Product>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[600px] object-cover rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105"
        />
        <button className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 backdrop-blur-md">
          ❤️
        </button>
        <a
          href={product.link}
          className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-1 backdrop-blur-md hover:underline"
        >
          {product.link}
        </a>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl flex gap-8 bg-neutral-900 p-6 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-1/2 object-cover rounded-xl shadow-md"
              />
              <div className="flex flex-col justify-between">
                <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
                <p className="mb-4 overflow-y-auto">{product.detailedDescription}</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="self-end bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}