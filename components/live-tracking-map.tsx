"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, TruckIcon, Phone, Home } from "lucide-react";

interface LiveTrackingMapProps {
  orderId: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  destination: string;
  eta: string;
  progress: number;
}

export function LiveTrackingMap({
  orderId,
  driverName,
  driverPhone,
  currentLocation,
  destination,
  eta,
  progress: initialProgress,
}: LiveTrackingMapProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [driverPosition, setDriverPosition] = useState({ x: 20, y: 30 });
  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    // Simulate driver movement
    if (!isMoving || progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 1, 100);
        // Update driver position based on progress (from bottom-left to top-right)
        setDriverPosition({
          x: 20 + (newProgress / 100) * 60,
          y: 30 - (newProgress / 100) * 10,
        });
        return newProgress;
      });
    }, 800); // Update every 800ms for smooth animation

    return () => clearInterval(interval);
  }, [isMoving, progress]);

  return (
    <Card className="overflow-hidden">
      {/* Animated Map */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
        {/* Road Paths */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 250 Q 150 200, 250 180 T 450 50"
            stroke="#1E7F4E"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,10"
          />
          <path
            d="M 50 250 Q 200 220, 350 150 T 500 80"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Destination Marker (Top Right) */}
        <div
          className="absolute top-8 right-12 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <div className="relative">
            <Home
              className="h-10 w-10 text-primary drop-shadow-lg"
              fill="currentColor"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-ping" />
          </div>
        </div>

        {/* Moving Driver Marker */}
        <div
          className="absolute transition-all duration-700 ease-in-out"
          style={{
            left: `${driverPosition.x}%`,
            top: `${driverPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative animate-pulse">
            <div className="bg-green-500 p-3 rounded-full shadow-2xl border-4 border-white">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Start Point Marker (Bottom Left) */}
        <div className="absolute bottom-8 left-12">
          <MapPin
            className="h-10 w-10 text-secondary drop-shadow-lg"
            fill="currentColor"
          />
        </div>

        {/* Live Status Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-green-700">
              LIVE TRACKING
            </span>
          </div>
        </div>

        {/* Current Location Badge */}
        <div className="absolute top-12 left-2 sm:top-16 sm:left-4 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg max-w-[150px] sm:max-w-[200px]">
          <div className="flex items-start gap-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Driver at</p>
              <p className="text-xs sm:text-sm font-semibold leading-tight">
                {currentLocation}
              </p>
            </div>
          </div>
        </div>

        {/* ETA Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Estimated Arrival
            </p>
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{eta}</span>
            </div>
          </div>
        </div>

        {/* Distance Progress Indicator */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg">
          <p className="text-xs sm:text-sm font-semibold">
            {progress}% Complete
          </p>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Delivery Progress</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-green-600 transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <TruckIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{driverName}</p>
              <p className="text-xs text-muted-foreground">
                Your delivery partner
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => alert(`Calling ${driverPhone}...`)}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>

        {/* Destination */}
        <div className="p-4 bg-muted/50 rounded-lg border border-muted">
          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Delivering to
              </p>
              <p className="text-sm font-medium leading-relaxed">
                {destination}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
