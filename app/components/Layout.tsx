import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function Layout({ children, fullWidth = false, className = "" }: LayoutProps) {
  const { theme } = useTheme();
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors ${className}`}>
      <Header />
      <main className={`flex-grow pt-16 md:pt-20 ${fullWidth ? "" : "container mx-auto px-4 sm:px-6 lg:px-8"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 