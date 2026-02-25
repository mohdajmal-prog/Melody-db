"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, ArrowLeft, Star, ShieldCheck, MapPin } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { FloatingCartButton } from "@/components/floating-cart-button";

const mockProduct = {
  id: "1",
  type: "Goat",
  breed: "Osmanabadi",
  price: 22000,
  image: "/healthy-goat-farm-india.jpg",
  available: 8
};

export default function ProductPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const success = await addToCart({
        farmerId: "1",
        productType: mockProduct.type,
        breed: mockProduct.breed,
        price: mockProduct.price,
        weight: "22-28kg",
        minimumGuaranteedWeight: 22,
        quantity: quantity,
      });
      
      if (success) {
        toast.success(`${mockProduct.type} added to cart successfully!`);
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <h1 className="text-base font-semibold text-gray-900">Product Details</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
            <div className="relative h-80 rounded-lg overflow-hidden bg-white">
              <img src={mockProduct.image} alt={mockProduct.type} className="w-full h-full object-cover" />
              <Badge className="absolute top-3 right-3 bg-white text-gray-900 gap-1.5 px-2.5 py-1 shadow-sm border border-gray-200">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-medium">Verified</span>
              </Badge>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">{mockProduct.type}</h1>
                  <p className="text-sm text-gray-500">{mockProduct.breed}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Price</p>
                  <p className="text-2xl font-semibold text-gray-900">₹{mockProduct.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                    <img src={mockProduct.image} alt="Farmer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">Raju Goats</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      Chevella · 12km away
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-900">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="h-8 w-8 rounded hover:bg-gray-200"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-700" />
                  </Button>
                  <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setQuantity(Math.min(mockProduct.available, quantity + 1))} 
                    className="h-8 w-8 rounded hover:bg-gray-200"
                    disabled={quantity >= mockProduct.available}
                  >
                    <Plus className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Amount</span>
                <span className="text-2xl font-semibold text-gray-900">₹{(mockProduct.price * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Available Stock</span>
                <span className="font-medium text-green-600">{mockProduct.available} units</span>
              </div>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-sm font-medium rounded-lg transition-colors" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={isLoading || quantity > mockProduct.available}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
        </div>
      </div>
      <FloatingCartButton />
    </div>
  );
}
