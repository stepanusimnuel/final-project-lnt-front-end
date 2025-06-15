"use client";

import { useTheme } from "@/app/context/ThemeContext";

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg dark:bg-white bg-gray-800 dark:text-gray-800 text-white transition-all">
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
