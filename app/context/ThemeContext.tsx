import { createContext, useState, useEffect, useContext } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: "light",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for system preference or saved preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
    }
  }, []);

  useEffect(() => {
    // Update DOM when theme changes
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode, 
        toggleTheme, 
        theme: isDarkMode ? "dark" : "light"
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 