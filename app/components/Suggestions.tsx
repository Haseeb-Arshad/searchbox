import { useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SuggestionsProps {
  suggestions: string[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 mb-8"
    >
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Suggested searches</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm transition-colors flex items-center gap-1.5"
            onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
          >
            <Sparkles className="h-3 w-3 text-primary-500" />
            {item}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}