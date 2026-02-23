"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("melody_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (farmerId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(farmerId)
        ? prev.filter((id) => id !== farmerId)
        : [...prev, farmerId];
      localStorage.setItem("melody_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (farmerId: string) => favorites.includes(farmerId);

  return { favorites, toggleFavorite, isFavorite };
}
