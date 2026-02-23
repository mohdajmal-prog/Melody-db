"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmptyCartState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        Looks like you haven't added any items yet. Start shopping to fill your cart!
      </p>
      <Button
        onClick={() => router.push("/customer")}
        className="bg-primary hover:bg-primary/90"
      >
        Start Shopping
      </Button>
    </div>
  );
}
