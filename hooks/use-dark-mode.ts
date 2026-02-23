"use client";

import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("melody_dark_mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = saved ? JSON.parse(saved) : prefersDark;
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("melody_dark_mode", JSON.stringify(newValue));
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newValue;
    });
  };

  return { isDark, toggleDarkMode };
}
