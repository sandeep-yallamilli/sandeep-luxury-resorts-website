import { useTheme } from "@/context/theme-context";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 text-gold hover:text-foreground transition-all duration-500 cursor-pointer rounded-full hover:bg-gold/10 flex items-center justify-center group ${className}`}
      aria-label="Toggle Theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 transition-transform duration-500 group-hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
      )}
    </button>
  );
}
