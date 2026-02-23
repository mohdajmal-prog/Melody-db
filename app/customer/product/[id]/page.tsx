"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, ArrowLeft, Star, ShieldCheck, MapPin, Package, Calendar } from "lucide-react";

import { useCart } from "@/hooks/use-cart";

interface Product {
  id: string;
  type: string;
  breed: string;
  price: number;
  image: string;
  available: number;
  description: string;
}

const mockProduct: Product = {
  id: "1",
  type: "Goat",
  breed: "Osmanabadi",
  price: 22000,
  image: "/healthy-goat-farm-india.jpg",
  available: 8,
  description: "Premium quality Osmanabadi goat, raised naturally on organic feed."
};

const relatedProducts = [
  { id: "2", name: "Buffalo", price: 45000, image: "/dairy-buffalo-milk-farm.jpg" },
  { id: "3", name: "Chicken", price: 250, image: "/desi-country-chicken-farm.jpg" },
  { id: "4", name: "Sheep", price: 18000, image: "/sheep-farm-india.jpg" }
];

const subProducts = [
  { id: "1", name: "Goat Milk", price: 80, unit: "liter", image: "/dairy-buffalo-milk-farm.jpg" },
  { id: "2", name: "Goat Meat", price: 750, unit: "kg", image: "/healthy-goat-farm-india.jpg" }
];

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bulkQty, setBulkQty] = useState(20);
  const { addToCart } = useCart();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setPage((p) => (p + 1) % 3);
      else setPage((p) => (p - 1 + 3) % 3);

    }
  };

  const handleAddToCart = async () => {
    await addToCart({
      farmerId: "1",
      productType: mockProduct.type,
      breed: mockProduct.breed,
      price: mockProduct.price,
      weight: "22-28kg",
      minimumGuaranteedWeight: 22,
    });
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Product Details</h1>
          <div></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Page 0: Product Details */}
        {page === 0 && (
          <div className="min-h-screen">
            <div className="relative h-64">
              <img src={mockProduct.image} alt={mockProduct.type} className="w-full h-full object-cover" />
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{mockProduct.type}</h1>
                  <p className="text-muted-foreground">{mockProduct.breed}</p>
                </div>
                <p className="text-2xl font-bold text-primary">₹{mockProduct.price.toLocaleString()}</p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                      <img src={mockProduct.image} alt="Farmer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">Raju Goats</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Chevella • 12km away
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Quantity</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">₹{(mockProduct.price * quantity).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        )}

        {/* Page 1: Related Products */}
        {page === 1 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map((p) => (
                <Card key={p.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-t-lg" />
                  <CardContent className="p-3">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm font-bold text-primary">₹{p.price.toLocaleString()}</p>
                    <Button size="sm" className="w-full mt-2">Add to Cart</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Page 2: Subscriptions */}
        {page === 2 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
            <div className="space-y-4">
              <Card className="border-2 border-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p className="font-bold text-lg">Weekly Plan</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Fresh products every week</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-primary">₹{Math.round(mockProduct.price * 0.9).toLocaleString()}</span>
                    <Badge>Save 10%</Badge>
                  </div>
                  <Button className="w-full">Subscribe Weekly</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <p className="font-bold text-lg">Monthly Plan</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Fresh products every month</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-green-600">₹{Math.round(mockProduct.price * 0.8).toLocaleString()}</span>
                    <Badge className="bg-green-600">Save 20%</Badge>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Subscribe Monthly</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t bg-card p-2 flex justify-around">
        {["Product", "Related", "Plans"].map((label, idx) => (
          <Button key={idx} variant={page === idx ? "default" : "ghost"} size="sm" onClick={() => setPage(idx)} className="flex-1">
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}