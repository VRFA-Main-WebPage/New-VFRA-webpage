import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "cyber" | "vigilant";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("vfra-theme") as Theme;
        return stored === "cyber" ? "cyber" : "vigilant";
      } catch (e) {
        return "vigilant";
      }
    }
    return "vigilant";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove("theme-cyber", "theme-vigilant");
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    
    // Store in localStorage safely
    try {
      localStorage.setItem("vfra-theme", theme);
    } catch (e) {}
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "cyber" ? "vigilant" : "cyber"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
