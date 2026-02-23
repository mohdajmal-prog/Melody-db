"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ShieldCheck, ShoppingCart } from "lucide-react";

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: any;
  product: any;
  onAddToCart: () => void;
}

export function ProductQuickView({ isOpen, onClose, farmer, product, onAddToCart }: QuickViewProps) {
  if (!farmer || !product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.type}</span>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-semibold">{farmer.rating}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={farmer.image}
              alt={farmer.name}
              className="w-full h-full object-cover"
            />
            {farmer.verified && (
              <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{farmer.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {farmer.village} • {farmer.distance}km
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Breed:</span>
                <span className="font-medium">{product.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Weight:</span>
                <span className="font-medium">
                  {product.weightRangeMin}-{product.weightRangeMax}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Age:</span>
                <span className="font-medium">{product.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available:</span>
                <span className="font-medium text-primary">{product.available} units</span>
              </div>
              {product.bulkAvailable && (
                <Badge variant="secondary" className="w-full justify-center">
                  Bulk Orders Available
                </Badge>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary">₹{product.price}/kg</span>
              </div>
              <Button
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
