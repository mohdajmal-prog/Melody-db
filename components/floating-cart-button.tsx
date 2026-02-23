"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

export function FloatingCartButton() {
  const router = useRouter();
  const { cartSummary } = useCart();

  if (cartSummary.totalItems === 0) return null;

  return (
    <button
      onClick={() => router.push("/customer/cart")}
      className="fixed bottom-20 right-6 z-50 bg-primary text-white rounded-full p-3 shadow-2xl hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(22,163,74,0.5)]"
    >
      <ShoppingCart className="h-5 w-5" />
    </button>
  );
}
