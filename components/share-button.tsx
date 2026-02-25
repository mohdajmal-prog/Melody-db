"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  farmerId: string;
  farmerName: string;
  productType: string;
}

export function ShareButton({ farmerId, farmerName, productType }: ShareButtonProps) {
  const handleShare = () => {
    const url = `${window.location.origin}/customer/product?farmerId=${farmerId}`;
    const text = `Check out ${productType} from ${farmerName} on Melody! 🌾`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      className="absolute top-3 left-3 bg-white/90 hover:bg-white"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
