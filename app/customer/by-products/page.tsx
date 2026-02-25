"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, MapPin } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { FloatingCartButton } from "@/components/floating-cart-button";

const byProductsData = {
  meat: {
    title: "Meats",
    products: [
      { id: 1, name: "Ready to Cook Mutton", price: 700, unit: "kg", image: "https://ae.freshtohome.com/blog/wp-content/uploads/2024/08/CookMuttonfaster3.png", farmer: "Raju Goats", village: "Chevella", distance: 12, rating: 4.8 },
      { id: 2, name: "Ready to Cook Chicken", price: 320, unit: "kg", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80", farmer: "Lakshmi Farms", village: "Shankarpally", distance: 8, rating: 4.9 },
      { id: 3, name: "Marinated Meat", price: 750, unit: "kg", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop&q=80", farmer: "Raju Goats", village: "Chevella", distance: 12, rating: 4.8 },
      { id: 4, name: "Curry Cut Meat", price: 720, unit: "kg", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop&q=80", farmer: "Raju Goats", village: "Chevella", distance: 12, rating: 4.8 },
    ]
  },
  vegetables: {
    title: "Vegetables",
    products: [
      { id: 1, name: "Dried Tomatoes", price: 400, unit: "kg", image: "https://nutritionustad.com/wp-content/uploads/make-dried-dried-tomatoes-at-home-1.jpg", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
      { id: 2, name: "Dried Leafy Greens", price: 450, unit: "kg", image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=800&h=600&fit=crop&q=80", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
      { id: 3, name: "Dried Onions", price: 350, unit: "kg", image: "https://thumbs.dreamstime.com/b/dried-onions-some-bowl-37187147.jpg", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
      { id: 4, name: "Dried Garlic", price: 500, unit: "kg", image: "https://tse3.mm.bing.net/th/id/OIP.W2ZemJZaN5gNlYDf4RVo7QHaHa?pid=Api&P=0&h=180", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
      { id: 5, name: "Dried Carrots", price: 380, unit: "kg", image: "https://thisnoshtalgiclife.com/wp-content/uploads/2023/06/carrots_shredded_dehydrated.jpeg", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
      { id: 6, name: "Dried Beetroot", price: 420, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.KS4RCMkCFgaOqtqmKwFKtgHaEI?pid=Api&P=0&h=180", farmer: "Organic Dried Vegetables", village: "Zaheerabad", distance: 28, rating: 4.5 },
    ]
  },
  "dried-fruits": {
    title: "Dried Fruits",
    products: [
      { id: 1, name: "Dried Mango", price: 450, unit: "kg", image: "https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=800&h=600&fit=crop&q=80", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 2, name: "Dried Banana", price: 380, unit: "kg", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop&q=80", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 3, name: "Dried Papaya", price: 420, unit: "kg", image: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800&h=600&fit=crop&q=80", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 4, name: "Dried Figs", price: 800, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.vcdS6rBoY15imc7Md4oWKQHaE8?pid=Api&P=0&h=180", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 5, name: "Dried Dates", price: 650, unit: "kg", image: "https://tse1.mm.bing.net/th/id/OIP.JsJcNd6MzOcY99qQ42O5DAHaDj?pid=Api&P=0&h=180", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 6, name: "Dried Apricots", price: 750, unit: "kg", image: "https://tse1.mm.bing.net/th/id/OIP.wkjqe1i4PZ4P9_EkXe2gYAHaHa?pid=Api&P=0&h=180", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 7, name: "Raisins", price: 350, unit: "kg", image: "https://tse1.mm.bing.net/th/id/OIP.E6qWlr3wxQJE7vCsV7WOkQHaF6?pid=Api&P=0&h=180", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
      { id: 8, name: "Dried Pineapple", price: 480, unit: "kg", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=600&fit=crop&q=80", farmer: "Dried Fruits Farm", village: "Anantapur", distance: 32, rating: 4.6 },
    ]
  },
  eggs: {
    title: "Country Eggs",
    products: [
      { id: 1, name: "Country Eggs", price: 8, unit: "piece", image: "https://tse3.mm.bing.net/th/id/OIP.Ork-g1I4QTeSHinQ3b2ZogHaE8?pid=Api&P=0&h=180", farmer: "Country Eggs Farm", village: "Pargi", distance: 19, rating: 4.8 },
      { id: 2, name: "Duck Eggs", price: 12, unit: "piece", image: "https://tse2.mm.bing.net/th/id/OIP.lqHT7E4LLX5kAa3cRz8R-QHaEv?pid=Api&P=0&h=180", farmer: "Country Eggs Farm", village: "Pargi", distance: 19, rating: 4.8 },
      { id: 3, name: "Broiler Eggs", price: 6, unit: "piece", image: "https://tse3.mm.bing.net/th/id/OIP.EIxTzYFkKbfs6paHxGbCKwHaEK?pid=Api&P=0&h=180", farmer: "Country Eggs Farm", village: "Pargi", distance: 19, rating: 4.8 },
    ]
  },
  "dried-fish": {
    title: "Dried Fish",
    products: [
      { id: 1, name: "Dried Bombil", price: 350, unit: "kg", image: "https://tse1.mm.bing.net/th/id/OIP.3Z90C3W287h0wGucc1puugHaDt?pid=Api&P=0&h=180", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
      { id: 2, name: "Dried Anchovy", price: 280, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.BhgFds94WePSnPN_sfY08gHaFP?pid=Api&P=0&h=180", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
      { id: 3, name: "Dried Mackerel", price: 400, unit: "kg", image: "https://thumbs.dreamstime.com/b/dried-mackerel-fish-outdoor-58488838.jpg", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
      { id: 4, name: "Dried Prawns", price: 600, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.wolX2HDvldAwH8rZ14djcAHaE6?pid=Api&P=0&h=180", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
      { id: 5, name: "Dried Sardines", price: 320, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.WrViAVhKHTfDL424YaMsMAHaEK?pid=Api&P=0&h=180", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
      { id: 6, name: "Dried Ribbon Fish", price: 450, unit: "kg", image: "https://tse4.mm.bing.net/th/id/OIP.7TW6i7A0WiVjtOMymDVPWgHaFc?pid=Api&P=0&h=180", farmer: "Coastal Dried Fish", village: "Nellore", distance: 35, rating: 4.7 },
    ]
  },
  dairy: {
    title: "Dairy Products",
    products: [
      { id: 1, name: "Organic Ghee", price: 650, unit: "kg", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=600&fit=crop&q=80", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
      { id: 2, name: "Fresh Paneer", price: 450, unit: "kg", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
      { id: 3, name: "Natural Yogurt", price: 80, unit: "kg", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&q=80", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
      { id: 4, name: "Farm Cheese", price: 550, unit: "kg", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=600&fit=crop&q=80", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
      { id: 5, name: "Fresh Butter", price: 500, unit: "kg", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=600&fit=crop&q=80", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
      { id: 6, name: "Buttermilk", price: 50, unit: "liter", image: "https://tse2.mm.bing.net/th/id/OIP.7tDappt0C1lQ7YOujY42oAHaE7?pid=Api&P=0&h=180", farmer: "Pure Dairy Farms", village: "Sangareddy", distance: 18, rating: 4.8 },
    ]
  }
};

export default function ByProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "meat";
  const { addToCart } = useCart();

  const data = byProductsData[category as keyof typeof byProductsData];

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart({
        farmerId: product.farmer,
        productType: product.name,
        breed: "Standard",
        price: product.price,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBack = () => {
    router.push('/customer?screen=1');
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <h1 className="text-base font-semibold text-gray-900">{data?.title}</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data?.products.map((product) => (
              <Card key={product.id} className="border border-gray-200 hover:border-gray-300 transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-semibold text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{product.village} · {product.distance}km</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-gray-900">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleAddToCart(product)} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 text-sm font-medium">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <FloatingCartButton />
    </div>
  );
}
