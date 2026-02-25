"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { LiveTrackingMap } from "@/components/live-tracking-map";
import { VerificationTimeline } from "@/components/verification-timeline";
import { TrustBadges } from "@/components/trust-badges";

export default function TrackOrderPage() {
  const orderData = {
    orderId: "ORD-2401",
    product: "Goat - 24-26kg",
    farmer: "Raju Goats, Chevella",
    amount: 18750,
  };

  const trackingData = {
    orderId: orderData.orderId,
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    currentLocation: "Near Wipro Circle",
    destination: "Flat 402, Rainbow Apartments, Madhapur, Hyderabad",
    eta: "12 mins",
    progress: 75,
  };

  const verificationSteps = [
    {
      title: "Order Confirmed",
      status: "completed" as const,
      timestamp: "10:15 AM",
      description: "Your order has been confirmed and assigned to farmer",
      hasVideo: false,
    },
    {
      title: "Farmer Video Verification",
      status: "completed" as const,
      timestamp: "10:30 AM",
      description: "Animal verified: Osmanabadi Goat, 25kg, healthy condition",
      hasVideo: true,
    },
    {
      title: "Driver Pickup",
      status: "completed" as const,
      timestamp: "11:00 AM",
      description: "Driver collected the product from farm with verification",
      hasVideo: true,
    },
    {
      title: "In Transit",
      status: "in_progress" as const,
      timestamp: "11:15 AM",
      description:
        "Order is on the way to your location with live GPS tracking",
      hasVideo: false,
    },
    {
      title: "Delivery",
      status: "pending" as const,
      description: "Delivery will be completed with photo verification",
      hasVideo: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Track Order</h1>
              <p className="text-sm text-muted-foreground">
                {orderData.orderId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Order Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm sm:text-base truncate">
                    {orderData.product}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {orderData.farmer}
                  </p>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-primary flex-shrink-0">
                ₹{orderData.amount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <TrustBadges badges={["verified", "video", "tracked", "quality"]} />

        {/* Live Tracking Map */}
        <LiveTrackingMap {...trackingData} />

        {/* Verification Timeline */}
        <VerificationTimeline
          orderId={orderData.orderId}
          steps={verificationSteps}
          onViewVideo={(index) => alert(`Viewing video for step ${index + 1}`)}
        />
      </div>
    </div>
  );
}
