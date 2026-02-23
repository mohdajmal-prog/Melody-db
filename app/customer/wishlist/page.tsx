"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  MapPin,
  Star,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { useRouter } from "next/navigation";

export default function WishlistScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    setWishlistItems([]);
  }, [favorites]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
          <p className="text-sm text-white/90">Your saved farm-fresh favorites</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start adding your favorite farm-fresh products
            </p>
            <Button onClick={() => router.push('/customer')}>Explore Products</Button>
          </div>
        ) : (
          wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group relative">
            {/* Remove from wishlist button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
              onClick={() => removeFromWishlist(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Product Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.farmer}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {item.verified && (
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.farmer}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {item.village} • {item.distance}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-semibold">{item.rating}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="border-t pt-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.product.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.breed}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ₹{item.product.price}/kg
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                  <div>
                    <span className="font-medium">Weight:</span>{" "}
                    {item.product.weight}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {item.product.age}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Available:</span>{" "}
                    <span className="text-primary font-semibold">
                      {item.product.available} units
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 bg-transparent"
                  >
                    <Video className="h-4 w-4" />
                    View Video
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
