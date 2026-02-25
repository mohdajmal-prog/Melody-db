"use client";

import { Home, ShoppingBag, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    name: "Home",
    href: "/customer",
    icon: Home,
  },
  {
    name: "Orders",
    href: "/customer/orders",
    icon: ShoppingBag,
  },
  {
    name: "Wishlist",
    href: "/customer/wishlist",
    icon: Heart,
  },
  {
    name: "Account",
    href: "/customer/account",
    icon: User,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  
  // Hide navigation on product page
  if (pathname === '/customer/product') {
    return null;
  }


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-md">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon
                  className={cn("h-5 w-5 mb-1", isActive ? "fill-current" : "")}
                />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
