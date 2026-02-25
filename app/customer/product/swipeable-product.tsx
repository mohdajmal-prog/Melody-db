"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, ChefHat, Calendar, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  available: number;
  description: string;
}

const getSubProducts = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes("goat")) return [
    { id: "1", name: "Goat Milk", price: 80, unit: "liter", image: "/dairy-buffalo-milk-farm.jpg" },
    { id: "2", name: "Goat Meat", price: 750, unit: "kg", image: "/healthy-goat-farm-india.jpg" },
    { id: "3", name: "Goat Liver", price: 400, unit: "kg", image: "/healthy-goat-farm-india.jpg" },
  ];
  if (name.includes("cow") || name.includes("buffalo")) return [
    { id: "1", name: "Milk", price: 60, unit: "liter", image: "/dairy-buffalo-milk-farm.jpg" },
    { id: "2", name: "Ghee", price: 500, unit: "kg", image: "/dairy-buffalo-milk-farm.jpg" },
    { id: "3", name: "Curd", price: 50, unit: "kg", image: "/dairy-buffalo-milk-farm.jpg" },
  ];
  if (name.includes("chicken")) return [
    { id: "1", name: "Chicken Eggs", price: 6, unit: "piece", image: "/desi-country-chicken-farm.jpg" },
    { id: "2", name: "Chicken Meat", price: 280, unit: "kg", image: "/desi-country-chicken-farm.jpg" },
    { id: "3", name: "Chicken Breast", price: 320, unit: "kg", image: "/desi-country-chicken-farm.jpg" },
  ];
  return [
    { id: "1", name: "Product 1", price: 100, unit: "kg", image: "/placeholder.jpg" },
    { id: "2", name: "Product 2", price: 200, unit: "kg", image: "/placeholder.jpg" },
  ];
};

const allProducts = [
  { id: "1", name: "Goat", price: 22000, image: "/healthy-goat-farm-india.jpg", available: 8 },
  { id: "2", name: "Buffalo", price: 45000, image: "/dairy-buffalo-milk-farm.jpg", available: 5 },
  { id: "3", name: "Chicken", price: 250, image: "/desi-country-chicken-farm.jpg", available: 50 },
  { id: "4", name: "Sheep", price: 18000, image: "/sheep-farm-india.jpg", available: 12 },
];

export default function SwipeableProduct({ product }: { product: Product }) {
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bulkQty, setBulkQty] = useState(20);
  const [scrollY, setScrollY] = useState(0);

  const subProducts = getSubProducts(product.name);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        setPage((p) => (p + 1) % 4);
      } else {
        // Swipe right
        setPage((p) => (p - 1 + 4) % 4);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
      >
        {/* Page 0: Product Details */}
        {page === 0 && (
          <div className="min-h-screen">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
              </div>

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
                    <span className="text-xl font-bold text-primary">₹{(product.price * quantity).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {scrollY > 100 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <ChefHat className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Bulk Orders Available</p>
                        <p className="text-sm text-muted-foreground">For weddings, events & function halls</p>
                        <Input placeholder="Enter quantity (min 20kg)" className="mt-2" type="number" min={20} value={bulkQty} onChange={(e) => setBulkQty(parseInt(e.target.value) || 20)} />
                        <Button className="w-full mt-2" variant="outline">Request Bulk Quote</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Page 1: All Products */}
        {page === 1 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Products</h2>
            <div className="grid grid-cols-2 gap-4">
              {allProducts.map((p) => (
                <Card key={p.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setPage(0)}>
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-t-lg" />
                  <CardContent className="p-3">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm font-bold text-primary">₹{p.price.toLocaleString()}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{p.available} available</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Page 2: Sub Products */}
        {page === 2 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{product.name} Products</h2>
            <div className="space-y-4">
              {subProducts.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img src={sub.image} alt={sub.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">per {sub.unit}</p>
                      <p className="text-lg font-bold text-primary mt-1">₹{sub.price}</p>
                      <Button size="sm" className="mt-2">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Page 3: Subscriptions */}
        {page === 3 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
            <div className="space-y-4">
              <Card className="border-2 border-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p className="font-bold text-lg">Weekly Subscription</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Get fresh {product.name.toLowerCase()} products every week</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-primary">₹{Math.round(product.price * 0.9).toLocaleString()}</span>
                    <Badge>Save 10%</Badge>
                  </div>
                  <Button className="w-full">Subscribe Weekly</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <p className="font-bold text-lg">Monthly Subscription</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Get fresh {product.name.toLowerCase()} products every month</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-green-600">₹{Math.round(product.price * 0.8).toLocaleString()}</span>
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
        {["Product", "All", "Sub", "Plans"].map((label, idx) => (
          <Button key={idx} variant={page === idx ? "default" : "ghost"} size="sm" onClick={() => setPage(idx)} className="flex-1">
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
